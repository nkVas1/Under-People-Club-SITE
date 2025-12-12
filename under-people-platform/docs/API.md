# API Reference

Base URL: `https://api.underpeople.club`

## Authentication

### Telegram Login
**POST** `/api/auth/login/telegram`

Request:
```json
{
  "id": 123456789,
  "first_name": "John",
  "last_name": "Doe",
  "username": "johndoe",
  "photo_url": "https://...",
  "auth_date": 1234567890,
  "hash": "..."
}
```

Response:
```json
{
  "status": "ok",
  "user": {
    "id": "uuid",
    "username": "johndoe",
    "coins": 100,
    "role": "ranger",
    "ref_code": "UP-XXXXX",
    "clan_name": "Outcasts"
  }
}
```

### Logout
**POST** `/api/auth/logout`

Response:
```json
{
  "status": "ok",
  "message": "Logged out"
}
```

## Users

### Get User Profile
**GET** `/api/users/profile/{user_id}`

Response:
```json
{
  "id": "uuid",
  "username": "johndoe",
  "coins": 100,
  "clan_name": "Outcasts",
  "avatar_url": "https://...",
  "ref_code": "UP-XXXXX",
  "role": "ranger",
  "created_at": "2025-01-01T00:00:00Z"
}
```

### Get Leaderboard
**GET** `/api/users/leaderboard?limit=10`

Response:
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "username": "player1",
      "coins": 10000,
      "clan": "Outcasts"
    }
  ]
}
```

## Products

### List Products
**GET** `/api/products/`

Response:
```json
{
  "products": [
    {
      "id": 1,
      "name": "VIP Pass",
      "description": "...",
      "price": 2000,
      "image_url": "https://...",
      "type": "ticket"
    }
  ]
}
```

### Get Product
**GET** `/api/products/{product_id}`

Response:
```json
{
  "id": 1,
  "name": "VIP Pass",
  "description": "...",
  "price": 2000,
  "image_url": "https://...",
  "type": "ticket",
  "stock": -1
}
```

## Orders

### Create Order
**POST** `/api/orders/`

Request:
```json
{
  "user_id": "uuid",
  "product_id": 1,
  "coins_to_use": 0
}
```

Response:
```json
{
  "id": "order-uuid",
  "status": "pending",
  "amount_rub": 2000,
  "telegram_payment_link": "https://t.me/bot?start=pay_order-uuid"
}
```

### Get Orders
**GET** `/api/orders/?user_id={uuid}`

### Get Order
**GET** `/api/orders/{order_id}`

## Cards & Gaming

### List Cards
**GET** `/api/cards/`

### Open Pack
**POST** `/api/cards/open-pack`

Request:
```json
{
  "user_id": "uuid",
  "pack_type": "standard"
}
```

Response:
```json
{
  "cards": [
    {
      "id": 1,
      "name": "Card Name",
      "rarity": "rare",
      "image_url": "https://..."
    }
  ]
}
```

## Marketplace

### List Listings
**GET** `/api/market/listings?limit=20&offset=0`

Response:
```json
{
  "listings": [
    {
      "id": 1,
      "price": 500,
      "card": { "id": 1, "name": "...", "rarity": "..." },
      "seller": { "id": "uuid", "username": "..." },
      "created_at": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 100
}
```

### Buy Card
**POST** `/api/market/listings/{listing_id}/buy`

Request:
```json
{
  "buyer_id": "uuid"
}
```

Response:
```json
{
  "status": "success",
  "message": "Card purchased successfully"
}
```

## Health & Status

### Health Check
**GET** `/health`

Response:
```json
{
  "status": "ok",
  "message": "Under People API is running"
}
```

---

**Error Responses:**

```json
{
  "detail": "Error message",
  "status": 400
}
```

Common Status Codes:
- `200`: Success
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error
