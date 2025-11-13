# 🚀 Start GoBengali Backend - Step by Step

## Quick Start Command:

Open PowerShell and run these commands ONE BY ONE:

```powershell
# 1. Navigate to backend
cd C:\Users\AMD\gobengali\backend

# 2. Activate virtual environment
.\venv\Scripts\activate

# 3. Start the server (simplified version)
python main_simple.py
```

**Backend will run at:** http://localhost:8000

---

## Test Health Endpoint:

Once the server starts, open a NEW PowerShell and run:

```powershell
curl http://localhost:8000/health
```

Or open in browser: **http://localhost:8000/health**

---

## Expected Output:

```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

---

## Health Check Response:

```json
{
  "status": "healthy",
  "models_loaded": false,
  "version": "1.0.0",
  "message": "API is running"
}
```

---

## If Server Doesn't Start:

Check the terminal output for error messages!

Common issues:
- Port 8000 already in use → Use different port
- Import errors → Missing dependencies
- Module not found → Activate venv first

---

## Alternative - Use uvicorn directly:

```powershell
cd C:\Users\AMD\gobengali\backend
.\venv\Scripts\activate
uvicorn main_simple:app --reload --port 8000
```

---

**Once backend is running, you can start the frontend!**

