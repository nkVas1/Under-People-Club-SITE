## 🔐 Telegram WebApp Authentication - Implementation Guide

### Root Cause Analysis

The issue: **"ERROR: TELEGRAM ID NOT AVAILABLE"**

**Why it happened:**
- Frontend was trying to get `telegram_id` from `window.Telegram.WebApp.initDataUnsafe.user`
- This object is **EMPTY** when the site is accessed directly (not through a Telegram bot's WebApp button)
- WebApp context is only populated when the user opens the Mini App through the bot

**The WRONG Flow:**
```
Frontend tries: initDataUnsafe.user.id → Empty! → Error
```

### Solution: AuthCode Flow

**The CORRECT Flow:**
```
1. User in Telegram bot: Click "Login to Website"
   ↓
2. Bot calls: POST /api/auth/generate-code?telegram_id=12345
   ↓ (Bot sends back a UUID code)
   ↓
3. Bot generates URL: https://site.com/auth/callback?code=UUID
   ↓ (Opens in WebApp)
   ↓
4. Frontend receives code from URL, sends: POST /api/auth/callback?code=UUID
   ↓ (NO telegram_id in request!)
   ↓
5. Backend: Query AuthCode table by code, finds telegram_id
   ↓
6. Backend: Creates/updates User with correct telegram_id
   ↓
7. Frontend: Receives token + user data → Login successful!
```

### Key Changes Made

#### 1. User Model (Enhanced)
- **telegram_id**: Changed to `BigInteger` (supports larger Telegram IDs)
- **is_verified**: New field (Boolean) - marks verified users
- **updated_at**: New field (DateTime with timezone) - tracks updates
- **to_public_dict()**: New method - returns public-only data
- **to_private_dict()**: New method - returns all user data (private)

#### 2. AuthCode Model (NEW)
```python
class AuthCode:
    code: str (UUID)                    # Unique one-time code
    telegram_id: int                    # From bot's Telegram context
    user_id: int (optional)             # Link to User if exists
    created_at: datetime                # When code was generated
    expires_at: datetime                # TTL: 10 minutes
    used: bool                          # One-time use flag
    used_at: datetime (optional)        # When code was used
```

#### 3. Auth Endpoints

**POST /api/auth/callback**
```
Request (from frontend):
  ?code=UUID-STRING

Response (from backend):
{
  "status": "ok",
  "token": "uuid-string",
  "user": {
    "id": "uuid",
    "username": "user_123456",
    "telegram_id": 123456,
    "avatar_url": "https://...",
    "up_coins": 100,
    "role": "ranger",
    "referral_code": "UP-XXXXX",
    "clan_name": "Outcasts",
    "is_verified": true
  }
}
```

**POST /api/auth/generate-code** (Bot endpoint)
```
Request (from bot):
  ?telegram_id=123456

Response (to bot):
{
  "status": "ok",
  "code": "UUID-STRING",
  "expires_in": 600  // 10 minutes in seconds
}
```

#### 4. Frontend Changes

**No WebApp.initData usage anymore!**
- ✅ Removed attempts to read `window.Telegram.WebApp.initDataUnsafe.user`
- ✅ Frontend only reads code from URL: `?code=UUID`
- ✅ Sends code to backend (not telegram_id)
- ✅ Backend returns all user data

### Database Migration

Run the migration to create AuthCode table and update User model:

```bash
python backend/run_migrations.py
```

This migration:
- Adds `is_verified` (Boolean) to users table
- Adds `updated_at` (DateTime) to users table
- Changes `telegram_id` type to BIGINT
- Creates `auth_codes` table with proper schema
- Adds performance indexes

### Testing the Flow

**From Bot:**
```bash
# 1. Generate code
curl -X POST "http://localhost:8000/api/auth/generate-code?telegram_id=123456"

# Response:
# {
#   "status": "ok",
#   "code": "550e8400-e29b-41d4-a716-446655440000",
#   "expires_in": 600
# }
```

**From Browser (Frontend):**
```bash
# 2. Call callback with code
curl -X POST "http://localhost:8000/api/auth/callback?code=550e8400-e29b-41d4-a716-446655440000"

# Response:
# {
#   "status": "ok",
#   "token": "...",
#   "user": {...}
# }
```

### Deployment Checklist

- [ ] Run database migration: `python backend/run_migrations.py`
- [ ] Verify AuthCode table exists in database
- [ ] Verify User table has `is_verified` and `updated_at` columns
- [ ] Test /api/auth/generate-code endpoint
- [ ] Test /api/auth/callback endpoint
- [ ] Verify frontend sends code (not telegram_id)
- [ ] Test login flow end-to-end
- [ ] Verify JWT token is stored in localStorage
- [ ] Test public profile page: `/users/u/{referral_code}`

### Files Modified

1. **backend/app/models/models.py**
   - Enhanced User model
   - Added AuthCode model
   - Added helper methods

2. **backend/app/routers/auth.py**
   - Rewritten /api/auth/callback endpoint
   - Added /api/auth/generate-code endpoint
   - Added /api/auth/logout endpoint

3. **backend/app/routers/users.py**
   - Already has /api/users/u/{code} for public profiles

4. **frontend/app/auth/callback/page.tsx**
   - Updated to use code parameter only
   - Removed WebApp.initDataUnsafe.user usage

5. **frontend/app/layout.tsx**
   - Telegram SDK script included

6. **frontend/app/users/u/[code]/page.tsx** (NEW)
   - Public profile page

### Architecture Benefits

✅ **Single source of truth**: telegram_id stored in database
✅ **No WebApp dependency**: Works when site is accessed directly
✅ **One-time codes**: Secure, cannot be reused
✅ **Timezone-aware**: All datetime fields use UTC
✅ **Public/private data**: Proper separation of sensitive data
✅ **Verification tracking**: is_verified field for future features

### Production Considerations

1. **JWT Tokens**: Replace simple UUID tokens with proper JWT
2. **Rate Limiting**: Add rate limits to /api/auth/generate-code
3. **Code TTL**: Currently 10 minutes - adjust if needed
4. **Logging**: Comprehensive logging for debugging
5. **Error Handling**: Proper HTTP status codes and messages

---

**Migration Status**: ✅ Ready for production
**Testing Status**: ⏳ Need to run full E2E tests
**Deployment Status**: ⏳ Ready after verification
