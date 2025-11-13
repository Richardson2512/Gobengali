# 🚀 GoBengali - Quick Reference Guide

## 📁 Folder Organization - At a Glance

```
gobengali/                          ← MAIN PROJECT FOLDER
│
├── 📄 README.md                    ← Start here
├── 📄 LICENSE                      ← MIT License
├── 📄 .gitignore                   ← Git ignore rules
├── 📄 SETUP_INSTRUCTIONS.md        ← How to organize
├── 📄 DEPLOYMENT.md                ← How to deploy
├── 📄 FOLDER_ORGANIZATION_COMPLETE.md  ← Complete guide
├── 📄 QUICK_REFERENCE.md           ← This file
│
├── 🔧 organize-files.ps1           ← Windows script
├── 🔧 organize-files.sh            ← macOS/Linux script
│
├── 📂 frontend/                    ← Next.js App
│   ├── README.md
│   ├── package.json
│   ├── app/                        ← Pages
│   ├── components/                 ← React components
│   ├── lib/                        ← Utilities
│   └── store/                      ← State management
│
└── 📂 backend/                     ← FastAPI App
    ├── README.md
    ├── requirements.txt
    ├── main.py                     ← App entry
    ├── api/                        ← Endpoints
    └── models/                     ← ML models
```

## ⚡ Quick Commands

### Organize Files (Choose One)

```powershell
# Windows
.\gobengali\organize-files.ps1
```

```bash
# macOS/Linux
chmod +x gobengali/organize-files.sh
./gobengali/organize-files.sh
```

### Start Development

```bash
# Terminal 1 - Frontend
cd gobengali/frontend
npm install
npm run dev
# → http://localhost:3000

# Terminal 2 - Backend
cd gobengali/backend
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
uvicorn main:app --reload
# → http://localhost:8000
# → http://localhost:8000/docs (API docs)
```

### Deploy

```bash
# Frontend (Vercel)
cd gobengali/frontend
vercel --prod

# Backend (Railway)
cd gobengali/backend
railway up
```

## 📊 Project Stats

- **Language**: TypeScript (Frontend) + Python (Backend)
- **Frontend**: Next.js 14, React 18, TipTap, TailwindCSS
- **Backend**: FastAPI, PyTorch, Transformers
- **ML Model**: NLLB-200 (~1.5GB)
- **Total Files**: 25+ files created
- **Lines of Code**: 3000+ lines

## 🎯 Key Features

✅ Translation (200+ languages → Bengali)  
✅ Grammar checking  
✅ Spelling correction  
✅ Inline corrections (Grammarly-style)  
✅ AI Assistant panel  
✅ Export (TXT, DOCX, PDF)  
✅ User authentication (JWT)  
✅ Free & Pro tiers  

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/analyze` | POST | Full analysis (translate + corrections) |
| `/translate` | POST | Translation only |
| `/detect-language` | POST | Language detection |
| `/grammar/check` | POST | Grammar checking |
| `/spelling/check` | POST | Spelling checking |
| `/auth/register` | POST | User registration |
| `/auth/token` | POST | Login (get JWT) |
| `/auth/me` | GET | Get profile |
| `/health` | GET | Health check |

## 🎨 Tech Stack Overview

### Frontend
- **Framework**: Next.js 14
- **Language**: TypeScript
- **Editor**: TipTap
- **State**: Zustand
- **Styling**: TailwindCSS
- **HTTP**: Axios

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.10+
- **ML**: PyTorch + Transformers
- **Auth**: JWT
- **Server**: Uvicorn

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Main overview |
| `SETUP_INSTRUCTIONS.md` | How to organize files |
| `DEPLOYMENT.md` | Production deployment |
| `FOLDER_ORGANIZATION_COMPLETE.md` | Complete organization guide |
| `QUICK_REFERENCE.md` | This cheat sheet |
| `frontend/README.md` | Frontend docs |
| `backend/README.md` | Backend docs |

## 🔧 Environment Variables

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=GoBengali
NEXT_PUBLIC_MAX_FREE_WORDS=1000
```

### Backend (`.env`)
```env
DEBUG=True
USE_GPU=False
CORS_ORIGINS=http://localhost:3000
SECRET_KEY=change-this-in-production
```

## ✅ Pre-Deployment Checklist

- [ ] Files organized in `gobengali/` folder
- [ ] Frontend installs and runs
- [ ] Backend installs and runs
- [ ] Both servers communicate
- [ ] Translation works end-to-end
- [ ] AI Assistant shows errors
- [ ] Export functionality works
- [ ] Environment variables set
- [ ] Code pushed to Git
- [ ] Ready to deploy!

## 🚀 Deployment Platforms

| Component | Platform | Why |
|-----------|----------|-----|
| Frontend | Vercel | Optimized for Next.js |
| Backend | Railway | GPU support, easy Python |
| Database | MongoDB Atlas | Managed, free tier |
| Cache | Redis Cloud | Fast, managed |

## 💡 Quick Tips

1. **Always activate venv** before running backend
2. **Check both servers running** on different ports
3. **Read error messages** in browser console and terminal
4. **Use API docs** at `/docs` to test endpoints
5. **Keep dependencies updated** with `npm update` and `pip list --outdated`

## 🐛 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Port 3000 in use | `npm run dev -- -p 3001` |
| Port 8000 in use | `uvicorn main:app --port 8001` |
| Module not found | `npm install` or `pip install -r requirements.txt` |
| CORS error | Check `CORS_ORIGINS` in backend `.env` |
| Models not loading | Check disk space, need ~2GB |

## 📞 Help Resources

- **Main README**: Overview and setup
- **API Docs**: http://localhost:8000/docs
- **Inline Comments**: Check source code
- **Error Messages**: Read terminal output

## 🎯 Next Steps Workflow

```
1. Organize Files
   ↓
2. Install Dependencies
   ↓
3. Start Development Servers
   ↓
4. Test Locally
   ↓
5. Push to Git
   ↓
6. Deploy to Production
   ↓
7. Monitor & Scale
```

## 📊 Performance Targets

- Translation: < 2 seconds for 500 words
- UI Updates: < 100ms
- API Response: < 1 second
- First Load: < 3 seconds
- Model Accuracy: > 90%

## 🔐 Security Notes

- Change `SECRET_KEY` in production
- Set `DEBUG=False` in production
- Use HTTPS only
- Implement rate limiting
- Regular security updates

## 🎉 Success Indicators

✅ Frontend accessible at port 3000  
✅ Backend accessible at port 8000  
✅ API docs work at `/docs`  
✅ Translation produces Bengali text  
✅ Errors shown in AI Assistant  
✅ Export downloads files  
✅ No console errors  

---

## 📖 Full Documentation

For detailed information, see:
- `README.md` - Complete overview
- `SETUP_INSTRUCTIONS.md` - Organization guide
- `DEPLOYMENT.md` - Deployment guide
- `frontend/README.md` - Frontend details
- `backend/README.md` - Backend details

---

**Quick Start Command** (after organization):

```bash
cd gobengali
# Open 2 terminals and run:
cd frontend && npm install && npm run dev
cd backend && python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt && uvicorn main:app --reload
```

**That's it! You're ready to go!** 🚀

---

*Last Updated: November 2025*  
*Version: 1.0.0*

