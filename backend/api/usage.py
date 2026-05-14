from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

from database import get_db
from models import UsageLog, User as UserModel
from config import settings
from api.endpoints.auth import get_current_active_user

router = APIRouter()


def check_usage(db: Session, user: UserModel) -> dict:
    if user.plan == "pro":
        return {"allowed": True, "words_remaining": 999999, "ai_remaining": 999999}

    today = date.today()
    log = db.query(UsageLog).filter(
        UsageLog.user_id == user.id, UsageLog.date == today
    ).first()

    words_used = log.word_count if log else 0
    ai_used = log.ai_accepts if log else 0

    return {
        "allowed": words_used < settings.FREE_TIER_DAILY_WORDS and ai_used < 15,
        "words_remaining": max(0, settings.FREE_TIER_DAILY_WORDS - words_used),
        "ai_remaining": max(0, 15 - ai_used),
        "words_used": words_used,
        "ai_used": ai_used,
    }


def record_usage(db: Session, user_id, word_count: int = 0, ai_accept: bool = False):
    today = date.today()
    log = db.query(UsageLog).filter(
        UsageLog.user_id == user_id, UsageLog.date == today
    ).first()

    if not log:
        log = UsageLog(user_id=user_id, date=today, word_count=0, ai_accepts=0)
        db.add(log)

    log.word_count += word_count
    if ai_accept:
        log.ai_accepts += 1
    db.commit()


@router.get("/usage")
async def get_usage(
    current_user=Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    usage = check_usage(db, current_user)
    return {
        "plan": current_user.plan,
        "words_used": usage.get("words_used", 0),
        "words_limit": settings.FREE_TIER_DAILY_WORDS if current_user.plan == "free" else 999999,
        "ai_used": usage.get("ai_used", 0),
        "ai_limit": 15 if current_user.plan == "free" else 999999,
        "allowed": usage["allowed"],
    }
