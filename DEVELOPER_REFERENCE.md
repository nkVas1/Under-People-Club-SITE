# 📖 Developer Reference Card

**Quick Reference for Under People Club Development**

---

## 🚀 Common Commands

### Frontend

```bash
# Development
npm run dev                 # Start dev server (http://localhost:3000)
npm run build              # Build for production
npm run start              # Start production build
npm run lint               # Run ESLint

# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Backend

```bash
# Activate virtual environment
python -m venv venv
source venv/bin/activate           # Linux/Mac
venv\Scripts\activate              # Windows PowerShell

# Install/Update dependencies
pip install -r requirements.txt
pip freeze > requirements.txt

# Database
flask db init                       # Initialize migrations
flask db migrate                    # Create migration
flask db upgrade                    # Apply migration

# Run server
python main.py                      # http://localhost:8000
flask run                           # Alternative
```

### Git

```bash
# Commit with message (use Russian)
git add .
git commit -m "feat: описание / Description in English"
git push origin main

# Quick check
git status
git log --oneline -5
```

---

## 🔗 Important URLs

### Production
```
Frontend:   https://under-people-club.vercel.app
Backend:    https://upcworldbot-production.up.railway.app
Diagnostics: https://under-people-club.vercel.app/debug
Bot:        @upc_world_bot
```

### Development
```
Frontend:   http://localhost:3000
Backend:    http://localhost:8000
```

### Dashboards
```
Vercel:     https://vercel.com
Railway:    https://railway.app
GitHub:     https://github.com/nkVas1/Under-People-Club-SITE
```

---

## 📁 Project Structure Quick Guide

```
frontend/
  app/
    layout.tsx              ← Root layout
    page.tsx                ← Landing page
    shelter/page.tsx        ← Main game
    auth/callback/page.tsx  ← OAuth handler
    debug/page.tsx          ← Diagnostics
  components/               ← React components
  store/authStore.ts        ← Global state (Zustand)
  lib/apiClient.ts          ← API integration

backend/
  main.py                   ← Entry point
  routes/                   ← Endpoints
  models/                   ← Database models
  requirements.txt          ← Dependencies
```

---

## 🔐 Environment Variables

### Frontend (.env.local for dev, Vercel for prod)
```
NEXT_PUBLIC_API_URL=https://upcworldbot-production.up.railway.app
```

### Backend (.env file)
```
BOT_TOKEN=xxx
DATABASE_URL=postgresql://user:pass@host/db
SECRET_KEY=xxx
ALLOWED_ORIGINS=https://under-people-club.vercel.app
```

---

## 🧪 Testing Endpoints

### Health Check
```bash
curl https://upcworldbot-production.up.railway.app/health
```

### Test CORS
```bash
curl -X OPTIONS https://upcworldbot-production.up.railway.app/api/auth/callback \
  -H "Origin: https://under-people-club.vercel.app" \
  -v
```

### Test Auth
```bash
curl -X POST https://upcworldbot-production.up.railway.app/api/auth/callback \
  -H "Content-Type: application/json" \
  -d '{"code": "test123"}'
```

---

## 📊 Frontend Code Patterns

### Using Auth Store
```typescript
import { useAuthStore } from '@/store/authStore';

export default function Component() {
  const { user, token, login, logout } = useAuthStore();
  
  return (
    <>
      {user ? (
        <p>Hello {user.username}</p>
      ) : (
        <button onClick={() => login({...})}>Login</button>
      )}
    </>
  );
}
```

### Making API Calls
```typescript
import apiClient from '@/lib/apiClient';

const response = await apiClient.post('/api/users/profile', {
  username: 'test'
});

const data = await apiClient.get('/api/users/me');
```

### Environment Variables
```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
// Production: https://backend.railway.app
// Development: http://localhost:8000
```

---

## 🐍 Backend Code Patterns

### Create New Endpoint (Flask)
```python
from flask import Blueprint, jsonify, request

api = Blueprint('api', __name__, url_prefix='/api')

@api.route('/my-endpoint', methods=['POST'])
def my_endpoint():
    data = request.get_json()
    # Process data
    return jsonify({'success': True, 'data': result}), 200

# Register in main.py
app.register_blueprint(api)
```

### Database Query
```python
from models import User, session

# Create
user = User(username='test', email='test@example.com')
session.add(user)
session.commit()

# Read
user = session.query(User).filter_by(username='test').first()

# Update
user.email = 'new@example.com'
session.commit()

# Delete
session.delete(user)
session.commit()
```

### CORS Configuration
```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=['https://under-people-club.vercel.app', 'http://localhost:3000'])
```

---

## 🐛 Debugging Tips

### Browser Console (F12)
```javascript
// Check API URL
console.log(process.env.NEXT_PUBLIC_API_URL)

// Check auth data
console.log(localStorage.getItem('auth-storage'))

// Monitor network requests
// DevTools → Network tab → watch requests
```

### Backend Logs
```bash
# Follow logs
Railway Dashboard → Deployments → Logs
tail -f logs/app.log      # Local
```

### Frontend Logs
```bash
Vercel Dashboard → Deployments → Function Logs
```

---

## 📋 Deployment Workflow

### 1. Development
```bash
npm run dev          # Frontend
python main.py       # Backend
```

### 2. Testing
```bash
# Test locally first
# F12 → Console for frontend logs
# Check backend logs
```

### 3. Commit & Push
```bash
git add .
git commit -m "feat: описание"
git push origin main
```

### 4. Automatic Deployment
```
GitHub → Vercel (frontend)
GitHub → Railway (backend)
```

### 5. Verify Production
```
https://under-people-club.vercel.app/debug
→ Run Full Diagnostics
→ Check all ✅ green
```

---

## 🚨 Common Issues & Solutions

| Issue | Check | Fix |
|-------|-------|-----|
| "CORS error" | Browser console | Add CORS to backend |
| "API URL not found" | Vercel env vars | Set NEXT_PUBLIC_API_URL |
| "404 Not Found" | Network tab | Create endpoint on backend |
| "Token expired" | localStorage | Clear cache, re-login |
| "Database error" | Railway logs | Check connection string |
| "Build failed" | Vercel logs | Fix TypeScript errors |

---

## 📚 Documentation

- **Quick Start:** [QUICK_START_5MIN.md](docs/QUICK_START_5MIN.md)
- **Vercel Setup:** [VERCEL_ENV_SETUP.md](docs/VERCEL_ENV_SETUP.md)
- **CORS Setup:** [BACKEND_CORS_SETUP.md](docs/BACKEND_CORS_SETUP.md)
- **Debug Guide:** [COMPLETE_CORS_DEBUG_GUIDE.md](docs/COMPLETE_CORS_DEBUG_GUIDE.md)
- **Full Docs:** [README_COMPLETE.md](docs/README_COMPLETE.md)
- **Deployment:** [DEPLOYMENT.md](DEPLOYMENT.md)
- **Launch:** [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md)

---

## 🔗 External Resources

- **Next.js Docs:** https://nextjs.org/docs
- **React Hooks:** https://react.dev/reference/react/hooks
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Telegram Bot API:** https://core.telegram.org/bots/api
- **Flask Docs:** https://flask.palletsprojects.com
- **FastAPI Docs:** https://fastapi.tiangolo.com

---

## 💡 Pro Tips

1. **Use `.env.local` for local development** - Git won't track it
2. **Check Vercel/Railway logs first** when something breaks
3. **Run `/debug` page** for quick diagnostics
4. **Test CORS locally before production** (curl commands)
5. **Keep environment variables in sync** between services
6. **Use meaningful commit messages** (helps tracking changes)
7. **Test in multiple browsers** before announcing production

---

## 📞 Need Help?

1. Check the [Debug Guide](docs/COMPLETE_CORS_DEBUG_GUIDE.md)
2. Run `/debug` page diagnostics
3. Check Vercel/Railway logs
4. Review relevant documentation file
5. Search GitHub Issues

---

**Last Updated:** December 27, 2025  
**Version:** 1.0  
**Status:** Ready for Production

Print this page or bookmark for quick reference! 🚀

