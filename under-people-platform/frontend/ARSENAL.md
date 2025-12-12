# Arsenal E-Commerce Module

Quick reference for the Arsenal shopping system implemented in Phase 4.

## 🚀 Quick Start

### Development
```bash
# From frontend directory
python start.py

# Or manual start
npm install --legacy-peer-deps
npm run dev
```

Visit: `http://localhost:3000/arsenal`

### Production Build
```bash
python build.py
npm run build
```

## 📁 File Structure

```
frontend/
├── app/
│   └── arsenal/
│       └── page.tsx           # E-commerce page (220 lines)
├── components/
│   └── arsenal/
│       └── ProductCard.tsx     # Product display card (66 lines)
├── store/
│   └── cartStore.ts            # Zustand cart store (37 lines)
├── lib/
│   └── config.ts               # URL configuration (11 lines)
├── .env.example                # Environment template
├── start.py                    # Dev launcher (320 lines)
├── build.py                    # Build validator (80 lines)
└── package.json               # Dependencies (must include zustand)
```

## 🛍️ Key Features

### Product Grid
- 5 sample products (tickets, gear, lootboxes)
- Responsive layout (1-3 columns)
- Category badges
- Price display
- Add-to-cart buttons

### Shopping Cart
- Toggleable display
- Item listing with prices
- Real-time total calculation
- Clear and checkout buttons
- Persistent storage (localStorage)

### Checkout
- Generates Telegram bot deep link
- Encodes cart items and total
- Opens bot in new window
- Format: `https://t.me/bot?start=pay_TOTAL_IDS`

## 📦 Dependencies

Must include in `package.json`:
```json
{
  "dependencies": {
    "zustand": "^4.4.0",
    "next": "^14.0.0",
    "react": "^18.0.0"
  }
}
```

Install with:
```bash
npm install --legacy-peer-deps
```

## 💾 Using the Cart Store

### In Components
```typescript
'use client';
import { useCartStore } from '@/store/cartStore';

export default function MyComponent() {
  const { items, addItem, removeItem, clearCart, total } = useCartStore();
  
  return (
    <div>
      <p>Items: {items.length}</p>
      <p>Total: {total()} UP</p>
    </div>
  );
}
```

### Add Item
```typescript
const { addItem } = useCartStore();
addItem({
  id: 'product_123',
  name: 'VIP Pass',
  price: 2999,
  image: '/img/ticket.jpg',
  category: 'ticket'
});
```

### Remove Item
```typescript
const { removeItem } = useCartStore();
removeItem('product_123');
```

### Clear Cart
```typescript
const { clearCart } = useCartStore();
clearCart();
```

### Get Total
```typescript
const { total } = useCartStore();
const amount = total(); // Returns sum of all prices
```

## 🎨 Styling

All components use Tailwind CSS with custom theme:
- **Primary Color**: Blood Red (`#8A0303`)
- **Background**: Void Black (`#050505`/`#080202`)
- **Fonts**: Monaco (mono), Syncopate (headers)

## 🔧 Configuration

### URL Configuration (`lib/config.ts`)
```typescript
import { SITE_URL } from '@/lib/config';

// Works on any domain
const qrUrl = `${SITE_URL}/u/ref_code`;
const apiUrl = `${SITE_URL}/api/products`;
```

### Environment Variables
```env
# .env.local
NEXT_PUBLIC_APP_URL=https://underpeople.club
NEXT_PUBLIC_BOT_NAME=underpeople_club_bot
NEXT_PUBLIC_API_URL=https://api.underpeople.club
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# start.py auto-fallbacks to port 3001
python start.py

# Or specify port
npm run dev -- -p 3001
```

### Module Not Found (zustand)
```bash
npm install zustand@latest --legacy-peer-deps
```

### Images Not Loading
- Check `/public/img/` folder exists
- ProductCard has fallback text display
- Ready for image CDN integration

### Cart Doesn't Persist
- Check localStorage is enabled
- Verify `.env.local` configuration
- Test in browser dev tools: `Application > Local Storage`

## 📊 API Integration (Future)

Replace hardcoded PRODUCTS array with API:

```typescript
// frontend/app/arsenal/page.tsx
const [products, setProducts] = useState<Product[]>([]);

useEffect(() => {
  fetch(`${SITE_URL}/api/products`)
    .then(r => r.json())
    .then(data => setProducts(data))
    .catch(console.error);
}, []);
```

## 🤖 Telegram Bot Integration (Future)

1. Create bot with BotFather
2. Set webhook: `POST /api/telegram/webhook`
3. Handle deep link: `pay_TOTAL_IDS`
4. Process payment via bot

Example bot link:
```
https://t.me/underpeople_club_bot?start=pay_5000_ticket_vip_hoodie_ranger
```

## 📋 Product Categories

| Category | Items | Purpose |
|----------|-------|---------|
| **ticket** | VIP Pass, Standard Entry | Event access |
| **gear** | Hoodie, Mask | Merchandise |
| **lootbox** | Mystery Box | Random rewards |

## 🔐 Security Notes

- No sensitive data stored client-side
- Payment handled via Telegram (secure)
- Cart in localStorage (user machine)
- HTTPS enforced on production
- CORS configured for API

## 📞 Support

### Scripts
- `python start.py` - Start dev server with checks
- `python build.py` - Validate build for Vercel
- `npm run dev` - Manual dev server
- `npm run build` - Manual production build

### Logs
Check browser console for:
- Cart operations
- Checkout information
- API calls
- GSAP animations

## 🎓 Code Examples

### Custom Product Card
```tsx
import ProductCard from '@/components/arsenal/ProductCard';

export default function CustomShop() {
  const product = {
    id: 'custom_item',
    name: 'Custom Item',
    price: 999,
    image: '/img/custom.jpg',
    category: 'gear' as const,
  };
  
  return <ProductCard product={product} delay={0} />;
}
```

### Custom Checkout
```tsx
import { useCartStore } from '@/store/cartStore';

const { items, total } = useCartStore();

const handleCustomCheckout = () => {
  const payload = {
    items: items.map(i => i.id),
    total: total(),
    timestamp: Date.now(),
  };
  
  // Send to backend
  fetch('/api/checkout', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};
```

## 📚 Resources

- [Next.js 14 Docs](https://nextjs.org)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Tailwind CSS](https://tailwindcss.com)
- [Telegram Bot API](https://core.telegram.org/bots/api)

---

**Last Updated**: December 13, 2025  
**Status**: ✅ Phase 4 Complete  
**Next**: Phase 5 (API Integration + Bot)
