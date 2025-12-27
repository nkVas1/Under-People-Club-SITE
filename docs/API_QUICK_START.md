# 🚀 Quick Start - New APIs

Краткая справка по использованию новых API endpoints.

---

## 🔐 Auth Flow

### 1. Generate Auth Code
```bash
POST /api/auth/generate-code
Body: { "telegram_id": 123456 }

Response:
{
  "status": "ok",
  "code": "550e8400-e29b-41d4-a716-446655440000",
  "expires_in": 600
}
```

### 2. Use Auth Code in Frontend
```javascript
// In WebApp
const code = getAuthCodeFromServer();
window.location.href = `/auth/callback?code=${code}`;
```

### 3. Callback Handler
```bash
POST /api/auth/callback?code=550e8400-e29b-41d4-a716-446655440000&telegram_id=123456

Response:
{
  "status": "ok",
  "token": "abc123xyz...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "telegram_id": 123456,
    "username": "Player",
    "referral_code": "UP-ABC123",
    "up_coins": 100
  }
}
```

---

## 👤 User Data

### Get Current User (Cached)
```bash
GET /api/users/me
Headers: Authorization: Bearer {token}

Response:
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "telegram_id": 123456,
  "username": "Player",
  "up_coins": 1500,
  "referral_code": "UP-ABC123",
  "role": "stalker",
  "created_at": "2024-01-01T00:00:00"
}

Cache: 5 minutes (Cache-Control: private, max-age=300)
ETag: "550e8400abc123"
```

### Force Refresh User Data
```bash
POST /api/users/me/refresh
Headers: Authorization: Bearer {token}

Response: (same as GET /me, but no cache)
```

### Get Public Profile
```bash
GET /api/users/u/UP-ABC123

Response:
{
  "success": true,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "full_name": "Player",
    "role": "stalker",
    "created_at": "2024-01-01T00:00:00",
    "achievements_count": 5,
    "referral_code": "UP-ABC123",
    "photo_url": "https://example.com/avatar.jpg"
  }
}

# No auth required - fully public
```

---

## 🎪 Events

### List Upcoming Events
```bash
GET /api/v1/events/upcoming?limit=10&offset=0
Headers: Authorization: Bearer {token}  # Optional, but recommended

Response:
{
  "events": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Grand Tournament",
      "description": "Epic battle royale",
      "start_date": "2024-12-20T18:00:00",
      "end_date": "2024-12-20T22:00:00",
      "location": "Shelter Arena",
      "price": 50,
      "image_url": "https://example.com/image.jpg",
      "capacity": 100,
      "is_active": true
    }
  ]
}
```

### Get Event Details
```bash
GET /api/v1/events/550e8400-e29b-41d4-a716-446655440000
Headers: Authorization: Bearer {token}  # Optional

Response:
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Grand Tournament",
  "description": "Epic battle royale with prizes",
  "start_date": "2024-12-20T18:00:00",
  "end_date": "2024-12-20T22:00:00",
  "location": "Shelter Arena",
  "price": 50,
  "image_url": "https://example.com/image.jpg",
  "capacity": 100,
  "is_active": true,
  "created_at": "2024-12-01T12:00:00",
  "updated_at": "2024-12-01T12:00:00"
}

# Status codes:
# 200 - Event found
# 404 - Event not found
```

---

## 📋 Pagination Pattern

### Events List
```bash
# First page (10 items)
GET /api/v1/events/upcoming?limit=10&offset=0

# Next page
GET /api/v1/events/upcoming?limit=10&offset=10

# Custom limit
GET /api/v1/events/upcoming?limit=25&offset=0
```

**Query Params:**
- `limit` (int, default=10): How many items to return
- `offset` (int, default=0): How many items to skip

**Example:** offset=20, limit=10 returns items 20-29

---

## 🔗 Frontend Endpoints

### Navigate to Public Profile
```javascript
// User referral code
const code = "UP-ABC123";
window.location.href = `/u/${code}`;
```

### Navigate to Events
```javascript
window.location.href = "/events";
```

### Share Profile Link
```javascript
const referralCode = user.referral_code;  // "UP-ABC123"
const shareUrl = `${window.location.origin}/u/${referralCode}`;
// Share via QR code or direct link
```

---

## ⚙️ Headers

### Required Headers
```javascript
// For authenticated endpoints
headers: {
  "Authorization": `Bearer ${token}`,
  "Content-Type": "application/json"
}

// For public endpoints
headers: {
  "Content-Type": "application/json"
}
```

### Response Headers (Caching)
```
Cache-Control: private, max-age=300
ETag: "550e8400abc123"
Vary: Authorization
```

---

## 🐛 Common Status Codes

| Code | Meaning | Solution |
|------|---------|----------|
| 200 | Success | ✅ All good |
| 400 | Bad Request | Check query params/body |
| 401 | Unauthorized | Add Bearer token |
| 404 | Not Found | Check resource ID or referral code |
| 500 | Server Error | Check backend logs |

---

## 🧪 Testing with curl

### Auth
```bash
curl -X POST http://localhost:8000/api/auth/generate-code \
  -H "Content-Type: application/json" \
  -d '{"telegram_id": 123456}'
```

### Get Current User
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/users/me
```

### List Events
```bash
curl http://localhost:8000/api/v1/events/upcoming?limit=5
```

### Get Public Profile
```bash
curl http://localhost:8000/api/users/u/UP-ABC123
```

---

## 💾 localStorage Keys

| Key | Value | Used For |
|-----|-------|----------|
| `auth_token` | JWT/UUID token | API authentication |
| User data | JSON (from /api/users/me) | UI rendering |
| Preferences | JSON | Settings |

---

## 🔄 Sync Pattern

### Every 30 seconds
```javascript
useEffect(() => {
  const interval = setInterval(async () => {
    const response = await fetch('/api/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    // Update balance, coins, etc.
  }, 30000);
  return () => clearInterval(interval);
}, []);
```

**Note:** Cached на 5 минут, но клиент может запрашивать чаще.

---

## 🚨 Error Handling

### Check if code is expired
```javascript
try {
  const response = await fetch('/api/auth/callback?code=X&telegram_id=Y');
  
  if (response.status === 401) {
    // Code expired or invalid
    console.error("Auth code invalid or expired");
  } else if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
} catch (error) {
  console.error("Network error:", error);
}
```

### Handle missing user profile
```javascript
const response = await fetch('/api/users/u/UP-INVALID');

if (response.status === 404) {
  // Show 404 page
  navigate('/404');
}
```

---

## 📚 Referral Code Format

**Format:** `UP-XXXXXX`  
**Length:** 9 characters total (3 prefix + 6 code)  
**Characters:** A-Z, 0-9  

**Examples:**
- `UP-A1B2C3`
- `UP-ZZ9999`
- `UP-000000`

---

## 🔄 Refresh Tokens Pattern

**Current:** Using stateless tokens (no expiration)  
**Future:** JWT with refresh token rotation

```javascript
// For now - if 401 error
if (response.status === 401) {
  // Clear token and redirect to login
  localStorage.removeItem('auth_token');
  window.location.href = '/auth';
}
```

---

## 📦 Database Schema Reference

### User Model
```sql
id (UUID) PRIMARY KEY
telegram_id (Integer) UNIQUE
referral_code (String) UNIQUE, INDEX
username (String)
up_coins (Integer)
role (Enum: ranger, stalker, elder)
created_at (DateTime)
```

### Event Model
```sql
id (UUID) PRIMARY KEY
title (String)
start_date (DateTime) INDEX
end_date (DateTime)
location (String)
price (Float)
capacity (Integer)
image_url (String)
is_active (Boolean)
created_at (DateTime)
```

---

## 🎯 Best Practices

1. **Auth Codes:** Always use from backend, never expose in client
2. **Tokens:** Store in localStorage, send in Authorization header
3. **Events:** Cache locally, refresh every 5 minutes
4. **Public Profiles:** No sensitive data, safe to cache on CDN
5. **Error Handling:** Always handle 4xx and 5xx responses
6. **Headers:** Always include Content-Type: application/json

