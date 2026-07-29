# STYLEKART - Full-Stack Implementation Guide

## Project Overview

STYLEKART is a ultra-premium luxury ethnic and designer fashion marketplace built with Next.js 16, Tailwind CSS, Framer Motion, and a modern API backend. The platform features cinematic animations, premium UI/UX, and a complete e-commerce experience.

---

## Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS 4.2
- **Animations:** Framer Motion 12
- **Icons:** Lucide React
- **Components:** shadcn/ui
- **State Management:** React Context (Cart, Auth)
- **Image Optimization:** Next.js Image component

### Backend (Future Integration)
- **Runtime:** Node.js + Express
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT + OTP
- **Payments:** Razorpay
- **File Storage:** Cloudinary
- **Email:** SMTP/SendGrid

---

## Project Structure

```
stylekart/
├── app/
│   ├── (pages)
│   ├── api/                          # API routes
│   │   ├── auth/                     # Authentication
│   │   ├── products/                 # Product listing
│   │   ├── orders/                   # Order management
│   │   └── payments/                 # Payment processing
│   ├── auth/                         # Auth pages
│   ├── shop/                         # Product listing
│   ├── product/[id]/                 # Product detail
│   ├── cart/                         # Shopping cart
│   ├── checkout/                     # Checkout flow
│   ├── account/                      # User dashboard
│   ├── search/                       # Search page
│   ├── admin/                        # Admin panel
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Homepage
│   └── globals.css                   # Global styles
├── components/
│   ├── layout/                       # Navbar, Footer
│   ├── sections/                     # Page sections
│   ├── products/                     # Product components
│   └── utils/                        # Scroll reveal, helpers
├── context/                          # React Context
│   ├── CartContext.tsx
│   └── AuthContext.tsx
├── api/                              # Backend models (future)
│   ├── models/                       # MongoDB models
│   └── server.ts
├── public/                           # Static assets
└── tailwind.config.ts                # Tailwind config
```

---

## Key Features Implemented

### 1. Authentication System
- Email/Password login and signup
- OTP verification for phone numbers
- JWT token-based session management
- Forgot password flow
- Protected routes with AuthContext

**Files:**
- `/app/auth/login/page.tsx`
- `/app/auth/signup/page.tsx`
- `/app/auth/forgot-password/page.tsx`
- `/context/AuthContext.tsx`
- `/app/api/auth/*`

### 2. Premium Homepage
- Cinematic hero carousel with auto-sliding banners
- Floating particle animations
- Featured collections grid
- Designer showcase section
- Premium testimonials area
- Newsletter signup

**Files:**
- `/app/page.tsx`
- `/components/sections/HeroCarousel.tsx`
- `/components/sections/CollectionsGrid.tsx`
- `/components/sections/FeaturedProducts.tsx`
- `/components/sections/DesignersShowcase.tsx`

### 3. Product Pages
- Advanced product filtering (price, designer, fabric, occasion)
- Product listing with image zoom
- Detailed product information
- Image gallery with zoom-on-hover
- Size selection with guide
- Wishlist functionality
- Product ratings and reviews

**Files:**
- `/app/shop/page.tsx`
- `/app/product/[id]/page.tsx`
- `/components/products/ProductCard.tsx`
- `/components/products/FilterSidebar.tsx`

### 4. Shopping & Checkout
- Add to cart with quantity management
- Real-time cart total calculation
- Multi-step checkout flow (shipping → payment → confirmation)
- Address management
- Tax and shipping calculation
- Order confirmation page

**Files:**
- `/app/cart/page.tsx`
- `/app/checkout/page.tsx`
- `/context/CartContext.tsx`

### 5. User Dashboard
- Personal information management
- Order history and tracking
- Wishlist management
- Saved addresses
- Loyalty rewards program
- Account settings

**Files:**
- `/app/account/page.tsx`

### 6. Search Experience
- Full-text search with trending searches
- Recent search history
- Search results with product cards
- Filter and sort options

**Files:**
- `/app/search/page.tsx`
- `/app/api/products/route.ts`

### 7. Admin Dashboard
- Sales analytics and revenue tracking
- Order management
- Product inventory management
- User management
- Dashboard statistics

**Files:**
- `/app/admin/page.tsx`

### 8. Premium Navigation
- Sticky navbar with glass morphism
- Mega menu with category grouping
- Live cart and wishlist counters
- User account quick access
- Search button
- Mobile-responsive hamburger menu

**Files:**
- `/components/layout/Navbar.tsx`

### 9. Animations & Effects
- Scroll reveal animations
- Page transition animations
- Hover zoom effects
- Staggered item animations
- Loading skeletons
- Smooth transitions between pages

**Files:**
- `/components/utils/ScrollReveal.tsx`
- `/app/globals.css`
- All component files with Framer Motion

---

## Design System

### Color Palette
```css
--background: #F8F5F0 (Ivory White)
--foreground: #0F0F0F (Matte Black)
--accent: #C8A96B (Royal Gold)
--secondary: #0F3B2E (Dark Emerald)
--tertiary: #4B1E24 (Deep Burgundy)
--muted: #D8C3A5 (Champagne Beige)
```

### Typography
- **Display:** Playfair Display (headings)
- **Editorial:** Cormorant Garamond (body text)
- **UI:** Inter (buttons, labels)
- **Secondary:** Poppins (accents)

### Effects
- Glass morphism backgrounds
- Gold glow accents on hover
- Premium shadows (shadow-premium, shadow-premium-lg)
- Subtle gradients
- Smooth transitions

---

## API Routes

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/send-otp` - Send OTP to phone
- `POST /api/auth/verify-otp` - Verify OTP and create account
- `POST /api/auth/forgot-password` - Forgot password flow

### Products
- `GET /api/products` - Get all products (with filters/sorting)
- `POST /api/products` - Create new product (admin only)

### Orders
- `GET /api/orders?userId=X` - Get user orders
- `POST /api/orders` - Create new order
- `PATCH /api/orders` - Update order status

### Payments
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify-payment` - Verify payment signature

---

## Next Steps for Production

### 1. Backend Setup
```bash
# Install Node.js dependencies
npm install express mongoose bcryptjs jsonwebtoken cors multer cloudinary razorpay

# Connect MongoDB
# Set environment variables for Razorpay, Cloudinary, JWT Secret
```

### 2. Database Models
- User model with authentication
- Product model with relationships
- Order model with transaction tracking
- Designer model
- Review/Rating model

### 3. Environment Variables
```
MONGODB_URI=your_mongodb_uri
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_secret
JWT_SECRET=your_jwt_secret
CLOUDINARY_NAME=your_cloudinary
CLOUDINARY_KEY=your_key
CLOUDINARY_SECRET=your_secret
```

### 4. Payment Integration
- Complete Razorpay SDK integration
- Webhook handling for payment status
- Email notifications for orders
- Invoice generation

### 5. Email Service
- Order confirmation emails
- OTP emails
- Password reset emails
- Newsletter subscription

### 6. Image Optimization
- Integrate Cloudinary for image uploads
- Set up product image gallery
- Implement image caching

### 7. Deployment
- Deploy to Vercel (frontend)
- Deploy backend to Railway, Heroku, or AWS
- Set up CDN for assets
- Configure CORS for API

### 8. Security
- Implement rate limiting
- Add CSRF protection
- Secure password storage (bcrypt)
- SSL/HTTPS everywhere
- Input validation and sanitization
- XSS protection

### 9. Testing
- Unit tests for components
- Integration tests for APIs
- E2E testing for user flows
- Load testing for production readiness

### 10. Performance Optimization
- Image lazy loading
- Code splitting
- Caching strategies
- Database query optimization
- CDN for static assets

---

## Development Workflow

### Running the Dev Server
```bash
pnpm dev
# Opens on http://localhost:3000
```

### Building for Production
```bash
pnpm build
pnpm start
```

### Linting and Formatting
```bash
pnpm lint
pnpm format
```

---

## Demo Credentials

For testing authentication:
- **Email:** demo@stylekart.com
- **Password:** demo123

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Performance Metrics

- **Lighthouse Score:** 90+ (target)
- **Page Load Time:** < 2 seconds
- **Core Web Vitals:** All green
- **Mobile Performance:** Optimized for 4G+

---

## Support & Documentation

For more information:
- Check brand identity document
- Review component documentation
- Refer to API endpoint specs
- See design guidelines

---

## License

Proprietary - STYLEKART

---

**Last Updated:** May 2026
**Version:** 1.0.0-alpha
