# Under People Club - GitHub & Deploy Checklist

## ✅ Pre-Push Checklist

### Code Quality
- [ ] No console.log/print statements in production code
- [ ] TypeScript types are strict
- [ ] Python has type hints
- [ ] Linter passes: `npm run lint` (frontend), `pylint app/` (backend)
- [ ] Tests pass: `npm run test` (frontend), `pytest` (backend)

### Security
- [ ] No hardcoded secrets or tokens
- [ ] `.env.example` has no real values
- [ ] `.gitignore` excludes `.env`, `node_modules`, `__pycache__`
- [ ] Secret keys are 32+ characters
- [ ] CORS settings are restrictive

### Documentation
- [ ] README.md is up-to-date
- [ ] CONTRIBUTING.md is clear
- [ ] Code comments explain "why", not "what"
- [ ] API endpoints documented

---

## 📤 Push to GitHub

### 1. Initialize Git (if not done)
```bash
git init
git remote add origin https://github.com/YOUR_USERNAME/under-people-platform.git
```

### 2. First Commit
```bash
git add .
git commit -m "Initial: Complete project structure for Under People Club"
git branch -M main
git push -u origin main
```

### 3. Create `.github` Files
- ✅ Already in `.github/workflows/ci-cd.yml`
- ✅ Already in `.github/workflows/deploy.yml`

### 4. GitHub Settings

**Repository Settings:**
- [ ] Set default branch to `main`
- [ ] Enable "Always suggest updating pull request branches"
- [ ] Enable "Require branches to be up to date"
- [ ] Require status checks to pass before merging

**Secrets (Settings → Secrets)**
```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
HEROKU_API_KEY=your_heroku_key
```

---

## 🚀 Deploy to Vercel (Frontend)

### 1. Create Vercel Account
- Visit [vercel.com](https://vercel.com)
- Sign up with GitHub

### 2. Import Project
1. Click "New Project"
2. Select your GitHub repository
3. Configure:
   - **Framework**: Next.js
   - **Root Directory**: `./frontend`
   - **Build Command**: `npm run build`
4. Add Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://api.underpeople.club
   NEXT_PUBLIC_BOT_NAME=your_bot_name
   ```
5. Click "Deploy"

### 3. Custom Domain
1. Go to "Settings" → "Domains"
2. Add your domain
3. Update DNS records
4. Vercel will handle SSL automatically

### 4. Auto-Deploy
- ✅ Automatic on every push to `main`
- ✅ Preview deployments for PRs
- ✅ Rollbacks if needed

---

## 🛠️ Deploy to Heroku/Railway (Backend)

### Option A: Heroku (Recommended for beginners)

#### 1. Create Heroku Account
```bash
npm install -g heroku
heroku login
```

#### 2. Create App
```bash
heroku create under-people-api
heroku addons:create heroku-postgresql:hobby-dev
```

#### 3. Set Environment Variables
```bash
heroku config:set TELEGRAM_BOT_TOKEN=your_token
heroku config:set SECRET_KEY=your_secret_key
heroku config:set DEBUG=False
```

#### 4. Deploy
```bash
git push heroku main
heroku logs --tail
```

### Option B: Railway.app (Easier setup)

1. Visit [railway.app](https://railway.app)
2. Connect GitHub
3. Select your repo
4. Add PostgreSQL service
5. Set environment variables
6. Deploy (automatic)

### Option C: DigitalOcean App Platform

1. Create account at [digitalocean.com](https://digitalocean.com)
2. Create new app
3. Connect GitHub repo
4. Select `docker-compose.yml`
5. Add PostgreSQL database
6. Deploy

---

## 🔄 CI/CD Pipeline

Your workflows are ready in `.github/workflows/`:

### `ci-cd.yml` (Runs on PR)
- ✅ Frontend lint & build
- ✅ Backend tests
- ✅ Preview deployment to Vercel

### `deploy.yml` (Runs on merge to main)
- ✅ Deploy frontend to Vercel
- ✅ Deploy backend to Heroku

---

## 📊 Monitoring

### Vercel Monitoring
- Dashboard: https://vercel.com/dashboard
- Analytics: Built-in Web Vitals
- Logs: Real-time request logs

### Heroku Monitoring
```bash
heroku logs --tail
heroku metrics
heroku ps
```

### Database Backups
```bash
# Heroku PostgreSQL
heroku pg:backups:capture
heroku pg:backups:download

# Manual backup
pg_dump $DATABASE_URL > backup.sql
```

---

## 🔒 Production Checklist

Before going live:

- [ ] Database backups configured
- [ ] Error tracking setup (Sentry)
- [ ] Monitoring configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] SSL certificates valid
- [ ] Database credentials secure
- [ ] Logging enabled
- [ ] Health checks working
- [ ] Rollback plan documented

---

## 📈 Deployment Validation

After deployment:

```bash
# Test frontend
curl https://underpeople.club
curl https://underpeople.club/health

# Test API
curl https://api.underpeople.club/health
curl https://api.underpeople.club/docs

# Check logs
# Vercel: Dashboard → Deployments → Logs
# Heroku: heroku logs --tail
```

---

## 🚨 Troubleshooting

### Vercel Build Fails
```bash
# Check logs in Vercel dashboard
# Common issues:
# - Missing env variables
# - Node version mismatch
# - Import errors
```

### Heroku Deploy Fails
```bash
heroku logs --tail
# Common issues:
# - Missing requirements
# - Database not initialized
# - Port configuration
```

### Database Connection Issues
```bash
# Test connection
psql $DATABASE_URL

# Check DATABASE_URL format
heroku config | grep DATABASE_URL
```

---

## 📝 Post-Deployment

### Create Release Notes
```
## v0.1.0 - Project Launch

### Features
- [x] User authentication via Telegram
- [x] Personal cabinet (Shelter)
- [x] Product catalog (Arsenal)
- [x] Collectible card game (Raid)
- [x] Event timeline (Chronicles)

### Known Issues
- Coming soon

### Deployment
- Frontend: Vercel
- Backend: Heroku
- Database: PostgreSQL
```

### Monitor Performance
- Vercel Analytics
- Heroku Metrics
- Database logs

### Plan Next Phase
- [ ] Analytics integration
- [ ] Email notifications
- [ ] Advanced features
- [ ] Mobile app

---

## ✨ Congratulations!

Your **Under People Club** is now live! 🎉

**Live Links:**
- 🌐 Frontend: https://underpeople.club
- 🔗 API: https://api.underpeople.club
- 📖 Docs: https://api.underpeople.club/docs

**Share Your Creation:**
- GitHub: Share the repo link
- Social media: Announce the platform
- Community: Invite beta users

---

**Need help?** Check [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) or open an issue.

**Made with 🖤 by OdinLab Studios**
