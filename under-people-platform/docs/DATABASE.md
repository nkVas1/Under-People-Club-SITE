# Database Schema

## User Management

### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_id INTEGER UNIQUE NOT NULL,
  username VARCHAR,
  avatar_url VARCHAR,
  up_coins INTEGER DEFAULT 100,
  clan_name VARCHAR DEFAULT 'Outcasts',
  referral_code VARCHAR UNIQUE NOT NULL,
  invited_by_code VARCHAR REFERENCES users(referral_code),
  role ENUM ('ranger', 'stalker', 'elder') DEFAULT 'ranger',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_telegram_id ON users(telegram_id);
CREATE INDEX idx_users_referral_code ON users(referral_code);
```

## E-Commerce

### products
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  image_url VARCHAR,
  product_type ENUM ('ticket', 'gear', 'digital'),
  stock INTEGER DEFAULT -1,
  is_active BOOLEAN DEFAULT true
);
```

### orders
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  amount_rub INTEGER NOT NULL,
  coins_used INTEGER DEFAULT 0,
  status ENUM ('pending', 'waiting', 'paid', 'canceled') DEFAULT 'pending',
  payment_proof_url VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
```

## Gaming System

### cards
```sql
CREATE TABLE cards (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  image_url VARCHAR,
  rarity ENUM ('common', 'rare', 'epic', 'legendary') DEFAULT 'common',
  power INTEGER DEFAULT 10,
  clan VARCHAR DEFAULT 'Outcasts'
);
```

### user_cards
```sql
CREATE TABLE user_cards (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  card_id INTEGER NOT NULL REFERENCES cards(id),
  is_locked BOOLEAN DEFAULT false
);

CREATE INDEX idx_user_cards_user_id ON user_cards(user_id);
```

### market_listings
```sql
CREATE TABLE market_listings (
  id SERIAL PRIMARY KEY,
  seller_id UUID NOT NULL REFERENCES users(id),
  user_card_id INTEGER NOT NULL REFERENCES user_cards(id) UNIQUE,
  price INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_market_listings_seller_id ON market_listings(seller_id);
```

## Referral System

```sql
-- Referrals are tracked via users.invited_by_code
-- Count referrals:
SELECT COUNT(*) as referral_count 
FROM users 
WHERE invited_by_code = 'REF_CODE';
```

## Queries

### Get user profile with stats
```sql
SELECT 
  u.id, u.username, u.up_coins,
  COUNT(DISTINCT uc.id) as card_count,
  COUNT(DISTINCT o.id) as order_count
FROM users u
LEFT JOIN user_cards uc ON u.id = uc.user_id
LEFT JOIN orders o ON u.id = o.user_id AND o.status = 'paid'
WHERE u.id = $1
GROUP BY u.id;
```

### Top 10 users by UP Coins
```sql
SELECT id, username, up_coins, clan_name
FROM users
WHERE is_active = true
ORDER BY up_coins DESC
LIMIT 10;
```

### Market listings with card info
```sql
SELECT 
  ml.id, ml.price,
  c.name, c.rarity, c.power,
  u.username as seller_name
FROM market_listings ml
JOIN user_cards uc ON ml.user_card_id = uc.id
JOIN cards c ON uc.card_id = c.id
JOIN users u ON ml.seller_id = u.id
ORDER BY ml.created_at DESC;
```

---

**Migrations:** Use Alembic for schema versioning
```bash
alembic revision --autogenerate -m "Add column"
alembic upgrade head
```
