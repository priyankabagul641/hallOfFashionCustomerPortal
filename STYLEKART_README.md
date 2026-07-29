# STYLEKART - Ultra-Premium Luxury Fashion Marketplace

## Project Overview

STYLEKART is a fully responsive, ultra-premium luxury ethnic and designer fashion marketplace website. It combines the visual richness and heritage branding of Indian royal fashion houses with modern e-commerce technology.

**Tagline:** "Crafted Legacy. Worn with Pride."

## Design Language

### Color Palette
- **Matte Black:** #0F0F0F (Primary)
- **Royal Gold:** #C8A96B (Accent)
- **Ivory White:** #F8F5F0 (Background)
- **Dark Emerald:** #0F3B2E (Secondary)
- **Deep Burgundy:** #4B1E24 (Tertiary)
- **Champagne Beige:** #D8C3A5 (Muted)

### Typography
- **Playfair Display:** Editorial headings and display text
- **Cormorant Garamond:** Luxury body and editorial text
- **Inter:** Primary sans-serif for body and UI
- **Poppins:** Secondary sans-serif for accents

### Visual Features
- Glass morphism effects
- Gold glow accents
- Smooth Framer Motion animations
- Premium shadow layers
- Cinematic full-width banners
- Scroll reveal animations
- Hover zoom effects

## Project Structure

```
stylekart/
├── app/
│   ├── page.tsx                    # Homepage
│   ├── layout.tsx                  # Root layout with fonts and providers
│   ├── globals.css                 # Design system tokens
│   ├── shop/
│   │   └── page.tsx               # Product listing page
│   ├── product/
│   │   └── [id]/page.tsx          # Product detail page
│   ├── collections/
│   │   └── page.tsx               # Collections showcase
│   ├── designers/
│   │   └── page.tsx               # Designers showcase
│   ├── cart/
│   │   └── page.tsx               # Shopping cart
│   ├── wishlist/
│   │   └── page.tsx               # Wishlist
│   ├── checkout/
│   │   └── page.tsx               # Multi-step checkout
│   ├── about/
│   │   └── page.tsx               # About page
│   └── not-found.tsx              # 404 page
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx             # Premium sticky navbar with mega menu
│   │   └── Footer.tsx             # Luxury footer with newsletter
│   ├── sections/
│   │   ├── HeroSection.tsx        # Auto-sliding cinematic hero
│   │   ├── CollectionsGrid.tsx    # Collection cards
│   │   ├── FeaturedProducts.tsx   # Product showcase
│   │   ├── CinematicBanner.tsx    # Full-width feature banner
│   │   └── DesignersShowcase.tsx  # Designer profiles
│   └── products/
│       ├── ProductCard.tsx        # Product card with actions
│       └── FilterSidebar.tsx      # Advanced filtering
├── context/
│   └── CartContext.tsx            # Global cart and wishlist state
├── public/                        # Static assets
├── tailwind.config.ts             # Tailwind configuration with luxury tokens
├── next.config.mjs                # Next.js configuration
└── package.json

```

## Key Features Implemented

### 1. **Premium Navbar**
- Sticky transparent navbar with glass morphism
- Auto-sliding mega menu with category navigation
- Live cart and wishlist counters
- Mobile-responsive hamburger menu
- Smooth scroll detection

### 2. **Homepage**
- Auto-sliding cinematic hero banner with overlay gradients
- Collections grid with hover effects
- Featured products carousel
- Designer showcase with profile cards
- Cinematic feature banner
- Scroll animations throughout

### 3. **Product Pages**
- **PLP (Product Listing Page):**
  - Grid layout with responsive columns
  - Advanced filter sidebar (price, designer, collection, fabric)
  - Sorting options (newest, price, popularity)
  - Product cards with wishlist functionality

- **PDP (Product Detail Page):**
  - Image gallery with thumbnail navigation
  - Size selection with guide link
  - Quantity selector
  - Add to cart and wishlist buttons
  - Product details tabs
  - Rating and review section
  - Premium feature indicators (shipping, returns, authenticity)

### 4. **Shopping Features**
- **Cart Management:**
  - Add/remove/update quantity
  - Real-time total calculations
  - Tax and shipping calculations
  - Order summary sidebar

- **Wishlist:**
  - Save favorite items
  - Remove from wishlist
  - Separate wishlist page
  - Integration with cart

### 5. **Checkout Flow**
- **Multi-step checkout:**
  - Step 1: Shipping address
  - Step 2: Payment method
  - Step 3: Order confirmation
- Form validation and input handling
- Order summary with itemized breakdown

### 6. **Additional Pages**
- Collections page with all available collections
- Designers page with designer profiles and statistics
- About page with company values and commitment
- 404 error page with smooth animations

### 7. **State Management**
- Global cart context with React hooks
- Persistent wishlist functionality
- Cart totals and item counts
- Add/remove/update operations

### 8. **Design System**
- Custom Tailwind configuration with luxury tokens
- Reusable color and typography classes
- Premium shadow system
- Animation utility classes
- Glass morphism components
- Responsive spacing scale

## Technologies Used

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS 4.2 with custom config
- **Animations:** Framer Motion 12
- **UI Components:** shadcn/ui
- **State Management:** React Context + Hooks
- **Icons:** Lucide React
- **Images:** Next.js Image optimization
- **Type Safety:** TypeScript

## Performance Features

- Image optimization with Next.js Image component
- Lazy loading with whileInView animations
- Smooth transitions and micro-interactions
- Responsive design (mobile-first approach)
- Semantic HTML for accessibility
- Fast page transitions

## Getting Started

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

### Development

The dev server runs on `http://localhost:3000` with hot module replacement enabled.

## Design Decisions

1. **Luxury First:** Every element prioritizes elegance and premium aesthetics
2. **Heritage-Inspired:** Colors, typography, and imagery celebrate Indian heritage
3. **Performance:** Optimized animations and lazy loading for smooth experience
4. **Accessibility:** Semantic HTML and ARIA attributes throughout
5. **Responsiveness:** Desktop-first luxury layout that scales beautifully to mobile
6. **User Experience:** Smooth transitions, clear CTAs, and intuitive navigation

## Future Enhancements

- User authentication and accounts
- Real payment gateway integration
- Product reviews and ratings system
- Live chat support
- Inventory management
- Admin dashboard
- Advanced search with AI recommendations
- Personalization engine
- Social media integration

## Brand Assets

All product images, hero banners, and lifestyle photography are sourced from high-quality stock photography to maintain the luxury aesthetic. In a production environment, these would be replaced with actual product photography and brand assets.

## Notes

- The marketplace uses sample data for demonstration
- Cart and wishlist data is stored in React context (not persisted)
- Payment methods are UI-only for demo purposes
- Search functionality can be enhanced with backend integration

---

**STYLEKART - Where Heritage Meets Luxury**
