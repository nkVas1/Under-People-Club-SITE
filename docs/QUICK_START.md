# Quick Start Guide

**Read this first!** Get the platform running in 5 minutes.

---

## ⚡ 30-Second Overview

Under People Club is a **cyberpunk gaming platform** built with:
- 🎮 **Next.js 14** (Frontend)
- 🐍 **FastAPI** (Backend)  
- 🗄️ **PostgreSQL** (Database)
- 💬 **Telegram Login** (Authentication)

**URL:** https://under-people-club.vercel.app

---

## 🚀 Quick Start (Local)

### 1. Clone & Install
```bash
# Clone repo
git clone <your-repo> under-people-club
cd under-people-club/frontend

# Install dependencies
npm install --legacy-peer-deps

# Create environment file
cp .env.example .env.local
```

### 2. Run Development Server
```bash
npm run dev
# Opens at http://localhost:3000
```

### 3. Test Features
```
Home Page: http://localhost:3000
Navigation: Click 6 menu items to explore
Shelter: User dashboard (demo login)
Arsenal: Shopping cart (add items)
Overseer: Admin panel (elder access)
```

---

## 🌐 Production (Vercel)

**Already deployed!** Visit: https://under-people-club.vercel.app

### Add Environment Variables to Vercel
1. Go to: Vercel Dashboard → Project Settings
2. Add variables:
   ```
   NEXT_PUBLIC_APP_URL = https://under-people-club.vercel.app
   NEXT_PUBLIC_BOT_NAME = UPCworld_bot
   ```
3. Click Redeploy

---

## 🔐 Enable Telegram Login (5 minutes)

### Option A: Quick Demo (No Bot)
- Click "Demo Login" button
- Uses hardcoded test data
- Good for testing UI

### Option B: Real Telegram (Recommended)
1. **Create bot** via @BotFather (2 min)
   - Message @BotFather: `/newbot`
   - Name it: `UPCworld_bot`
   - Save the token
   
2. **Enable domain** in BotFather (1 min)
   - Message: `/setdomain`
   - Enter: `under-people-club.vercel.app`

3. **Install package** (1 min)
   ```bash
   npm install @telegram-auth/react
   ```

4. **Test** (1 min)
   - Refresh: http://localhost:3000/shelter
   - Click "Login with Telegram"
   - See blue Telegram button
   - Click → authorize
   - Login successful! ✅

**See:** `docs/TELEGRAM_BOT_SETUP.md` for detailed guide

---

## 📱 Test QR Code Scanning

### Generate QR Code
1. Go to Shelter (http://localhost:3000/shelter)
2. Scroll to "Your QR Code"
3. See your personal QR code
4. Click to copy link

### Scan QR Code
1. Open phone camera
2. Point at QR code
3. Tap notification
4. Opens: `https://under-people-club.vercel.app/u/[your-code]`
5. Shows your public profile ✓

---

## 🎨 Project Structure

```
📦 under-people-platform
├── 📁 frontend          ← Next.js app (this is what you see)
│   ├── 📁 app/          ← Pages (shelter, arsenal, overseer, etc.)
│   ├── 📁 components/   ← UI components
│   ├── 📁 store/        ← Zustand state (auth, cart)
│   ├── 📁 public/       ← Images, fonts, static files
│   ├── 📄 package.json  ← Dependencies
│   └── 📄 .env.example  ← Template for .env.local
│
├── 📁 backend           ← Python API (for future)
│   ├── 📁 app/
│   ├── 📄 main.py
│   └── 📄 requirements.txt
│
└── 📁 docs              ← Documentation (you are here!)
    ├── 📄 PROJECT_STATUS.md
    ├── 📄 PHASE_6_PUBLIC_PROFILE_TELEGRAM.md
    ├── 📄 TELEGRAM_BOT_SETUP.md
    └── 📄 QUICK_START.md (this file)
```

---

## 🎮 Features Overview

### 🏚️ Shelter (Dashboard)
- User profile display
- Telegram login button
- Generate personal QR code
- View gaming stats

### 💼 Arsenal (E-Commerce)
- 12 products across 4 categories
- Add items to shopping cart
- View cart with prices
- Checkout via Telegram bot link

### 📜 Chronicles (Timeline)
- Game history
- Recent activities
- Story progression
- Event logs

### ⚔️ Raid (Games)
- Gaming modes
- Battle arena
- Minigames
- Tournament brackets

### 🌐 Network (Social)
- Clan management
- Friend list
- Guild chat
- Leaderboards

### 👁️ Overseer (Admin)
- Admin dashboard (elder-only)
- QR scanner integration
- Real-time statistics
- Activity monitoring
- User management

---

## 🐛 Common Issues & Solutions

### "404 Not Found"
```
Problem: Page shows "404 Not Found"
Solution: 
- Check URL is correct: http://localhost:3000
- Refresh page (Ctrl+R)
- Restart dev server: npm run dev
```

### "Cannot find module '@telegram-auth/react'"
```
Problem: Error when loading Shelter page
Solution:
npm install @telegram-auth/react --legacy-peer-deps
npm run dev
```

### "Port 3000 already in use"
```
Problem: "Port 3000 is already in use"
Solution:
npm run dev -- -p 3001
# Runs on http://localhost:3001 instead
```

### "QR code shows localhost URL"
```
Problem: QR links to http://localhost:3000/u/...
Solution:
- Set NEXT_PUBLIC_APP_URL in .env.local:
  NEXT_PUBLIC_APP_URL=https://under-people-club.vercel.app
- Restart dev server
- QR will generate correct production URL
```

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| `PROJECT_STATUS.md` | Complete project overview, all 6 phases |
| `PHASE_6_PUBLIC_PROFILE_TELEGRAM.md` | Details on QR codes + Telegram auth |
| `TELEGRAM_BOT_SETUP.md` | Step-by-step bot configuration |
| `QUICK_START.md` | This file - 30-second overview |

**Read in this order:**
1. QUICK_START.md (you are here) ← Start here
2. PROJECT_STATUS.md (overview) ← Understand the big picture
3. TELEGRAM_BOT_SETUP.md (if setting up Telegram) ← For bot config
4. PHASE_6_PUBLIC_PROFILE_TELEGRAM.md (technical details) ← For deeper dive

---

## ✅ Verification Checklist

**Local Development:**
- [ ] Cloned repo and installed dependencies
- [ ] `npm run dev` running without errors
- [ ] Can access http://localhost:3000
- [ ] All 6 navigation items visible
- [ ] Can click between sections
- [ ] Can add items to cart
- [ ] Can generate QR code

**Telegram (Optional but Recommended):**
- [ ] Created bot with @BotFather
- [ ] Bot name is: UPCworld_bot
- [ ] Added domain to bot settings
- [ ] Installed @telegram-auth/react
- [ ] Click "Login with Telegram" shows blue button
- [ ] Can authorize and log in

**Production (Vercel):**
- [ ] Visited https://under-people-club.vercel.app
- [ ] Page loads without errors
- [ ] All sections accessible
- [ ] QR code generates correct URLs
- [ ] Telegram login works (if bot configured)

---

## 🚀 Next Steps

### Immediate (Before Testing)
1. Clone and install dependencies
2. Create `.env.local` file
3. Run `npm run dev`
4. Test locally

### Short Term (First Day)
1. Set up Telegram bot (15 minutes)
2. Test Telegram login flow
3. Test QR code scanning
4. Deploy to Vercel

### Medium Term (This Week)
1. Connect backend API
2. Store user data in database
3. Add payment processing
4. Test on mobile devices

### Long Term (Next Weeks)
1. Implement real game mechanics
2. Add clan management
3. Build tournament system
4. Add achievements

---

## 💡 Pro Tips

### Development
```bash
# Hot reload enabled - changes auto-refresh
# Check browser console for React errors
# Use React DevTools (Chrome extension) to inspect state
```

### Performance
```bash
# Build for production locally to test
npm run build
npm start

# Then visit http://localhost:3000
```

### Debugging
```bash
# Check your auth store:
localStorage.getItem('auth-storage')  # In browser console

# Check shopping cart:
localStorage.getItem('up-cart-storage')  # In browser console
```

### Mobile Testing
```bash
# Get your local IP
ipconfig getifaddr en0  # macOS
ipconfig  # Windows → IPv4 Address

# Visit from phone:
http://YOUR_IP:3000

# Example: http://192.168.1.100:3000
```

---

## 🎯 Goal: What You Should See

### After Setup
```
✅ Homepage loads with cyberpunk aesthetic
✅ Red/black color scheme visible
✅ 6 menu items in left sidebar
✅ Smooth animations on navigation
✅ Can click between all sections
```

### After Telegram Setup
```
✅ Shelter page has Telegram login button
✅ Button is blue with Telegram logo
✅ Click opens Telegram auth
✅ After auth, shows user dashboard
✅ QR code generated with your profile
```

### After Testing QR
```
✅ QR code displays on Shelter page
✅ Copy QR link manually
✅ Paste in browser URL bar
✅ Shows public profile (no 404)
✅ Shows verification badge
```

---

## 📞 Need Help?

1. **Check docs first:** Look in `/docs/` folder
2. **Check browser console:** Ctrl+Shift+J (errors shown there)
3. **Check terminal:** npm run dev output shows errors
4. **GitHub Issues:** Create issue with error message + steps to reproduce

---

## 🎉 Success!

If you see the cyberpunk homepage loading, **you're done with setup!** 🚀

Now explore the features and have fun! 

```
    ╔═══════════════════════════════════════════════════╗
    ║                                                   ║
    ║       Welcome to Under People Club 🕶️            ║
    ║                                                   ║
    ║          The Underground Gaming Platform         ║
    ║                                                   ║
    ╚═══════════════════════════════════════════════════╝
```

---

**Last Updated:** December 13, 2025  
**Status:** Ready for immediate use  
**Estimated Setup Time:** 5 minutes  
**Difficulty:** Easy ⭐ (just install & run)
