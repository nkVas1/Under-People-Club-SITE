export const API_ENDPOINTS = {
  AUTH: {
    LOGIN_TELEGRAM: '/login/telegram',
    LOGOUT: '/logout',
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
  },
  PRODUCTS: {
    LIST: '/products',
    GET: '/products/:id',
  },
  ORDERS: {
    CREATE: '/orders',
    LIST: '/orders',
    GET: '/orders/:id',
  },
  CARDS: {
    LIST: '/cards',
    OPEN_PACK: '/cards/open-pack',
  },
  MARKET: {
    LISTINGS: '/market/listings',
    BUY: '/market/listings/:id/buy',
  },
}
