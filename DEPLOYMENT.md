# GoBengali Deployment Guide

Complete guide for deploying GoBengali to production.

## 🎯 Deployment Overview

GoBengali consists of two independent applications:
1. **Frontend**: Next.js app (deploy to Vercel/Netlify)
2. **Backend**: FastAPI app (deploy to Railway/Render/AWS)

## 📦 Pre-Deployment Checklist

### Frontend
- [ ] Test locally (`npm run dev`)
- [ ] Build successfully (`npm run build`)
- [ ] Update `NEXT_PUBLIC_API_URL` to production backend URL
- [ ] Remove any console.logs
- [ ] Check all environment variables

### Backend
- [ ] Test locally (`uvicorn main:app --reload`)
- [ ] All dependencies in `requirements.txt`
- [ ] Set `DEBUG=False` in production
- [ ] Change `SECRET_KEY` to secure random value
- [ ] Configure CORS for production domain
- [ ] Test all API endpoints

## 🚀 Frontend Deployment

### Option 1: Vercel (Recommended)

**Advantages**: Optimized for Next.js, automatic deployments, free SSL

**Steps**:

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login**:
   ```bash
   vercel login
   ```

3. **Deploy from frontend directory**:
   ```bash
   cd gobengali/frontend
   vercel
   ```

4. **For production**:
   ```bash
   vercel --prod
   ```

5. **Configure Environment Variables** in Vercel Dashboard:
   - `NEXT_PUBLIC_API_URL`: Your backend API URL (e.g., `https://api.yourdomain.com`)
   - `NEXT_PUBLIC_APP_NAME`: GoBengali
   - `NEXT_PUBLIC_MAX_FREE_WORDS`: 1000

**Via GitHub** (Recommended for CI/CD):
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Set root directory to `frontend`
6. Add environment variables
7. Deploy

### Option 2: Netlify

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Build and Deploy**:
   ```bash
   cd gobengali/frontend
   npm run build
   netlify deploy --prod --dir=.next
   ```

3. **Configure** in Netlify Dashboard:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Add environment variables

### Option 3: Self-hosted (Docker)

Create `frontend/Dockerfile`:
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t gobengali-frontend ./frontend
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=https://api.yourdomain.com gobengali-frontend
```

## 🔧 Backend Deployment

### Option 1: Railway (Recommended for ML Apps)

**Advantages**: GPU support, easy Python deployment, automatic SSL

**Steps**:

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Login**:
   ```bash
   railway login
   ```

3. **Initialize project**:
   ```bash
   cd gobengali/backend
   railway init
   ```

4. **Deploy**:
   ```bash
   railway up
   ```

5. **Set Environment Variables** in Railway Dashboard:
   - All variables from `backend/.env`
   - Set `DEBUG=False`
   - Set strong `SECRET_KEY`
   - Update `CORS_ORIGINS` to your frontend URL
   - Set `USE_GPU=True` if using GPU plan

6. **Configure Start Command** in Railway:
   ```
   uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

**Via GitHub**:
1. Push to GitHub
2. Connect repository in Railway dashboard
3. Set root directory to `backend`
4. Add environment variables
5. Deploy

### Option 2: Render

1. **Create `render.yaml`** in backend/:
   ```yaml
   services:
     - type: web
       name: gobengali-api
       env: python
       buildCommand: pip install -r requirements.txt
       startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
       envVars:
         - key: PYTHON_VERSION
           value: 3.10.0
         - key: DEBUG
           value: false
   ```

2. **Deploy**:
   - Connect GitHub repository on [render.com](https://render.com)
   - Select `backend` as root directory
   - Add environment variables
   - Deploy

### Option 3: AWS EC2 (Full Control)

**For production with GPU**:

1. **Launch EC2 Instance**:
   - Instance type: `g4dn.xlarge` (GPU) or `t3.medium` (CPU)
   - AMI: Ubuntu 22.04 LTS
   - Security group: Allow ports 22, 80, 443

2. **Connect and Setup**:
   ```bash
   ssh ubuntu@your-instance-ip
   
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Python 3.10
   sudo apt install python3.10 python3.10-venv python3-pip -y
   
   # Install Git
   sudo apt install git -y
   
   # Clone repository
   git clone <your-repo-url>
   cd gobengali/backend
   
   # Setup virtual environment
   python3.10 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Install NVIDIA drivers** (if using GPU):
   ```bash
   sudo apt install nvidia-driver-525 -y
   
   # Install CUDA
   wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/cuda-keyring_1.0-1_all.deb
   sudo dpkg -i cuda-keyring_1.0-1_all.deb
   sudo apt update
   sudo apt install cuda-11-8 -y
   
   # Install PyTorch with CUDA
   pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
   ```

4. **Create systemd service**:
   ```bash
   sudo nano /etc/systemd/system/gobengali.service
   ```

   Add:
   ```ini
   [Unit]
   Description=GoBengali API
   After=network.target
   
   [Service]
   User=ubuntu
   WorkingDirectory=/home/ubuntu/gobengali/backend
   Environment="PATH=/home/ubuntu/gobengali/backend/venv/bin"
   ExecStart=/home/ubuntu/gobengali/backend/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
   Restart=always
   
   [Install]
   WantedBy=multi-user.target
   ```

   Enable and start:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable gobengali
   sudo systemctl start gobengali
   sudo systemctl status gobengali
   ```

5. **Setup Nginx reverse proxy**:
   ```bash
   sudo apt install nginx -y
   sudo nano /etc/nginx/sites-available/gobengali
   ```

   Add:
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;
       
       location / {
           proxy_pass http://localhost:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_read_timeout 300s;
           proxy_connect_timeout 300s;
       }
   }
   ```

   Enable:
   ```bash
   sudo ln -s /etc/nginx/sites-available/gobengali /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

6. **Setup SSL with Let's Encrypt**:
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d api.yourdomain.com
   ```

### Option 4: Docker Compose (Full Stack)

Create `docker-compose.yml` in root:
```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DEBUG=false
      - USE_GPU=false
    volumes:
      - ./backend/models:/app/models

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  mongodb:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

Deploy:
```bash
docker-compose up -d
```

## 🗄️ Database Setup (Optional)

### MongoDB Atlas (Managed)

1. Create account at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create cluster
3. Get connection string
4. Add to backend environment:
   ```env
   MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/gobengali
   ```

### Redis Cloud (Managed)

1. Create account at [redis.com/cloud](https://redis.com/cloud)
2. Create database
3. Get connection details
4. Add to backend environment:
   ```env
   REDIS_HOST=your-redis-host
   REDIS_PORT=your-redis-port
   REDIS_PASSWORD=your-password
   ```

## 🔐 Security Configuration

### Production Environment Variables

**Frontend** (.env.production):
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_NAME=GoBengali
```

**Backend** (.env.production):
```env
DEBUG=False
SECRET_KEY=your-super-secret-key-change-this
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
USE_GPU=True
MONGODB_URL=your-mongodb-connection-string
REDIS_HOST=your-redis-host
```

### Generate Secure SECRET_KEY:
```python
import secrets
print(secrets.token_urlsafe(32))
```

## 📊 Post-Deployment

### 1. Test Deployment

```bash
# Test frontend
curl https://yourdomain.com

# Test backend API
curl https://api.yourdomain.com/health

# Test translation
curl -X POST https://api.yourdomain.com/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello World", "check_grammar": true}'
```

### 2. Setup Monitoring

**Sentry** (Error tracking):
```bash
# Install
pip install sentry-sdk

# In main.py
import sentry_sdk
sentry_sdk.init(dsn="your-sentry-dsn")
```

**Uptime Monitoring**:
- [UptimeRobot](https://uptimerobot.com)
- [Pingdom](https://pingdom.com)

### 3. Setup CI/CD

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          working-directory: ./frontend

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: railway up --cwd backend
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

## 🎯 Domain Configuration

### Frontend Domain
1. Buy domain (Namecheap, GoDaddy, etc.)
2. Add CNAME record: `www` → `your-vercel-url`
3. Add A record: `@` → Vercel IP
4. Configure in Vercel dashboard

### Backend Domain
1. Add CNAME record: `api` → `your-railway-url`
2. Or A record: `api` → Backend server IP
3. Update CORS_ORIGINS in backend
4. Update NEXT_PUBLIC_API_URL in frontend

## 📈 Performance Optimization

### Frontend
- Enable Image Optimization
- Configure CDN (Cloudflare)
- Enable caching headers

### Backend
- Use Redis for caching
- Enable model quantization (FP16)
- Use GPU instance
- Implement rate limiting

## 🐛 Troubleshooting

### Frontend not loading
- Check NEXT_PUBLIC_API_URL is correct
- Check build logs in Vercel
- Verify domain DNS settings

### Backend not responding
- Check server logs
- Verify environment variables
- Check CORS settings
- Ensure models downloaded

### Models not loading
- Check disk space (~2GB needed)
- Verify MODEL_CACHE_DIR writable
- Check internet connection for first download

## ✅ Deployment Checklist

- [ ] Frontend deployed and accessible
- [ ] Backend deployed and accessible
- [ ] API documentation available at /docs
- [ ] Health check returns "healthy"
- [ ] Translation works end-to-end
- [ ] Authentication working
- [ ] Export functionality working
- [ ] SSL certificates active
- [ ] Custom domains configured
- [ ] Monitoring setup
- [ ] Backup strategy in place
- [ ] Error tracking configured

---

**Congratulations! GoBengali is now live!** 🎉

For support: support@gobengali.com

