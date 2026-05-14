"""
Razorpay payment endpoints
"""
import hmac
import hashlib
import logging
from datetime import datetime, timedelta, timezone
from typing import Literal

import razorpay
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from config import settings
from database import get_db
from db_models import User as UserModel
from .auth import get_current_active_user
from sqlalchemy.orm import Session

router = APIRouter()
logger = logging.getLogger(__name__)

PLANS = {
    "monthly": 29900,   # ₹299 in paise
    "annual": 299900,   # ₹2999 in paise
}


def _razorpay_client():
    if not settings.RAZORPAY_KEY_ID or not settings.RAZORPAY_KEY_SECRET:
        raise HTTPException(status_code=503, detail="Payment service not configured")
    return razorpay.Client(
        auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
    )


class CreateOrderRequest(BaseModel):
    plan: Literal["monthly", "annual"]


class CreateOrderResponse(BaseModel):
    order_id: str
    amount: int
    currency: str
    key_id: str


class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


@router.post("/payments/create-order", response_model=CreateOrderResponse)
async def create_order(
    body: CreateOrderRequest,
    current_user: UserModel = Depends(get_current_active_user),
):
    client = _razorpay_client()
    amount = PLANS[body.plan]

    try:
        order = client.order.create({
            "amount": amount,
            "currency": "INR",
            "payment_capture": 1,
            "notes": {
                "plan": body.plan,
                "email": current_user.email,
            },
        })
    except Exception as e:
        logger.error(f"Razorpay order creation failed: {e}", exc_info=True)
        raise HTTPException(status_code=502, detail="Failed to create payment order")

    return CreateOrderResponse(
        order_id=order["id"],
        amount=amount,
        currency="INR",
        key_id=settings.RAZORPAY_KEY_ID,
    )


@router.post("/payments/verify")
async def verify_payment(
    body: VerifyPaymentRequest,
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    expected = hmac.HMAC(
        settings.RAZORPAY_KEY_SECRET.encode(),
        f"{body.razorpay_order_id}|{body.razorpay_payment_id}".encode(),
        hashlib.sha256,
    ).hexdigest()

    if not hmac.compare_digest(expected, body.razorpay_signature):
        raise HTTPException(status_code=400, detail="Invalid payment signature")

    current_user.plan = "pro"
    current_user.plan_expires_at = datetime.now(timezone.utc) + timedelta(days=365)
    db.commit()

    logger.info(f"Payment verified for {current_user.email}")
    return {"success": True, "plan": "pro"}
