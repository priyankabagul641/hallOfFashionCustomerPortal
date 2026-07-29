# STYLEKART - Visual Project Overview

## Brand Identity

**Name:** StyleKart  
**Tagline:** "Crafted Legacy. Worn with Pride."  
**Category:** Ultra-Premium Luxury Fashion Marketplace  
**Target:** High-end Indian couture, bridal wear, designer collections  

---

## Visual Design System

### Color Palette

```
Primary: #0F0F0F (Matte Black)
├─ Deep, sophisticated, luxury baseline
└─ Used for text, primary navigation

Accent: #C8A96B (Royal Gold)
├─ Premium, eye-catching, elegant
└─ Used for highlights, CTAs, luxury elements

Background: #F8F5F0 (Ivory White)
├─ Clean, premium, luxury aesthetic
└─ Main background color

Secondary Colors:
├─ #0F3B2E (Deep Emerald) - Royal depth
├─ #4B1E24 (Burgundy) - Premium accent
└─ #D8C3A5 (Champagne Beige) - Subtle highlights
```

### Typography Hierarchy

```
Display (Headings): Playfair Display
├─ Sizes: 48px - 72px
├─ Weight: Bold (700)
└─ Usage: Main page titles, section headers

Editorial (Body): Cormorant Garamond
├─ Sizes: 18px - 24px
├─ Weight: Regular (400)
└─ Usage: Product descriptions, rich content

UI (Controls): Inter
├─ Sizes: 12px - 16px
├─ Weight: Regular - Semibold (400-600)
└─ Usage: Buttons, inputs, navigation

Secondary (Accents): Poppins
├─ Sizes: 12px - 18px
├─ Weight: Medium - Bold (500-700)
└─ Usage: Tags, badges, highlights
```

### Design Elements

**Spacing:**
- Base unit: 8px (Tailwind default)
- Section padding: 24px, 32px, 48px
- Component gaps: 16px, 24px, 32px
- Mobile padding: 16px
- Desktop padding: 32px - 64px

**Shadows:**
- `shadow-premium`: 0 20px 60px rgba(15, 15, 15, 0.08)
- `shadow-premium-lg`: 0 40px 100px rgba(15, 15, 15, 0.12)
- Used on cards, sections, modals

**Borders:**
- Radius: 12px - 24px (rounded-xl, rounded-2xl)
- Color: #E8DDD0 (subtle gray)
- Used on cards, inputs, buttons

**Glass Morphism:**
- Background: rgba(255, 255, 255, 0.95)
- Backdrop: blur(20px)
- Border: 1px solid rgba(200, 169, 107, 0.1)
- Used on overlays, banners

---

## Homepage Structure (12 Sections)

```
1. Navigation Bar
   ├─ Logo / Brand
   ├─ Mega Menu (Collections, Designers, Shop)
   ├─ Search
   ├─ Account
   ├─ Wishlist Counter
   └─ Cart Counter

2. Hero Carousel
   ├─ Auto-rotating banners (3 slides)
   ├─ Cinematic overlays
   ├─ CTA buttons (Shop Men, Shop Women, Explore)
   └─ Floating luxury stats (500+ Designers, 50K+ Customers)

3. Collections Grid
   ├─ 6 Featured Collections
   ├─ Image backgrounds
   ├─ Hover zoom effects
   └─ Deep links to collections

4. Featured Products
   ├─ Best-sellers & discounts
   ├─ 4-column grid
   ├─ Zoom on hover
   └─ Quick add to cart

5. Wedding Collection
   ├─ Large featured image
   ├─ Bridal lehenga & sherwani
   ├─ Feature cards (Bespoke, Embroidery, Fabrics)
   └─ Collection CTA

6. Festival Collection
   ├─ Festival wear products
   ├─ 3-column grid
   ├─ Sale badges
   └─ Full collection link

7. Designer Showcase
   ├─ 8 Featured designers
   ├─ Designer cards with portraits
   ├─ Story & awards
   └─ Designer profile links

8. Cinematic Banner
   ├─ Full-width image
   ├─ Luxury typography overlay
   ├─ Parallax effect
   └─ CTA button

9. Customer Testimonials
   ├─ 4 Featured reviews (4.9★)
   ├─ Glass morphism cards
   ├─ Star ratings
   └─ Social proof stats

10. Fashion Blog/Editorial
    ├─ Featured blog post (large)
    ├─ 3 additional blog cards
    ├─ Read time indicators
    └─ Blog page link

11. Instagram Gallery
    ├─ 6-grid Pinterest-style gallery
    ├─ Hover overlays with engagement stats
    ├─ Like/comment counts
    └─ Instagram follow button

12. Newsletter Section
    ├─ Email subscription form
    ├─ Gradient background
    ├─ Benefits cards
    └─ Trust statement
```

---

## Product Detail Page Layout

```
Left Side (50%):
├─ Main image (large zoomable)
├─ Thumbnail gallery (below or side)
├─ Video preview (if available)
└─ 360° view placeholder

Right Side (50%):
├─ Product title (font-playfair, 48px)
├─ Designer name
├─ Star rating & review count
├─ Pricing
│  ├─ Regular price (strikethrough if on sale)
│  └─ Sale price (gold color)
├─ Stock indicator (if <5 items)
├─ Description
├─ Fabric details
├─ Occasion tags
├─ Size selector + Size guide modal
├─ Quantity selector
├─ Add to cart button
├─ Buy now button
├─ Wishlist button
├─ Share button
├─ Delivery information
├─ Return policy
└─ Similar products section
```

---

## Animation Specifications

### Page Transitions
- Fade in: 0.8s ease
- Slide in from sides: 0.6s ease-out
- Stagger children: 0.1s delay

### Scroll Reveals
- Trigger: When 30% in viewport
- Animation: Fade + slide up (20px)
- Duration: 0.6s ease-out

### Hover Effects
- Product cards: Scale 1.02, shadow increase
- Buttons: Scale 1.05 on hover
- Images: Scale 1.1 on hover (700ms)
- Text links: Color transition 200ms

### Micro-Interactions
- Cart add: Slide + scale animation
- Wishlist toggle: Heart fill + scale
- Modal open: Scale 0.9 → 1.0 fade
- Toast notifications: Slide in from bottom

---

## Component Structure

### Navigation
- Sticky header with gradient background
- Mega menus with category icons
- Search icon with overlay
- Account/Wishlist/Cart icons with badges
- Mobile hamburger menu

### Product Card
```
┌─────────────────────┐
│   Product Image     │ (h-80, hover zoom)
│   (hover overlay)   │
├─────────────────────┤
│  Designer Name      │ (sm, muted)
│  Product Title      │ (lg, bold, max 2 lines)
│  ₹XX,XXX (Sale)     │ (accent color)
│  ₹YY,YYY (Regular)  │ (strikethrough)
│  Wishlist Icon      │ (top right)
└─────────────────────┘
```

### Size Guide Modal
- Measurement instructions (visual diagram)
- Size chart table (XS-XXL)
- Care instructions
- Returns policy

---

## Responsive Breakpoints

```
Mobile: < 768px
├─ Single column layouts
├─ Full-width sections
├─ Bottom fixed CTA
└─ Slide drawers for menus

Tablet: 768px - 1024px
├─ 2-column grids
├─ Optimized spacing
└─ Balanced layouts

Desktop: > 1024px
├─ 3-4 column grids
├─ Full premium spacing
└─ All features visible
```

---

## Interactive Features

**Hover States:**
- Product images: Scale 1.1, shadow increase
- Buttons: Scale 1.05, shadow glow
- Text links: Color change, underline
- Cards: Lift (translateY -5px), shadow

**Active States:**
- Navigation: Gold underline
- Filters: Gold background
- Sort options: Check mark

**Disabled States:**
- Out of stock: Opacity 0.5
- Size unavailable: Strikethrough
- Buttons: Opacity 0.5, cursor not-allowed

---

## Mobile-First Approach

- Mobile: 320px+ (base design)
- Tablet: 768px+ (enhanced layout)
- Desktop: 1024px+ (full premium experience)

All animations are optimized for mobile (reduced duration).

---

## Accessibility

- Semantic HTML (main, header, section, article)
- ARIA labels for interactive elements
- Keyboard navigation support
- Color contrast: AA standard
- Focus indicators visible
- Screen reader friendly
- Alt text for all images

---

## Performance Optimizations

- Image lazy loading
- Code splitting per route
- CSS classes for styling (no inline)
- Smooth 60fps animations
- Mobile-optimized assets
- TypeScript for type safety

---

## Brand Personality

**Tone:** Luxurious, elegant, sophisticated, editorial  
**Voice:** Premium, storytelling-focused, heritage-centered  
**Aesthetic:** Cinematic, royal, modern-traditional fusion  
**Feeling:** Exclusive, aspirational, premium craftsmanship

---

This design system ensures consistency across STYLEKART while delivering an ultra-premium, world-class shopping experience.
