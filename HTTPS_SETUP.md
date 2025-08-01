# 🔒 HTTPS Configuration Guide

## Setup Complete!

Your PawConnect application is now configured to run with HTTPS support.

## 🚀 How to Run with HTTPS

### Option 1: Full HTTPS Setup (Recommended)

**Terminal 1 - Start Backend (HTTPS + HTTP):**

```powershell
cd server
node index.js
```

This will start:

- HTTP server on: http://localhost:5000
- HTTPS server on: https://localhost:5443

**Terminal 2 - Start Frontend (HTTPS):**

```powershell
npm run dev
```

This will start:

- HTTPS frontend on: https://localhost:5173

### Option 2: HTTP Only (Fallback)

**Backend HTTP Only:**

```powershell
cd server
set ENABLE_HTTPS=false
node index.js
```

**Frontend HTTP:**

```powershell
npm run dev:http
```

## 🔧 Configuration Details

### Backend HTTPS Configuration:

- **HTTPS Port**: 5443
- **HTTP Port**: 5000 (fallback)
- **SSL Certificate**: `server/ssl/cert.pem`
- **SSL Private Key**: `server/ssl/key.pem`

### Frontend HTTPS Configuration:

- **Development Port**: 5173
- **Preview Port**: 4173
- **API Base URL**: https://localhost:5443/api/v1

## ⚠️ Development SSL Certificate Warning

Since we're using a self-signed certificate for development:

1. **Browser Warning**: You'll see a security warning the first time
2. **Accept Certificate**: Click "Advanced" → "Proceed to localhost (unsafe)"
3. **Chrome**: Type `thisisunsafe` if the warning persists

## 🌐 Environment Variables

### Frontend (.env):

```
VITE_API_BASE_URL=https://localhost:5443/api/v1
VITE_UPLOAD_BASE_URL=https://localhost:5443/uploads
```

### Backend (server/.env):

```
PORT=5000
HTTPS_PORT=5443
SSL_KEY_PATH=./ssl/key.pem
SSL_CERT_PATH=./ssl/cert.pem
```

## 📱 URLs to Access:

- **Frontend**: https://localhost:5173
- **Backend API**: https://localhost:5443/api/v1
- **Uploads**: https://localhost:5443/uploads

## 🔐 Production SSL Certificate

For production, replace the self-signed certificates with:

1. **Let's Encrypt** (free SSL certificate)
2. **Commercial SSL Certificate**
3. **Cloudflare SSL**

## 🛠️ Troubleshooting

### Common Issues:

1. **Certificate Error**:

   - Ensure SSL files exist in `server/ssl/`
   - Check file permissions

2. **CORS Issues**:

   - Both HTTP and HTTPS origins are allowed
   - Credentials are enabled

3. **API Not Loading**:

   - Check if backend HTTPS server is running on port 5443
   - Verify API_BASE_URL in config

4. **Mixed Content Warnings**:
   - Ensure all API calls use HTTPS URLs
   - Update any hardcoded HTTP references

## 🚀 Quick Start Commands:

```powershell
# Terminal 1 - Start Backend
cd server
npm start

# Terminal 2 - Start Frontend
npm run dev

# Then open: https://localhost:5173
```

## 🎯 Production Deployment:

For production deployment, consider:

- Using a reverse proxy (Nginx/Apache)
- Obtaining proper SSL certificates
- Using PM2 for process management
- Setting up environment-specific configurations

Your PawConnect app is now secure with HTTPS! 🐾🔒
