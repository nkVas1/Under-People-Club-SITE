# Testing Guide

**Complete QA & Testing Procedures for Phase 6**

---

## 🧪 Test Categories

### 1. Local Development Testing
### 2. Telegram Authentication Testing
### 3. QR Code Functionality Testing
### 4. Mobile Testing
### 5. Production Deployment Testing
### 6. Security Testing

---

## 1️⃣ Local Development Testing

### Setup
```bash
cd under-people-platform/frontend
npm install --legacy-peer-deps
cp .env.example .env.local
npm run dev
```

### Test Cases

#### 1.1 Navigation System
```
✓ Test: Click each section in ColumnNav
- Expected: Smooth animation, correct page loads
- Sections: Shelter, Arsenal, Chronicles, Raid, Network, Overseer
- Status: PASS / FAIL
```

#### 1.2 Home Page
```
✓ Test: Load http://localhost:3000
- Expected: Cyberpunk portal theme visible
- Check: Red/black color scheme
- Check: Logo and title displayed
- Check: Navigation sidebar visible
- Status: PASS / FAIL
```

#### 1.3 Demo Login
```
✓ Test: Click "Demo Login" button on Shelter page
- Expected: User logged in
- Check: Dashboard shows user data
- Check: localStorage has auth data
- Check: "Logout" button appears
- Status: PASS / FAIL

To verify:
localStorage.getItem('auth-storage')  # Check browser console
```

#### 1.4 Cart Functionality
```
✓ Test: Arsenal page - Add item to cart
1. Open Arsenal
2. Click "Add to Cart" on first item
3. Expected: 
   - Item appears in cart panel
   - Total price updates
   - Cart counter increments
4. Click "Remove"
5. Expected:
   - Item removed from cart
   - Total updates
   - Cart counter decrements

✓ Test: Cart persistence
1. Add items to cart
2. Refresh page (F5)
3. Expected: Cart items still there
4. Close tab, reopen
5. Expected: Cart persists

To verify:
localStorage.getItem('up-cart-storage')  # Check localStorage
```

#### 1.5 Overseer Admin Panel
```
✓ Test: Access overseer page (admin only)
1. Click Overseer in navigation
2. Expected: Admin terminal loads
3. Check: Red glow aesthetic visible
4. Check: Scanner, Stats, Activity tabs visible

✓ Test: Scanner tab
1. Click Scanner tab
2. Click "Test QR" button
3. Expected: Demo QR code displayed

✓ Test: Stats tab
1. Click Stats tab
2. Expected: Statistics cards visible
   - Members: X
   - Arsenal Items: 12
   - Activities: X
   - Uptime: X

✓ Test: Activity tab
1. Click Activity tab
2. Expected: Activity log visible with entries
3. Check: Timestamps displayed
```

#### 1.6 QR Code Generation
```
✓ Test: Generate QR code (Shelter page)
1. Go to Shelter
2. Scroll down to "Your QR Code"
3. Expected: QR code displays
4. Expected: Code shows ref_code (e.g., UP-1234)
5. Expected: Copy button works
6. Expected: Opens correct URL in browser

To verify:
- QR should link to: http://localhost:3000/u/[code]
- Format: UP- or UP[digits]
```

#### 1.7 Public Profile Page
```
✓ Test: Manual access to public profile
1. Navigate to: http://localhost:3000/u/UP-DEMO
2. Expected: Public profile page loads
3. Check: Avatar displayed
4. Check: Verification badge visible
5. Check: Status message shows "Verified"

✓ Test: Invalid code
1. Navigate to: http://localhost:3000/u/INVALID
2. Expected: 404-style error page displayed
3. Check: No red corner brackets
4. Check: "Invalid Code" message

To verify code format:
- Valid: /u/UP-X7Z9 or /u/UP12345
- Invalid: /u/invalid, /u/test123
```

---

## 2️⃣ Telegram Authentication Testing

### Prerequisites
- Create Telegram bot with @BotFather
- Get bot token
- Enable domain in bot settings
- Install @telegram-auth/react package

### Setup
```bash
# Install package
npm install @telegram-auth/react --legacy-peer-deps

# Set environment (if not already set)
# NEXT_PUBLIC_BOT_NAME=UPCworld_bot

npm run dev
```

### Test Cases

#### 2.1 Telegram Button Display
```
✓ Test: Telegram login button visible
1. Open http://localhost:3000/shelter
2. If authenticated: Click Logout first
3. Expected: Telegram login button visible
4. Check: Blue color (Telegram brand)
5. Check: Telegram logo visible
6. Check: Text says "Continue with Telegram"

If button not visible:
- Check @telegram-auth/react installed
- Check NEXT_PUBLIC_BOT_NAME env var
- Check browser console for errors
```

#### 2.2 Telegram Auth Flow
```
✓ Test: Complete Telegram authentication
1. Click Telegram button
2. Expected: Telegram app/web opens
3. Choose account to authorize
4. Expected: Redirected back to app
5. Expected: Dashboard loads with user data
6. Check: Username displayed
7. Check: "Logout" button visible

✓ Test: User data stored
localStorage.getItem('auth-storage')
Should show:
{
  "id": "123456789",
  "username": "your_telegram_username",
  "telegram_id": "123456789",
  "up_coins": 100,
  "role": "ranger",
  ...
}
```

#### 2.3 Telegram Session Persistence
```
✓ Test: Login persistence across tabs
1. Login with Telegram
2. Open new tab: http://localhost:3000/shelter
3. Expected: Already logged in (no re-auth needed)
4. Check: User data displayed

✓ Test: Login persistence after refresh
1. Login with Telegram
2. Refresh page (F5)
3. Expected: Still logged in
4. Check: Dashboard displays user data

✓ Test: Logout functionality
1. Click "Logout" button
2. Expected: Logged out immediately
3. Check: Login button reappears
4. Check: localStorage cleared
```

#### 2.4 Telegram Data Validation
```
✓ Test: Verify Telegram data fields
After login, check localStorage for:
- ✓ id (string, matches Telegram user ID)
- ✓ username (string, Telegram username)
- ✓ telegram_id (number, same as id)
- ✓ first_name (string)
- ✓ photo_url (string, avatar URL)
- ✓ up_coins (number, should be 100)
- ✓ ref_code (string, format: UP-XXXX)

Command to verify:
console.log(JSON.parse(localStorage.getItem('auth-storage')))
```

#### 2.5 Fallback (If Package Missing)
```
✓ Test: Fallback button if @telegram-auth/react missing
1. Uninstall package: npm uninstall @telegram-auth/react
2. npm run dev
3. Expected: Demo login button shown instead
4. Click demo button
5. Expected: Demo data loaded
6. This is a graceful fallback for testing
```

---

## 3️⃣ QR Code Functionality Testing

### Test Cases

#### 3.1 QR Code Generation
```
✓ Test: Generate QR code
1. Go to Shelter page
2. Scroll to "Your QR Code" section
3. Expected: QR image displays
4. Expected: Code format shows (e.g., "UP-1234")
5. Expected: "Copy QR Link" button works
```

#### 3.2 QR Code Scanning (Desktop)
```
✓ Test: Scan QR with webcam
1. Generate QR code
2. Use external QR scanner (phone camera or app)
3. Scan the QR code
4. Expected: Opens public profile URL
5. Check: URL format: https://yourdomain.com/u/[code]
```

#### 3.3 QR Code Direct Navigation
```
✓ Test: Manual QR code URL access
1. Copy QR code link manually
2. Paste in browser: http://localhost:3000/u/UP-DEMO
3. Expected: Public profile loads
4. Check: No 404 error
5. Check: Profile card displays correctly

✓ Test: Various code formats
- Valid: /u/UP-1234 (should work)
- Valid: /u/UP12345 (should work)
- Invalid: /u/invalid (should show error)
- Invalid: /u/test (should show error)
```

#### 3.4 Public Profile Display
```
✓ Test: Profile card elements
When accessing /u/[valid-code]:
1. Check: Avatar displayed (DiceBear API)
2. Check: Verification badge visible ✓
3. Check: Status shows "Verified" 
4. Check: Code format displays (UP-XXXX)
5. Check: Corner brackets visible (█)
6. Check: Cyberpunk styling applied
```

#### 3.5 QR Code Error Handling
```
✓ Test: Invalid code error page
1. Navigate to: http://localhost:3000/u/invalid
2. Expected: Error message displayed
3. Check: Says "Invalid or unverified code"
4. Check: Back button provided
5. Check: No corner brackets (unlike valid profile)
```

---

## 4️⃣ Mobile Testing

### Setup
```bash
# Get your local IP
ipconfig  # Windows → IPv4 Address
ifconfig en0  # macOS

# Example: 192.168.1.100
# Visit from phone: http://192.168.1.100:3000
```

### Test Cases

#### 4.1 Responsive Design
```
✓ Test: Mobile navigation
- Size: 375px width (iPhone SE)
- Expected: Navigation sidebar visible
- Expected: All sections accessible
- Expected: No horizontal scrolling

✓ Test: Mobile Shelter page
- Size: 375px width
- Expected: Dashboard readable
- Expected: QR code displays properly
- Expected: Login button functional

✓ Test: Mobile Arsenal page
- Size: 375px width
- Expected: Product grid responsive
- Expected: Can add to cart
- Expected: Cart panel scrollable
```

#### 4.2 Touch Interactions
```
✓ Test: Touch navigation
1. Open on mobile/tablet
2. Tap each menu item
3. Expected: Smooth animation
4. Expected: Page transition
5. Expected: No lag or stutter

✓ Test: Button taps
1. Tap "Add to Cart"
2. Expected: Instant feedback
3. Expected: No double-tap issues
```

#### 4.3 QR Scanning (Mobile)
```
✓ Test: Native QR scan
1. Open phone camera app
2. Point at QR code on desktop
3. Expected: Notification appears
4. Tap notification
5. Expected: Opens public profile in browser
6. Expected: Shows correctly on mobile view
```

#### 4.4 Telegram Login (Mobile)
```
✓ Test: Telegram button on mobile
1. Open Shelter on mobile
2. Click Telegram button
3. Expected: Opens Telegram app
4. Complete auth
5. Expected: Returns to app
6. Expected: Dashboard displays correctly
```

---

## 5️⃣ Production Deployment Testing

### Prerequisites
- Vercel deployment active
- NEXT_PUBLIC_APP_URL set
- NEXT_PUBLIC_BOT_NAME set
- Telegram bot domain whitelist configured

### Test Cases

#### 5.1 Vercel Deployment
```
✓ Test: Production URL loads
1. Visit: https://under-people-club.vercel.app
2. Expected: Page loads without errors
3. Expected: No 404 errors
4. Expected: All assets load correctly

✓ Test: Vercel environment variables
1. Check Vercel Dashboard
2. Verify: NEXT_PUBLIC_APP_URL set
3. Verify: NEXT_PUBLIC_BOT_NAME set
4. Status: ✓ Configured
```

#### 5.2 QR Codes in Production
```
✓ Test: QR code links to production
1. Generate QR code on production
2. Expected: QR shows: https://under-people-club.vercel.app/u/[code]
3. Scan QR with phone
4. Expected: Opens production profile page
5. Expected: Shows verified status
```

#### 5.3 Telegram Auth in Production
```
✓ Test: Telegram button works on production
1. Visit production URL
2. Click Telegram button
3. Expected: Blue Telegram button visible
4. Expected: Can authorize
5. Expected: Returns to app with user data
```

#### 5.4 Bot Domain Configuration
```
✓ Test: Bot domain whitelist
1. Verify @BotFather has whitelist:
   /setdomain → under-people-club.vercel.app
2. Status: ✓ Configured
3. Test: Telegram button should work without errors
```

#### 5.5 API Integration (If Backend Ready)
```
✓ Test: Backend API calls
1. Check network tab (DevTools F12)
2. Look for API calls to backend
3. Expected: /api/users/* endpoints working
4. Expected: 200 OK responses
5. Expected: Data processed correctly
```

---

## 6️⃣ Security Testing

### Test Cases

#### 6.1 Authentication Security
```
⚠️ Test: Demo signature validation
Status: Demo mode (not production-secure)

Notes:
- Current: No Telegram signature verification
- For Production: Need backend validation
- See: docs/TELEGRAM_BOT_SETUP.md for security
```

#### 6.2 localStorage Security
```
✓ Test: Token storage
1. Open DevTools (F12)
2. Go to Application → localStorage
3. Check: 'auth-storage' contains user data
4. Check: Token present (if any)
5. Security Note: Not encrypted, only for demo
```

#### 6.3 Environment Variables
```
✓ Test: No sensitive data in client code
1. Check source code
2. Verify: TELEGRAM_BOT_TOKEN not in frontend
3. Verify: Only public variables exposed
4. Status: ✓ Secure

Allowed NEXT_PUBLIC_* variables:
- NEXT_PUBLIC_APP_URL (production domain)
- NEXT_PUBLIC_BOT_NAME (bot username)
- NEXT_PUBLIC_API_URL (backend URL)
```

#### 6.4 Role-Based Access
```
✓ Test: Overseer access control
1. Login with regular user (role: 'ranger')
2. Try to access /overseer
3. Expected: Access denied or limited view
4. Change role to 'elder' in auth store
5. Expected: Full admin panel access
```

---

## 📊 Test Matrix

| Feature | Local | Mobile | Production | Status |
|---------|-------|--------|------------|--------|
| Navigation | ✓ | ✓ | ✓ | PASS |
| Cart | ✓ | ✓ | ✓ | PASS |
| QR Generation | ✓ | ✓ | ✓ | PASS |
| QR Scanning | ✓ | ✓ | ✓ | PASS |
| Public Profile | ✓ | ✓ | ✓ | PASS |
| Telegram Auth | ⏳ | ⏳ | ⏳ | PENDING |
| Admin Panel | ✓ | ✓ | ✓ | PASS |
| Responsive | ✓ | ✓ | ✓ | PASS |
| Performance | ✓ | ✓ | ✓ | PASS |

---

## 🐛 Bug Reporting Template

```
## Bug Report: [Title]

**Environment:**
- URL: http://localhost:3000 or https://under-people-club.vercel.app
- Browser: Chrome/Firefox/Safari version
- Device: Desktop/Mobile/Tablet
- OS: Windows/macOS/iOS/Android

**Steps to Reproduce:**
1. ...
2. ...
3. ...

**Expected Result:**
...

**Actual Result:**
...

**Screenshots:**
[Attach screenshots if possible]

**Console Errors:**
[Paste any JavaScript errors from F12]

**Browser Info:**
navigator.userAgent: [Copy from console]
```

---

## ✅ Pre-Launch Checklist

### Functionality
- [ ] All 6 navigation sections working
- [ ] Cart add/remove functioning
- [ ] QR code generation works
- [ ] QR code scanning works (produces valid URLs)
- [ ] Public profile page loads (no 404)
- [ ] Admin panel accessible (elder role)
- [ ] Fallback UI working (if no Telegram package)

### Telegram (If Bot Configured)
- [ ] Bot created with @BotFather
- [ ] Domain added to bot settings
- [ ] @telegram-auth/react installed
- [ ] Login button displays
- [ ] Can complete auth flow
- [ ] User data stored in localStorage
- [ ] Logout works

### Deployment
- [ ] Vercel deployment successful
- [ ] Environment variables set
- [ ] Production URL accessible
- [ ] QR codes link to production
- [ ] No 404 errors on pages
- [ ] All assets load (images, fonts, CSS)
- [ ] Performance acceptable (<3s load)

### Mobile
- [ ] Responsive design works (375px+)
- [ ] Touch interactions smooth
- [ ] Readable without zoom
- [ ] QR scanning works
- [ ] Telegram auth works on mobile

### Security
- [ ] No hardcoded secrets in code
- [ ] Environment variables configured
- [ ] localStorage data safe
- [ ] Role-based access working
- [ ] CORS properly configured

---

## 📝 Test Report Template

```
# Test Report - Phase 6

**Date:** December 13, 2025
**Tester:** [Name]
**Environment:** Local/Production
**Browser:** [Browser Version]
**Device:** [Device Type]

## Summary
Total Tests: X
Passed: X (100%)
Failed: 0
Skipped: 0

## Test Results

### Navigation Testing
- [x] All sections load
- [x] Animations smooth
- [x] No console errors

### Cart Testing
- [x] Add/remove items
- [x] Cart persistence
- [x] Total calculation

... (more sections)

## Issues Found
None

## Recommendations
- [x] Ready for production
- [] Needs minor fixes
- [] Needs major fixes

## Sign-off
Approved by: ___________
Date: ___________
```

---

## 🚀 Testing Commands

```bash
# Local development
npm run dev
# Visit http://localhost:3000

# Build for production
npm run build
npm start
# Visit http://localhost:3000

# Check for TypeScript errors
npx tsc --noEmit

# Check for ESLint errors
npx eslint .

# Run tests (if configured)
npm test
```

---

## 📞 Test Support

**Having issues during testing?**

1. Check browser console (F12) for errors
2. Check [QUICK_START.md](QUICK_START.md) for common issues
3. Verify all environment variables set
4. Clear cache: Ctrl+Shift+Del
5. Restart dev server: npm run dev

---

**Testing Status:** Ready for QA ✅  
**Last Updated:** December 13, 2025  
**Next Phase:** Production monitoring
