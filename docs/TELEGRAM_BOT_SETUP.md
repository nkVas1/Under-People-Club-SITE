# Telegram Bot Setup Guide

**Purpose:** Enable Telegram Login Widget and Deep Linking for Arsenal payments  
**Bot Name:** UPCworld_bot  
**Status:** Required for Phase 6 functionality

---

## 🤖 Step 1: Create Bot via BotFather

### Opening BotFather
1. Open Telegram desktop or mobile app
2. Search for: **@BotFather** (official Telegram bot creator)
3. Click on the first result (verified ✓ badge)

### Creating Your Bot
```
Message to @BotFather:
/newbot

Response:
"Alright, a new bot. How are we going to call it?"

Answer: UPCworld_bot

Response:
"Good. Now let's choose a username for your bot. 
It must end in `_bot`. For example, TetrisBot or tetris_bot."

Answer: UPCworld_bot
```

### Saving Your Bot Token
After creation, BotFather will send you:
```
Done! Congratulations on your new bot. 
You will find it at t.me/UPCworld_bot. 
You can now add a description, about section and commands. 
Keep your token secure and store it safely!

🔐 Token: 123456789:ABCDEfghIJKlmnoPQRstuvwxyzABCDEf
```

⚠️ **IMPORTANT:** Save this token securely (backend .env only, NEVER expose publicly)

---

## ⚙️ Step 2: Enable Login Widget in Bot Settings

### Accessing Bot Settings
1. Message @BotFather: `/mybots`
2. Select your bot: **UPCworld_bot**
3. Click: **Edit Bot**

### Enabling Inline Button
```
/mybots → UPCworld_bot → Edit Bot

Options:
1. Edit description ← (Add: "Under People Club Game Platform")
2. Edit about text ← (Add: "Join the underground gaming community")
3. Edit commands ← (Add: /start, /help, /login)
4. Edit inline button ← SELECT THIS ONE
5. Edit inline queries
... and more
```

### Setting Inline Button
```
Choose:
"Replies and inline button"

Question: "Do you want to add an inline button to start your bot?"
Answer: "Yes" (via /setinlinebtn command)

This enables the "Login with Telegram" button on websites
```

### Enabling Domains for Login Widget
```
/mybots → UPCworld_bot → Edit Bot → 

Look for "API Settings" or similar option

Add these domains (where the login widget will work):
- under-people-club.vercel.app
- localhost:3000 (for development)
- your-custom-domain.com (if you have one)
```

---

## 🌐 Step 3: Configure Domain Whitelist

### For Vercel Production
```
Bot Command: /setdomain

Response: "Please, enter a domain for your login button"

Enter:
under-people-club.vercel.app
```

### For Local Development
```
You may also need to add:
localhost:3000
localhost:3001
127.0.0.1:3000

Note: localhost generally works without explicit addition,
but add it if you get "domain not allowed" errors
```

### For Custom Domain (Future)
```
If you add a custom domain later:
1. Message BotFather: /setdomain
2. Enter your domain
3. Wait for confirmation
```

---

## 🔧 Step 4: Configure Environment Variables

### Backend (.env)
```env
# In backend/.env or Render environment variables
TELEGRAM_BOT_TOKEN=123456789:ABCDEfghIJKlmnoPQRstuvwxyzABCDEf
TELEGRAM_BOT_NAME=UPCworld_bot
BOT_WEBHOOK_URL=https://under-people-club-api.onrender.com/webhooks/telegram
```

### Frontend (.env.local or Vercel)
```env
# In frontend/.env.local for local development
NEXT_PUBLIC_BOT_NAME=UPCworld_bot
NEXT_PUBLIC_BOT_TOKEN=123456789:ABCDEfghIJKlmnoPQRstuvwxyzABCDEf
NEXT_PUBLIC_APP_URL=https://under-people-club.vercel.app

# In Vercel Dashboard: Settings → Environment Variables
# Add the same variables above (mark as NEXT_PUBLIC_ for frontend)
```

⚠️ **SECURITY NOTE:**
- `TELEGRAM_BOT_TOKEN` should ONLY be in backend
- `NEXT_PUBLIC_BOT_TOKEN` is for widget only (less sensitive)
- Never commit .env files to git

---

## 🔐 Step 5: Set Up Webhook (Backend Integration)

### What is a Webhook?
When a user authorizes via Telegram, their data is sent to your backend via a webhook.

### Setting Webhook URL
```
Message to @BotFather:
/setwebhook

Response: 
"Please send a new webhook URL"

Enter:
https://under-people-club-api.onrender.com/webhooks/telegram
```

### Backend Implementation (Python)
```python
# In backend/app/routes/webhooks.py
from fastapi import APIRouter, Request
import hashlib
import hmac
import time

router = APIRouter(prefix="/webhooks", tags=["webhooks"])

@router.post("/telegram")
async def telegram_webhook(request: Request):
    """Handle Telegram login widget callbacks"""
    data = await request.json()
    
    # Verify signature to prevent spoofing
    bot_token = os.getenv("TELEGRAM_BOT_TOKEN")
    check_hash = data.pop("hash")
    
    data_check_string = "\n".join(
        f"{k}={v}" for k, v in sorted(data.items())
    )
    
    secret_key = hashlib.sha256(bot_token.encode()).digest()
    computed_hash = hmac.new(
        secret_key, 
        data_check_string.encode(), 
        hashlib.sha256
    ).hexdigest()
    
    if computed_hash != check_hash:
        return {"error": "Invalid signature"}
    
    # Verify auth timestamp (not older than 24 hours)
    if time.time() - int(data["auth_date"]) > 86400:
        return {"error": "Auth data too old"}
    
    # Process auth data
    user_id = data.get("id")
    username = data.get("username")
    first_name = data.get("first_name")
    
    # Create/update user in database
    user = await create_or_update_user(user_id, username, first_name)
    
    return {
        "success": True,
        "user_id": user_id,
        "token": generate_jwt_token(user)
    }
```

---

## 🧪 Step 6: Test Your Setup

### Local Testing
```bash
# 1. Start frontend
npm run dev

# 2. Go to http://localhost:3000/shelter

# 3. Click "Login with Telegram" button

# 4. Authorize with your Telegram account

# 5. Should redirect back with user data
```

### Mobile Testing
```
1. Generate QR code (in Shelter dashboard)
2. Scan with phone camera app
3. Should open: https://under-people-club.vercel.app/u/[code]
4. Should show public profile (no 404 error)
5. Click "Enter with Telegram"
6. Complete Telegram auth on mobile
7. Should load full dashboard
```

### Production Testing (After Vercel Deployment)
```
1. Visit https://under-people-club.vercel.app
2. Click Shelter section
3. Click "Login with Telegram"
4. Should see official Telegram Login Widget (blue button)
5. Click widget → Telegram opens
6. Authorize → returns to app with user data
```

---

## 🐛 Troubleshooting

### "Domain not allowed" Error
```
Problem: 
Widget shows error "You've entered an invalid domain"

Solution:
1. Check /setdomain command with BotFather
2. Verify domain matches exactly (no http://, no trailing slash)
3. Wait 5-10 minutes for Telegram servers to update
4. Clear browser cache: Ctrl+Shift+Del
```

### "Invalid signature" Error
```
Problem:
Backend rejects auth data with "Invalid signature"

Solution:
1. Verify bot token is correct in backend/.env
2. Check HMAC-SHA256 implementation matches Telegram spec
3. Verify auth_date is recent (within 24 hours)
4. Check data fields are sorted alphabetically
```

### "Cannot find LoginButton component" Error
```
Problem:
React error: "LoginButton is not exported from @telegram-auth/react"

Solution:
1. Install package: npm install @telegram-auth/react
2. Verify version 1.0.2+
3. Update ShelterProfile.tsx imports:
   import { LoginButton } from '@telegram-auth/react';
```

### Widget Doesn't Appear on Vercel
```
Problem:
Local works, but production shows demo button instead

Solution:
1. Set NEXT_PUBLIC_BOT_NAME in Vercel Dashboard
2. Set NEXT_PUBLIC_APP_URL in Vercel Dashboard
3. Redeploy: Vercel → Deployments → Redeploy
4. Wait 2-3 minutes for build to complete
5. Clear CDN cache if available
```

---

## 📋 Checklist for Completion

- [ ] Created bot with @BotFather
- [ ] Bot name is: **UPCworld_bot**
- [ ] Saved bot token securely
- [ ] Enabled inline button in bot settings
- [ ] Added domain: **under-people-club.vercel.app**
- [ ] Set webhook URL in BotFather
- [ ] Added TELEGRAM_BOT_TOKEN to backend/.env
- [ ] Added NEXT_PUBLIC_BOT_NAME to Vercel
- [ ] Added NEXT_PUBLIC_APP_URL to Vercel
- [ ] Installed @telegram-auth/react package
- [ ] Tested locally on http://localhost:3000
- [ ] Tested Telegram login flow
- [ ] Tested QR code scanning
- [ ] Tested on production Vercel domain
- [ ] Tested on mobile device

---

## 📞 Bot Commands (Optional)

You can add helpful commands that users can access:

```
Message to @BotFather:
/setcommands

Response:
"Send commands list for your bot"

Enter (one per line):
/start - Welcome to Under People Club
/login - Authorize via Telegram
/help - Get help
/arsenal - View shop
/clan - Manage your clan
/status - Check account status
```

These will appear as suggestions when users type `/` in chat with your bot.

---

## 🚀 Next Steps

1. **Complete all checklist items** above
2. **Test locally** with bot configured
3. **Deploy to Vercel** with environment variables
4. **Test on mobile** (iPhone + Android)
5. **Monitor logs** for any auth errors
6. **Implement backend validation** for production security

---

## 📚 Additional Resources

- **Telegram Bot API:** https://core.telegram.org/bots/api
- **Login Widget Docs:** https://core.telegram.org/widgets/login
- **Widget Widget Library:** https://github.com/telegram-auth/react
- **BotFather Commands:** https://core.telegram.org/bots/faq#general

---

**Last Updated:** December 13, 2025  
**Status:** Ready for implementation  
**Estimated Setup Time:** 15-20 minutes
