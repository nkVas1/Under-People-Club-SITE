# 🎯 Production Launch Checklist

**Date:** December 27, 2025  
**Status:** READY FOR FINAL LAUNCH  
**Estimated Time:** 10 minutes total

---

## 📋 Pre-Launch Verification

### ✅ Code Ready
- [x] Frontend code in GitHub (under-people-club repo)
- [x] Backend code in GitHub (separate repo)
- [x] All branches merged to `main`
- [x] No uncommitted changes

### ✅ Frontend (Vercel)
- [ ] Project created: https://vercel.com
- [ ] GitHub repo connected
- [ ] Domain configured: under-people-club.vercel.app
- [ ] Environment variables set (see below)
- [ ] TLS/SSL enabled (automatic)

### ✅ Backend (Railway)
- [ ] Project created: https://railway.app
- [ ] GitHub repo connected
- [ ] Database provisioned (PostgreSQL)
- [ ] Environment variables configured
- [ ] Domain configured: upcworldbot-production.up.railway.app

### ✅ Telegram Bot
- [ ] Bot created (@upc_world_bot)
- [ ] WebApp configured
- [ ] Webhook configured (if using)
- [ ] Environment variables set

---

## 🔧 Configuration Checklist

### Vercel Environment Variables

**Location:** Dashboard → Settings → Environment Variables

```
✅ NEXT_PUBLIC_API_URL = https://upcworldbot-production.up.railway.app
```

**After setting:**
- [ ] Redeploy triggered
- [ ] Build status: Ready ✅
- [ ] No build errors

### Railway Environment Variables

**Location:** Dashboard → Project → Variables

```
✅ BOT_TOKEN = your_telegram_token_here
✅ DATABASE_URL = postgresql://user:pass@host/db
✅ SECRET_KEY = your_secret_key_here
✅ ALLOWED_ORIGINS = https://under-people-club.vercel.app
```

**After setting:**
- [ ] Redeploy triggered
- [ ] Deploy status: Success ✅
- [ ] No runtime errors in logs

### Telegram Bot Configuration

```
✅ Bot Token: stored in Railway DATABASE
✅ WebApp URL: https://under-people-club.vercel.app/auth/callback
✅ Webhook: https://upcworldbot-production.up.railway.app/webhook (if polling)
```

---

## 🧪 Testing Sequence

### Step 1: Verify Frontend (2 min)

```bash
# Test 1: Homepage loads
curl -I https://under-people-club.vercel.app
# Expected: 200 OK

# Test 2: Shelter page loads
curl -I https://under-people-club.vercel.app/shelter
# Expected: 200 OK

# Test 3: Debug page works
curl -I https://under-people-club.vercel.app/debug
# Expected: 200 OK
```

**Visual Check:**
1. Open https://under-people-club.vercel.app in browser
2. Should see landing page (no errors)
3. Should load within 3 seconds

### Step 2: Verify Backend (2 min)

```bash
# Test 1: Backend health
curl https://upcworldbot-production.up.railway.app/health
# Expected: JSON response or 200 status

# Test 2: CORS headers present
curl -X OPTIONS https://upcworldbot-production.up.railway.app/api/auth/callback \
  -H "Origin: https://under-people-club.vercel.app" \
  -v
# Expected: access-control-allow-origin header present

# Test 3: Auth endpoint exists
curl -X POST https://upcworldbot-production.up.railway.app/api/auth/callback \
  -H "Content-Type: application/json" \
  -d '{"code": "test"}'
# Expected: 200 or 400 (not 404)
```

### Step 3: Run Diagnostics (2 min)

```
URL: https://under-people-club.vercel.app/debug

Click: "🚀 Run Full Diagnostics"

Expected Results:
✅ Environment Variables - PASS
✅ Backend Connectivity - PASS
✅ CORS Configuration - PASS
✅ Auth Endpoint - PASS
✅ Browser Storage - PASS (or WARNING - normal if not logged in)
```

### Step 4: Full Auth Flow (3 min)

1. **Open:** https://under-people-club.vercel.app/shelter
2. **Click:** "Войти через Telegram" (blue button)
3. **Telegram Opens:** @upc_world_bot
4. **Action:** Send /start command or click button
5. **WebApp Opens:** Should show loading
6. **Check Console:** F12 → Console tab
   - Should see: `🔐 [AUTH CALLBACK] Starting auth flow`
   - Should see: `📨 [AUTH] Response status: 200`
   - Should see: `✅ [AUTH] Received data: {user: {...}}`
7. **Verify:** Should redirect to /shelter with user logged in
8. **Check:** localStorage should have auth-storage data

---

## 📊 Monitoring Setup

### Vercel Monitoring

**Dashboard:**
```
https://vercel.com/yourusername/under-people-club
```

**What to Monitor:**
- Deployment status (green = good)
- Function logs for errors
- Performance metrics
- Failed deployments

**Alert Setup:**
- Enable GitHub integration
- Set up Slack notifications (optional)

### Railway Monitoring

**Dashboard:**
```
https://railway.app/project/[project-id]
```

**What to Monitor:**
- Deployment status
- Application logs
- Database connection
- Uptime metrics

**Alert Setup:**
- Railway native alerts
- Integration with Slack (optional)

---

## 🚨 Incident Response

### If Frontend is Down

1. Check Vercel Dashboard → Deployments
2. Look for failed builds
3. Check Function Logs for errors
4. Trigger manual redeploy if needed
5. Rollback to previous deployment if necessary

**Command:**
```bash
# Force redeploy
git push origin main  # or any commit to main
```

### If Backend is Down

1. Check Railway Dashboard → Deployments
2. Check Application Logs
3. Verify database connection
4. Check if backend crashed (logs show error)
5. Trigger manual redeploy if needed

**Command:**
```bash
# In backend repo
git push origin main  # Railway will auto-redeploy
```

### If CORS is Broken

1. Run `/debug` diagnostics
2. Check "CORS Configuration" result
3. If failed: Backend doesn't have CORS headers
4. Add CORS middleware to backend (see docs)
5. Push changes and wait for Railway redeploy

### If Auth Tokens Broken

1. Check backend logs for auth errors
2. Verify secret key is set in Railway
3. Check JWT signing code
4. Clear browser localStorage
5. Try auth flow again

---

## 📈 Post-Launch Actions

### Immediately After Launch

```
✅ Monitor logs for 5 minutes
✅ Send test auth requests
✅ Verify database connectivity
✅ Check for any errors in logs
✅ Monitor performance metrics
```

### First Day

```
✅ Monitor error rates hourly
✅ Watch for CORS errors
✅ Check database performance
✅ Monitor Vercel build times
✅ Test with different browsers
```

### First Week

```
✅ Analyze error patterns
✅ Optimize slow endpoints
✅ Update documentation based on issues
✅ Backup database daily
✅ Review user feedback
```

---

## 📝 Documentation Links

For detailed information:

- **5-Min Quick Start:** [QUICK_START_5MIN.md](docs/QUICK_START_5MIN.md)
- **Vercel Setup:** [VERCEL_ENV_SETUP.md](docs/VERCEL_ENV_SETUP.md)
- **Backend CORS:** [BACKEND_CORS_SETUP.md](docs/BACKEND_CORS_SETUP.md)
- **Full Debugging:** [COMPLETE_CORS_DEBUG_GUIDE.md](docs/COMPLETE_CORS_DEBUG_GUIDE.md)
- **Complete Docs:** [README_COMPLETE.md](docs/README_COMPLETE.md)
- **Deployment Guide:** [DEPLOYMENT.md](DEPLOYMENT.md)

---

## ✨ Launch Approval

### Required Sign-Offs

- [ ] Frontend working
  - Signed: ___________
  - Date: ___________

- [ ] Backend working
  - Signed: ___________
  - Date: ___________

- [ ] Authentication working
  - Signed: ___________
  - Date: ___________

- [ ] Database working
  - Signed: ___________
  - Date: ___________

- [ ] All tests passing
  - Signed: ___________
  - Date: ___________

### Final Go/No-Go

- [ ] All above signed off
- [ ] No critical bugs remaining
- [ ] Documentation complete
- [ ] Team ready for support

**Final Approval Date:** ___________  
**Approved By:** ___________

---

## 🎉 Launch Complete!

```
┌─────────────────────────────────────┐
│                                     │
│  🚀 DEPLOYMENT SUCCESSFUL! 🚀      │
│                                     │
│  Frontend:  ✅ Production Ready     │
│  Backend:   ✅ Production Ready     │
│  Database:  ✅ Production Ready     │
│  Auth:      ✅ Production Ready     │
│                                     │
│  Application is LIVE!               │
│                                     │
└─────────────────────────────────────┘
```

---

**Document Version:** 1.0  
**Last Updated:** December 27, 2025  
**Status:** READY FOR PRODUCTION

