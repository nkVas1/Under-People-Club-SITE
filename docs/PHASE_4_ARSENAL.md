# Phase 4: Arsenal E-Commerce System

## 📊 Summary

**Date**: December 13, 2025  
**Status**: ✅ Complete  
**Components**: 7 files created/updated

## 🎯 Objectives

- [x] Implement dynamic URL configuration (environment-aware)
- [x] Create shopping cart system with persistence (Zustand)
- [x] Build product card component with animations
- [x] Create Arsenal e-commerce page with checkout flow
- [x] Integrate Telegram bot deep linking for payments
- [x] Add professional startup and build scripts

## 📁 Files Created/Updated

### Core Files

#### `frontend/lib/config.ts` ✨ NEW
**Purpose**: Centralized URL configuration based on environment  
**Key Features**:
- Detects deployment environment (production Vercel vs local dev)
- Falls back gracefully: NEXT_PUBLIC_APP_URL → NEXT_PUBLIC_VERCEL_URL → localhost:3000
- Exported `SITE_URL` constant for use throughout app

```typescript
export const SITE_URL = getBaseUrl();
```

**Usage**:
```typescript
import { SITE_URL } from '@/lib/config';
const qrUrl = `${SITE_URL}/u/${refCode}`;
```

---

#### `frontend/store/cartStore.ts` ✨ NEW
**Purpose**: Global shopping cart state management with localStorage persistence  
**Architecture**: Zustand store with automatic localStorage sync

**Store Interface**:
```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: 'ticket' | 'gear' | 'lootbox';
}

interface CartState {
  items: Product[];
  addItem: (item: Product) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  total: () => number;
}
```

**Key Methods**:
- `addItem(product)` - Add item to cart, show system alert
- `removeItem(id)` - Remove item by ID
- `clearCart()` - Reset cart to empty
- `total()` - Calculate total price of all items

**Persistence**: Stored in localStorage under `'up-cart-storage'`

---

#### `frontend/components/arsenal/ProductCard.tsx` ✨ NEW
**Purpose**: Reusable product display card with shopping functionality  
**Features**:
- Category badge (top-right corner)
- Grayscale→color image effect on hover
- Animated border highlight
- Add-to-cart button with system notification
- Fallback text display for missing images
- Optional staggered entrance animation via `delay` prop

**Props**:
```typescript
{
  product: Product;
  delay?: number;  // Animation delay in multiples of 100ms
}
```

**Styling**:
- Border highlight on hover: zinc-200 → blood-red (#8A0303)
- Image transform: grayscale(100%) → grayscale(0%)
- Animated scan line on image
- Text scaling effects

---

#### `frontend/app/arsenal/page.tsx` 🔄 UPDATED
**Status**: Complete rewrite from placeholder  
**Purpose**: E-commerce storefront for tickets, gear, and lootboxes

**Features**:
1. **Product Array**: 5 sample items with mixed categories
   - VIP Access Pass (2999 UP)
   - Standard Entry (999 UP)
   - Ranger Hoodie (1499 UP)
   - Anonymity Mask (799 UP)
   - Mystery Lootbox (499 UP)

2. **Cart Panel**:
   - Toggleable display
   - Lists all items with prices
   - Cart total calculation
   - Clear and Checkout buttons

3. **Checkout Flow**:
   - Generates Telegram bot deep link
   - Format: `https://t.me/underpeople_club_bot?start=pay_SUM_IDS`
   - Encodes item IDs and total price
   - Opens in new window

4. **Product Grid**:
   - Responsive layout (1 col mobile → 3 col desktop)
   - ProductCard components with staggered animation
   - Auto-generated category badges

5. **Styling**:
   - Cyberpunk aesthetic consistent with site
   - Blood-red accents (#8A0303)
   - Terminal-style fonts (Monaco)
   - Noise overlay texture
   - Animated entrance from bottom

---

#### `frontend/start.py` ✨ NEW
**Purpose**: Professional development server launcher  
**Features**:
- Color-coded terminal output with system status
- Automatic dependency check and installation
- Port availability detection with fallback (3000→3001)
- Real-time Next.js log streaming
- Graceful shutdown on Ctrl+C
- ASCII banner and startup summary

**Usage**:
```bash
python start.py
```

**Automatically Checks**:
- ✓ Node.js installed
- ✓ npm installed
- ✓ node_modules exists
- ✓ Port 3000/3001 available

---

#### `frontend/build.py` ✨ NEW
**Purpose**: Build validation helper for Vercel deployment  
**Features**:
- Environment variables verification
- Runs full Next.js build process
- Color-coded build output
- Deployment readiness check

**Usage**:
```bash
python build.py
```

---

### Updated Files

#### `frontend/components/dashboard/ShelterProfile.tsx` 🔄 UPDATED
- Added import: `import { SITE_URL } from '@/lib/config';`
- Changed QR code URL from hardcoded to dynamic:
  ```typescript
  `${SITE_URL}/u/${user.ref_code}`
  ```
- Now works on any deployment (localhost, Vercel, custom domains)

---

## 🛍️ E-Commerce Workflow

### Adding Items to Cart
```typescript
// In any component
const addItem = useCartStore((state) => state.addItem);

const handleBuy = (product: Product) => {
  addItem(product);
  // System notification shown
};
```

### Accessing Cart State
```typescript
const { items, total, clearCart } = useCartStore();

const cartTotal = total();  // Returns sum of all prices
```

### Checkout Process
```typescript
const handleCheckout = () => {
  const totalPrice = total();
  const itemIds = items.map(i => i.id).join('_');
  
  // Generate bot link
  const link = `https://t.me/underpeople_club_bot?start=pay_${totalPrice}_${itemIds}`;
  window.open(link, '_blank');
};
```

---

## 🔗 Integration Points

### With Authentication System
- Cart persists across sessions via localStorage
- Future: Associate cart with user account
- Future: Save past purchases to user profile

### With Telegram Bot
- Deep link format for bot: `pay_TOTAL_ITEM_IDS`
- Bot parses params and initiates payment flow
- Payment status callbacks update Arsenal inventory

### With Backend API
- Future: Replace PRODUCTS array with API call
- Future: Product images from storage service
- Future: Real-time inventory tracking

---

## 🎨 Design Specifications

### Color Scheme
- Blood Red Accent: `#8A0303`
- Void Black Background: `#050505` / `#080202`
- Concrete Gray: `#404040`
- Hover Effects: Red borders, grayscale removal

### Fonts
- Mono Font: Monaco / Space Mono (code, prices)
- Display Font: Syncopate (headers)
- Default: System sans-serif

### Animations
- **Entrance**: Slide from bottom with fade-in
- **Hover**: Border color change + grayscale removal
- **Scan Line**: Animated horizontal line on hover
- **Scale**: Subtle scale effects on interactive elements

---

## 📋 Product Categories

### Tickets (Access)
- VIP Access Pass (2999 UP) - Full club membership
- Standard Entry (999 UP) - Single event pass

### Gear (Merchandise)
- Ranger Hoodie (1499 UP) - Signature apparel
- Anonymity Mask (799 UP) - Collectible item

### Lootboxes (Mystery)
- Mystery Lootbox (499 UP) - Randomized rewards

---

## 🔧 Environment Configuration

### Development
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Production (Vercel)
```env
NEXT_PUBLIC_VERCEL_URL=your-domain.vercel.app
```

### Custom Domain
```env
NEXT_PUBLIC_APP_URL=https://underpeople.club
```

---

## 📈 Next Steps (Phase 5)

1. **Product Images**
   - Add image files to `/public/img/`
   - Test image loading fallback

2. **Telegram Bot Integration**
   - Update bot to handle payment deep links
   - Implement payment processing
   - Create order confirmation messages

3. **Real API Integration**
   - Replace PRODUCTS array with API endpoint
   - Implement product filtering by category
   - Add search functionality

4. **User Accounts**
   - Persist cart to user account
   - Track purchase history
   - Loyalty rewards system

5. **Payment Processing**
   - YooKassa integration or Telegram Payments
   - Order confirmation emails
   - Digital delivery system

---

## 🚀 Deployment Checklist

- [x] Frontend build passes: `npm run build`
- [x] All imports resolve correctly
- [x] TypeScript strict mode compliant
- [x] Environment variables documented
- [x] Cart persistence verified
- [x] Responsive design tested
- [ ] Product images added (next phase)
- [ ] Telegram bot endpoint configured (next phase)
- [ ] Payment system integrated (next phase)

---

## 💾 Commit Message

```
Фаза 4: Реализация Arsenal магазина

✨ NEW:
- frontend/lib/config.ts - динамическая конфигурация URL
- frontend/store/cartStore.ts - глобальное состояние корзины (Zustand)
- frontend/components/arsenal/ProductCard.tsx - компонент карточки товара
- frontend/start.py - профессиональный скрипт запуска dev сервера
- frontend/build.py - скрипт валидации сборки для Vercel

🔄 UPDATED:
- frontend/app/arsenal/page.tsx - полная реализация магазина с checkout
- frontend/components/dashboard/ShelterProfile.tsx - динамический URL в QR коде

🎯 Features:
- Полная e-commerce страница с сеткой товаров
- Система корзины с localStorage персистентностью
- Чекаут через Telegram bot deep linking
- Профессиональный стартер для разработки
- Cyberpunk дизайн с анимациями GSAP

Phase 4 complete - Arsenal store fully functional ✅
```

---

**Документация написана**: Dec 13, 2025  
**Статус фазы**: ✅ ЗАВЕРШЕНА
