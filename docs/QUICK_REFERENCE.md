# 📖 Documentation Quick Reference

**Fastest way to find what you need**

---

## 🎯 I Want to...

### ...Get Started Immediately
```
npm install --legacy-peer-deps
npm run dev
→ http://localhost:3000 ✓
```
**Doc:** QUICK_START.md (3 min)

### ...Understand the Project
```
Read: PROJECT_STATUS.md
Time: 15 minutes
```

### ...Set Up Telegram Bot
```
Read: TELEGRAM_BOT_SETUP.md
Time: 20 minutes
Action: Follow step-by-step
```

### ...Run Tests
```
Read: TESTING_GUIDE.md
Time: 30 minutes
Check: Pre-launch checklist
```

### ...Deploy to Production
```
Read: README.md (Deployment section)
Then: TELEGRAM_BOT_SETUP.md (Domain config)
Check: TESTING_GUIDE.md (Pre-launch checklist)
```

### ...Understand QR Codes
```
Read: PHASE_6_PUBLIC_PROFILE_TELEGRAM.md
Then: TESTING_GUIDE.md (QR Code testing)
Time: 20 minutes
```

### ...Understand Telegram Auth
```
Read: PHASE_6_PUBLIC_PROFILE_TELEGRAM.md
Then: TELEGRAM_BOT_SETUP.md (Backend section)
Time: 25 minutes
```

### ...See What Phase 6 Did
```
Read: PHASE_6_COMPLETION_SUMMARY.md
Time: 10 minutes
```

---

## 📚 All Documents

| Document | Purpose | Read Time | Status |
|----------|---------|-----------|--------|
| QUICK_START.md | Setup & first run | 5 min | ✅ |
| PROJECT_STATUS.md | Complete overview | 15 min | ✅ |
| PHASE_6_PUBLIC_PROFILE_TELEGRAM.md | Technical details | 15 min | ✅ |
| PHASE_6_COMPLETION_SUMMARY.md | What's done | 10 min | ✅ |
| TELEGRAM_BOT_SETUP.md | Bot configuration | 20 min | ✅ |
| TESTING_GUIDE.md | QA procedures | 30 min | ✅ |
| DOCUMENTATION_INDEX.md | Doc navigation | 10 min | ✅ |
| README.md | Main project file | 20 min | ✅ |

---

## 🔍 Quick Troubleshooting

### "Cannot find module '@telegram-auth/react'"
```bash
npm install @telegram-auth/react --legacy-peer-deps
npm run dev
```

### "Port 3000 already in use"
```bash
npm run dev -- -p 3001
# Use port 3001 instead
```

### "QR code shows localhost URL"
```env
# Set in .env.local:
NEXT_PUBLIC_APP_URL=https://under-people-club.vercel.app
```

### "404 on public profile page"
```
The dynamic route /u/[code] should exist
File: frontend/app/u/[code]/page.tsx
If missing, check Phase 6 docs for details
```

### "Telegram button not showing"
```
1. Check @telegram-auth/react installed
2. Check NEXT_PUBLIC_BOT_NAME in .env
3. Check browser console for errors
4. Restart: npm run dev
```

**More issues?** → See QUICK_START.md (Common Issues section)

---

## 💡 Pro Tips

### Development
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Run production build locally
npm run lint         # Check code quality
```

### Debugging
```javascript
// Check auth store:
localStorage.getItem('auth-storage')

// Check cart:
localStorage.getItem('up-cart-storage')

// Check all localStorage:
localStorage
```

### Testing URL Locally from Phone
```bash
# Get your IP (Windows):
ipconfig  # Look for IPv4 Address

# Example: 192.168.1.100
# Visit from phone: http://192.168.1.100:3000
```

---

## 🚀 Critical Checklist

### Before Testing
- [ ] Dependencies installed: `npm install --legacy-peer-deps`
- [ ] Dev server running: `npm run dev`
- [ ] Browser shows http://localhost:3000
- [ ] Can navigate to all 6 sections

### Before Telegram Setup
- [ ] Created bot with @BotFather
- [ ] Got bot token (save securely)
- [ ] Enabled domain: under-people-club.vercel.app
- [ ] Installed @telegram-auth/react

### Before Production Launch
- [ ] All environment variables set in Vercel
- [ ] QR codes generate correct URLs
- [ ] Telegram button works
- [ ] Mobile responsive confirmed
- [ ] No console errors
- [ ] All tests pass

---

## 📞 Need Help?

### For Different Issues

| Issue | Doc | Section |
|-------|-----|---------|
| Can't start dev server | QUICK_START | Troubleshooting |
| QR code not working | TESTING_GUIDE | QR Code Testing |
| Telegram not working | TELEGRAM_BOT_SETUP | Troubleshooting |
| Understanding features | PROJECT_STATUS | Phase descriptions |
| Testing procedures | TESTING_GUIDE | All sections |
| Deployment steps | README | Deployment section |

---

## 🎓 Learning Path

**Total time: 1 hour to fully understand**

1. **QUICK_START.md** (5 min) - Get it running
2. **PROJECT_STATUS.md** (15 min) - Understand features
3. **PHASE_6 docs** (15 min) - Know latest changes
4. **TESTING_GUIDE.md** (25 min) - Learn testing

---

## 📊 Project Status

```
Phase 1: Setup          ✅ Complete
Phase 2: Navigation     ✅ Complete
Phase 3: Auth           ✅ Complete
Phase 4: E-Commerce     ✅ Complete
Phase 5: Admin          ✅ Complete
Phase 6: QR + Telegram  ✅ Complete

Status: 🟢 PRODUCTION READY
```

---

## 🔗 Quick Links

- **Main Repo:** [Under People Club](../README.md)
- **Live Site:** https://under-people-club.vercel.app
- **Bot:** @UPCworld_bot
- **Code:** `frontend/app/` (pages)
- **Components:** `frontend/components/`
- **State:** `frontend/store/`

---

## ✨ Key Features

- ✅ 6-section navigation portal
- ✅ Shopping cart with persistence
- ✅ QR code generation & scanning
- ✅ Public member profiles
- ✅ Telegram authentication
- ✅ Admin dashboard
- ✅ Fully responsive mobile design

---

## 🎉 You're All Set!

```
Pick your starting doc above ↑
and you're ready to go! 🚀
```

**QUICK_START.md** → 5 minutes  
**PROJECT_STATUS.md** → 15 minutes  
**Full Docs** → 1-2 hours  

---

**Last Updated:** December 13, 2025  
**Quick Reference Version:** v1.0  
**Status:** Ready to use ✅
