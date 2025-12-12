# Deployment Guide

## Frontend Deployment (Vercel)

### Prerequisites
- GitHub account with repository
- Vercel account (vercel.com)
- Environment variables configured

### Step-by-Step

1. **Connect Repository**
   - Visit https://vercel.com/new
   - Import your GitHub repository
   - Select `under-people-platform` project

2. **Configure Project**
   - Framework: Next.js
   - Root Directory: `./frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **Set Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://api.underpeople.club
   NEXT_PUBLIC_BOT_NAME=under_people_bot
   ```

4. **Deploy**
   - Click Deploy
   - Monitor build progress
   - Domain will be assigned automatically

5. **Custom Domain**
   - Settings → Domains
   - Add custom domain
   - Configure DNS records

## Backend Deployment

### Option 1: Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login and Create App**
   ```bash
   heroku login
   heroku create under-people-api
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set TELEGRAM_BOT_TOKEN=your_token
   heroku config:set DATABASE_URL=postgresql://...
   heroku config:set SECRET_KEY=your_secret_key
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

### Option 2: Railway.app

1. **Create Account** on railway.app
2. **Connect GitHub Repository**
3. **Configure Environment Variables**
4. **Deploy** (automatic on push)

### Option 3: VPS (DigitalOcean, Linode, AWS)

1. **Setup Server**
   ```bash
   sudo apt-get update && upgrade
   sudo apt-get install docker.io docker-compose
   ```

2. **Clone Repository**
   ```bash
   git clone https://github.com/yourusername/under-people-platform.git
   cd under-people-platform
   ```

3. **Configure Environment**
   ```bash
   cp backend/.env.example backend/.env
   # Edit .env with production values
   ```

4. **Deploy with Docker**
   ```bash
   docker-compose -f docker-compose.yml up -d
   ```

5. **Setup Reverse Proxy (Nginx)**
   ```nginx
   server {
       listen 80;
       server_name api.underpeople.club;
       
       location / {
           proxy_pass http://localhost:8000;
           proxy_set_header Host $host;
       }
   }
   ```

6. **SSL Certificate (Let's Encrypt)**
   ```bash
   sudo apt-get install certbot nginx-certbot
   sudo certbot --nginx -d api.underpeople.club
   ```

## Database Setup

### Production PostgreSQL

1. **Create Database**
   ```sql
   CREATE DATABASE underworld_prod;
   CREATE USER under_prod WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE underworld_prod TO under_prod;
   ```

2. **Run Migrations**
   ```bash
   python -m alembic upgrade head
   ```

3. **Backup**
   ```bash
   pg_dump underworld_prod > backup_$(date +%s).sql
   ```

## Monitoring & Maintenance

### Health Checks
- Frontend: https://underpeople.club/health
- API: https://api.underpeople.club/health

### Logs
```bash
# Vercel
vercel logs

# Heroku
heroku logs --tail

# Docker
docker-compose logs -f api
```

### Database Backups
```bash
# Daily backup script
0 2 * * * pg_dump underworld_prod | gzip > /backups/backup_$(date +\%Y\%m\%d).sql.gz
```

## Troubleshooting

### Build Failures
- Check Node/Python versions
- Verify environment variables
- Review build logs
- Check dependencies versions

### Database Connection
- Verify DATABASE_URL format
- Check firewall rules
- Test connection: `psql $DATABASE_URL`

### API Errors
- Check CORS settings
- Verify TELEGRAM_BOT_TOKEN
- Review API logs
- Test endpoints with Postman

---

**Need help?** Open an issue on GitHub or contact maintainers.
