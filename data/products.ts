export interface Product {
  id: string;
  name: string;
  designer: string;
  category: string;
  subcategory: string;
  price: number;
  discountPrice?: number;
  description: string;
  fabricDetails: string;
  occasion: string;
  color: string;
  colorOptions?: Array<{
    name: string;
    hex: string;
    images: string[];
  }>;
  sizes: string[];
  images: string[];
  rating: number;
  reviews: number;
  stock: number;
  deliveryTime: string;
  tags: string[];
  sku: string;
}

export const designers = [
  {
    id: "1",
    name: "House of Aryav",
    slug: "house-of-aryav",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80",
    description: "Contemporary Indian menswear blending traditional techniques with modern minimalism. Known for clean silhouettes and exquisite hand-embroidery.",
    awards: ["Vogue India Designer Award 2023", "IIFA Fashion Excellence 2022"],
    location: "New Delhi"
  },
  {
    id: "2",
    name: "Regal Loom",
    slug: "regal-loom",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&q=80",
    description: "Premium menswear combining royal heritage with contemporary aesthetics. Each garment is a statement of refined elegance.",
    awards: ["Menswear Excellence Award", "Luxury Brand of the Year"],
    location: "Hyderabad"
  },
  {
    id: "3",
    name: "Vardhan Atelier",
    slug: "vardhan-atelier",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&q=80",
    description: "Bespoke couture for the discerning gentleman. Specializes in hand-crafted fusion wear combining global influences.",
    awards: ["Couture Excellence Award 2023", "Designer's Choice"],
    location: "New Delhi"
  },
  {
    id: "4",
    name: "Aurum Legacy",
    slug: "aurum-legacy",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&q=80",
    description: "Luxury menswear celebrating India's royal heritage. Known for opulent fabrics and meticulous craftsmanship.",
    awards: ["Luxury Designer Award", "Royal Heritage Collection"],
    location: "Lucknow"
  },
  {
    id: "5",
    name: "Noor Heritage",
    slug: "noor-heritage",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&q=80",
    description: "Timeless ethnic menswear celebrating Indian textiles and craftsmanship. Specializes in sustainable luxury fashion.",
    awards: ["Sustainable Fashion Award 2023", "India Design Mark"],
    location: "Bengaluru"
  },
  {
    id: "6",
    name: "The Ivory Thread",
    slug: "ivory-thread",
    image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=500&q=80",
    description: "Heirloom groom collections with intricate embroidery and timeless designs. Pieces meant to be cherished for generations.",
    awards: ["Groom Collection of the Year", "Heritage Award"],
    location: "Jaipur"
  }
];

export const products: Product[] = [
  // MEN - SHERWANIS (5 products)
  {
    id: "M001",
    name: "Imperial Gold Sherwani",
    designer: "Regal Loom",
    category: "men",
    subcategory: "sherwanis",
    price: 55000,
    discountPrice: 46750,
    description: "Majestic cream-colored sherwani with comprehensive gold embroidery throughout. The jacket features intricate button embroidery, shoulder details, and a full-length coat with gota patti work.",
    fabricDetails: "Silk with Gold and Silver Zardozi, Gota Patti, Pearl Embroidery",
    occasion: "Wedding, Bridal, Grand Festive",
    color: "Cream",
    colorOptions: [
      {
        name: "Cream",
        hex: "#efe0b7",
        images: [
          "https://images.unsplash.com/photo-1594938328870-9623159c8c99?w=800&q=80",
          "https://images.unsplash.com/photo-1610652492500-ded49ceeb378?w=800&q=80"
        ]
      },
      {
        name: "Burgundy",
        hex: "#7a1f2e",
        images: [
          "https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          "https://images.unsplash.com/photo-1496345875659-11f7dd282d1d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        ]
      },
      {
        name: "Navy",
        hex: "#23384b",
        images: [
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80",
          "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=800&q=80"
        ]
      }
    ],
    sizes: ["36", "38", "40", "42", "44"],
    images: [
      "https://images.unsplash.com/photo-1594938328870-9623159c8c99?w=800&q=80",
      "https://images.unsplash.com/photo-1610652492500-ded49ceeb378?w=800&q=80"
    ],
    rating: 4.9,
    reviews: 42,
    stock: 10,
    deliveryTime: "7-10 business days",
    tags: ["bridal", "wedding", "luxury", "bestseller", "trending"],
    sku: "REG-SHE-001"
  },
  {
    id: "M002",
    name: "Royal Burgundy Sherwani",
    designer: "Aurum Legacy",
    category: "men",
    subcategory: "sherwanis",
    price: 62000,
    discountPrice: 52700,
    description: "Stunning burgundy sherwani exuding royal opulence. Features rich maroon silk with extensive zardozi work in gold and silver threads.",
    fabricDetails: "Pure Silk with Zardozi, Gold Thread, Kundan Work",
    occasion: "Wedding, Bridal, Festive",
    color: "Burgundy",
    sizes: ["36", "38", "40", "42", "44", "46"],
    images: [
      "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&q=80",
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80"
    ],
    rating: 4.8,
    reviews: 28,
    stock: 7,
    deliveryTime: "10-14 business days",
    tags: ["bridal", "luxury", "royal", "trending"],
    sku: "AUR-SHE-002"
  },
  {
    id: "M003",
    name: "Minimalist Ivory Sherwani",
    designer: "House of Aryav",
    category: "men",
    subcategory: "sherwanis",
    price: 48000,
    discountPrice: 40800,
    description: "Contemporary ivory sherwani for the modern groom with refined tastes. Features subtle embroidery work focusing on clean lines and elegant minimalism.",
    fabricDetails: "Pure Silk with Delicate Thread Embroidery",
    occasion: "Wedding, Celebration, Formal",
    color: "Ivory",
    sizes: ["36", "38", "40", "42", "44"],
    images: [
      "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&q=80",
      "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800&q=80"
    ],
    rating: 4.7,
    reviews: 21,
    stock: 9,
    deliveryTime: "7-10 business days",
    tags: ["contemporary", "minimal", "wedding"],
    sku: "ARY-SHE-003"
  },
  {
    id: "M004",
    name: "Classic White Sherwani",
    designer: "Regal Loom",
    category: "men",
    subcategory: "sherwanis",
    price: 52000,
    discountPrice: 44200,
    description: "Elegant white sherwani with subtle gold button embroidery. Features a timeless design perfect for weddings and formal celebrations.",
    fabricDetails: "Pure Silk with Gold Thread Embroidery",
    occasion: "Wedding, Formal, Celebration",
    color: "White",
    sizes: ["36", "38", "40", "42", "44"],
    images: [
      "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&q=80",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80"
    ],
    rating: 4.8,
    reviews: 45,
    stock: 9,
    deliveryTime: "7-10 business days",
    tags: ["sherwani", "wedding", "luxury", "bestseller"],
    sku: "REG-SHE-004"
  },
  {
    id: "M005",
    name: "Navy Blue Royal Sherwani",
    designer: "The Ivory Thread",
    category: "men",
    subcategory: "sherwanis",
    price: 58000,
    discountPrice: 49300,
    description: "Distinguished navy blue sherwani with silver embroidery accents. A regal choice for the modern groom who appreciates classic elegance.",
    fabricDetails: "Premium Silk with Silver Thread Embroidery",
    occasion: "Wedding, Reception, Grand Festive",
    color: "Navy Blue",
    sizes: ["36", "38", "40", "42", "44", "46"],
    images: [
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=80",
      "https://images.unsplash.com/photo-1507680434567-5739c80be1ac?w=800&q=80"
    ],
    rating: 4.9,
    reviews: 33,
    stock: 6,
    deliveryTime: "10-14 business days",
    tags: ["wedding", "luxury", "royal", "trending"],
    sku: "IVY-SHE-005"
  },

  // MEN - KURTAS (8 products)
  {
    id: "M006",
    name: "Premium Black Silk Kurta",
    designer: "Noor Heritage",
    category: "men",
    subcategory: "kurtas",
    price: 18000,
    discountPrice: 15300,
    description: "Sophisticated black silk kurta with subtle embroidery on the chest and sleeves. Crafted from sustainable silk with traditional hand-woven patterns.",
    fabricDetails: "Pure Silk with Hand-Woven Embroidery",
    occasion: "Festive, Casual Luxury, Celebration",
    color: "Black",
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80"
    ],
    rating: 4.8,
    reviews: 67,
    stock: 25,
    deliveryTime: "3-5 business days",
    tags: ["kurta", "sustainable", "luxury", "festive", "trending"],
    sku: "NOO-KUR-001"
  },
  {
    id: "M007",
    name: "Festive Golden Yellow Kurta",
    designer: "House of Aryav",
    category: "men",
    subcategory: "kurtas",
    price: 22000,
    discountPrice: 18700,
    description: "Radiant golden yellow kurta with intricate floral embroidery work. Perfect for Diwali, Holi, and other festive celebrations.",
    fabricDetails: "Cotton Silk Blend with Traditional Embroidery",
    occasion: "Festive, Celebration, Casual",
    color: "Golden Yellow",
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1610652492500-ded49ceeb378?w=800&q=80",
      "https://images.unsplash.com/photo-1594938328870-9623159c8c99?w=800&q=80"
    ],
    rating: 4.6,
    reviews: 54,
    stock: 20,
    deliveryTime: "3-5 business days",
    tags: ["festive", "diwali", "casual", "trending"],
    sku: "ARY-KUR-002"
  },
  {
    id: "M008",
    name: "Elegant Beige Kurta Set",
    designer: "Vardhan Atelier",
    category: "men",
    subcategory: "kurtas",
    price: 24000,
    discountPrice: 20400,
    description: "Classic beige kurta set with matching churidar and dupatta. Features subtle thread embroidery and premium fabric.",
    fabricDetails: "Premium Cotton Silk with Thread Embroidery",
    occasion: "Festive, Family, Celebration",
    color: "Beige",
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&q=80",
      "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800&q=80"
    ],
    rating: 4.7,
    reviews: 41,
    stock: 18,
    deliveryTime: "3-5 business days",
    tags: ["festive", "casual", "elegant"],
    sku: "VAR-KUR-003"
  },
  {
    id: "M009",
    name: "Royal Blue Silk Kurta",
    designer: "Aurum Legacy",
    category: "men",
    subcategory: "kurtas",
    price: 26000,
    description: "Stunning royal blue silk kurta with intricate gold embroidery on the neckline and cuffs. A statement piece for the connoisseur.",
    fabricDetails: "Pure Silk with Gold Thread Embroidery",
    occasion: "Festive, Wedding Guest, Celebration",
    color: "Royal Blue",
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=80",
      "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&q=80"
    ],
    rating: 4.8,
    reviews: 29,
    stock: 15,
    deliveryTime: "5-7 business days",
    tags: ["luxury", "festive", "royal"],
    sku: "AUR-KUR-004"
  },
  {
    id: "M010",
    name: "Maroon Embroidered Kurta",
    designer: "Regal Loom",
    category: "men",
    subcategory: "kurtas",
    price: 20000,
    discountPrice: 17000,
    description: "Rich maroon kurta with traditional embroidery patterns. Features a comfortable fit with premium fabric quality.",
    fabricDetails: "Cotton Silk with Traditional Embroidery",
    occasion: "Festive, Puja, Family",
    color: "Maroon",
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&q=80",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80"
    ],
    rating: 4.6,
    reviews: 38,
    stock: 22,
    deliveryTime: "3-5 business days",
    tags: ["festive", "traditional", "casual"],
    sku: "REG-KUR-005"
  },
  {
    id: "M011",
    name: "White Chikankari Kurta",
    designer: "Noor Heritage",
    category: "men",
    subcategory: "kurtas",
    price: 16000,
    discountPrice: 13600,
    description: "Elegant white kurta with traditional Lucknowi chikankari embroidery. Light and breathable, perfect for summer celebrations.",
    fabricDetails: "Pure Cotton with Chikankari Embroidery",
    occasion: "Casual, Summer, Festive",
    color: "White",
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&q=80",
      "https://images.unsplash.com/photo-1507680434567-5739c80be1ac?w=800&q=80"
    ],
    rating: 4.7,
    reviews: 52,
    stock: 30,
    deliveryTime: "3-5 business days",
    tags: ["chikankari", "summer", "casual", "bestseller"],
    sku: "NOO-KUR-006"
  },
  {
    id: "M012",
    name: "Olive Green Pathani Kurta",
    designer: "House of Aryav",
    category: "men",
    subcategory: "kurtas",
    price: 14000,
    description: "Contemporary olive green pathani kurta with minimalist design. Features a relaxed fit perfect for casual occasions.",
    fabricDetails: "Premium Cotton with Contrast Stitching",
    occasion: "Casual, Everyday, Gatherings",
    color: "Olive Green",
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80",
      "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800&q=80"
    ],
    rating: 4.5,
    reviews: 35,
    stock: 28,
    deliveryTime: "3-5 business days",
    tags: ["casual", "everyday", "comfortable"],
    sku: "ARY-KUR-007"
  },
  {
    id: "M013",
    name: "Pink Festive Kurta",
    designer: "The Ivory Thread",
    category: "men",
    subcategory: "kurtas",
    price: 19000,
    discountPrice: 16150,
    description: "Vibrant pink kurta for the bold fashionista. Features delicate embroidery and a contemporary cut.",
    fabricDetails: "Silk Blend with Thread Embroidery",
    occasion: "Holi, Festive, Celebration",
    color: "Pink",
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1610652492500-ded49ceeb378?w=800&q=80",
      "https://images.unsplash.com/photo-1594938328870-9623159c8c99?w=800&q=80"
    ],
    rating: 4.6,
    reviews: 27,
    stock: 16,
    deliveryTime: "3-5 business days",
    tags: ["festive", "holi", "vibrant", "trending"],
    sku: "IVY-KUR-008"
  },

  // MEN - INDO-WESTERN (6 products)
  {
    id: "M014",
    name: "Black Nehru Jacket",
    designer: "Regal Loom",
    category: "men",
    subcategory: "indo-western",
    price: 35000,
    discountPrice: 29750,
    description: "Modern black Nehru jacket combining traditional Indian silhouette with contemporary styling. Features subtle gold embroidery on the placket.",
    fabricDetails: "Pure Wool with Silk Lining and Thread Embroidery",
    occasion: "Cocktail, Formal, Upscale Casual",
    color: "Black",
    sizes: ["36", "38", "40", "42", "44"],
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=80"
    ],
    rating: 4.7,
    reviews: 29,
    stock: 12,
    deliveryTime: "5-7 business days",
    tags: ["indo-western", "formal", "luxury", "trending"],
    sku: "REG-JCK-001"
  },
  {
    id: "M015",
    name: "Navy Indo-Western Bandhgala",
    designer: "House of Aryav",
    category: "men",
    subcategory: "indo-western",
    price: 42000,
    discountPrice: 35700,
    description: "Sophisticated navy blue bandhgala suit with contemporary cut. Features a mandarin collar and subtle embroidery.",
    fabricDetails: "Premium Wool Blend with Silk Detailing",
    occasion: "Cocktail, Reception, Formal",
    color: "Navy Blue",
    sizes: ["36", "38", "40", "42", "44", "46"],
    images: [
      "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&q=80",
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=80"
    ],
    rating: 4.8,
    reviews: 24,
    stock: 8,
    deliveryTime: "7-10 business days",
    tags: ["indo-western", "bandhgala", "formal"],
    sku: "ARY-JCK-002"
  },
  {
    id: "M016",
    name: "Grey Velvet Jodhpuri Suit",
    designer: "Aurum Legacy",
    category: "men",
    subcategory: "indo-western",
    price: 48000,
    discountPrice: 40800,
    description: "Luxurious grey velvet jodhpuri suit with intricate gold buttons and embroidery. A royal choice for winter weddings.",
    fabricDetails: "Premium Velvet with Gold Embellishments",
    occasion: "Wedding, Reception, Grand Festive",
    color: "Grey",
    sizes: ["36", "38", "40", "42", "44"],
    images: [
      "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&q=80",
      "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800&q=80"
    ],
    rating: 4.9,
    reviews: 18,
    stock: 5,
    deliveryTime: "10-14 business days",
    tags: ["jodhpuri", "luxury", "wedding", "bestseller"],
    sku: "AUR-JCK-003"
  },
  {
    id: "M017",
    name: "Maroon Achkan Suit",
    designer: "Vardhan Atelier",
    category: "men",
    subcategory: "indo-western",
    price: 38000,
    description: "Elegant maroon achkan with gold embroidery details. Perfect blend of traditional and modern aesthetics.",
    fabricDetails: "Silk Blend with Gold Thread Work",
    occasion: "Wedding, Reception, Formal",
    color: "Maroon",
    sizes: ["36", "38", "40", "42", "44"],
    images: [
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80",
      "https://images.unsplash.com/photo-1594938328870-9623159c8c99?w=800&q=80"
    ],
    rating: 4.7,
    reviews: 22,
    stock: 10,
    deliveryTime: "7-10 business days",
    tags: ["achkan", "wedding", "formal"],
    sku: "VAR-JCK-004"
  },
  {
    id: "M018",
    name: "Ivory Fusion Jacket",
    designer: "Noor Heritage",
    category: "men",
    subcategory: "indo-western",
    price: 32000,
    discountPrice: 27200,
    description: "Contemporary ivory fusion jacket that pairs well with both Indian and western attire. Features minimalist embroidery.",
    fabricDetails: "Premium Linen Blend with Subtle Embroidery",
    occasion: "Casual, Cocktail, Day Events",
    color: "Ivory",
    sizes: ["36", "38", "40", "42", "44"],
    images: [
      "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&q=80",
      "https://images.unsplash.com/photo-1507680434567-5739c80be1ac?w=800&q=80"
    ],
    rating: 4.6,
    reviews: 31,
    stock: 14,
    deliveryTime: "5-7 business days",
    tags: ["fusion", "casual", "versatile"],
    sku: "NOO-JCK-005"
  },
  {
    id: "M019",
    name: "Teal Green Bandhgala",
    designer: "The Ivory Thread",
    category: "men",
    subcategory: "indo-western",
    price: 44000,
    discountPrice: 37400,
    description: "Striking teal green bandhgala with contemporary design. Features unique collar detailing and premium construction.",
    fabricDetails: "Premium Wool with Silk Lining",
    occasion: "Reception, Cocktail, Formal",
    color: "Teal Green",
    sizes: ["36", "38", "40", "42", "44", "46"],
    images: [
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=80",
      "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&q=80"
    ],
    rating: 4.8,
    reviews: 19,
    stock: 7,
    deliveryTime: "7-10 business days",
    tags: ["bandhgala", "formal", "trending"],
    sku: "IVY-JCK-006"
  },

  // MEN - BLAZERS & SUITS (5 products)
  {
    id: "M020",
    name: "Classic Navy Blazer",
    designer: "Vardhan Atelier",
    category: "men",
    subcategory: "blazers",
    price: 32000,
    description: "Timeless navy blazer with premium construction and perfect fit. Features gold buttons and subtle inner detailing.",
    fabricDetails: "Premium Wool with Silk Lining",
    occasion: "Formal, Business, Casual",
    color: "Navy Blue",
    sizes: ["36", "38", "40", "42", "44", "46"],
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=80"
    ],
    rating: 4.7,
    reviews: 52,
    stock: 20,
    deliveryTime: "5-7 business days",
    tags: ["blazer", "formal", "classic"],
    sku: "VAR-BLZ-001"
  },
  {
    id: "M021",
    name: "Black Tuxedo Blazer",
    designer: "Regal Loom",
    category: "men",
    subcategory: "blazers",
    price: 45000,
    discountPrice: 38250,
    description: "Elegant black tuxedo blazer with satin lapels. Perfect for black-tie events, galas, and formal celebrations.",
    fabricDetails: "Premium Wool with Satin Lapels",
    occasion: "Black Tie, Gala, Formal",
    color: "Black",
    sizes: ["36", "38", "40", "42", "44"],
    images: [
      "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&q=80",
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=80"
    ],
    rating: 4.9,
    reviews: 31,
    stock: 10,
    deliveryTime: "7-10 business days",
    tags: ["tuxedo", "formal", "luxury", "bestseller"],
    sku: "REG-BLZ-002"
  },
  {
    id: "M022",
    name: "Charcoal Grey Two-Piece Suit",
    designer: "House of Aryav",
    category: "men",
    subcategory: "blazers",
    price: 55000,
    discountPrice: 46750,
    description: "Sophisticated charcoal grey suit with modern slim fit. Includes matching trousers with premium construction.",
    fabricDetails: "Italian Wool Blend with Premium Lining",
    occasion: "Business, Formal, Wedding Guest",
    color: "Charcoal Grey",
    sizes: ["36", "38", "40", "42", "44", "46"],
    images: [
      "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&q=80",
      "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&q=80"
    ],
    rating: 4.8,
    reviews: 28,
    stock: 12,
    deliveryTime: "7-10 business days",
    tags: ["suit", "formal", "business", "premium"],
    sku: "ARY-SUT-003"
  },
  {
    id: "M023",
    name: "Burgundy Velvet Blazer",
    designer: "Aurum Legacy",
    category: "men",
    subcategory: "blazers",
    price: 38000,
    description: "Luxurious burgundy velvet blazer for special occasions. Features unique texture and premium finish.",
    fabricDetails: "Premium Velvet with Silk Lining",
    occasion: "Party, Reception, Evening",
    color: "Burgundy",
    sizes: ["36", "38", "40", "42", "44"],
    images: [
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80",
      "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800&q=80"
    ],
    rating: 4.7,
    reviews: 24,
    stock: 8,
    deliveryTime: "5-7 business days",
    tags: ["velvet", "party", "luxury"],
    sku: "AUR-BLZ-004"
  },
  {
    id: "M024",
    name: "Light Grey Summer Blazer",
    designer: "Noor Heritage",
    category: "men",
    subcategory: "blazers",
    price: 28000,
    discountPrice: 23800,
    description: "Lightweight summer blazer in elegant light grey. Perfect for daytime events and casual business meetings.",
    fabricDetails: "Linen Wool Blend",
    occasion: "Summer, Casual, Business Casual",
    color: "Light Grey",
    sizes: ["36", "38", "40", "42", "44", "46"],
    images: [
      "https://images.unsplash.com/photo-1507680434567-5739c80be1ac?w=800&q=80",
      "https://images.unsplash.com/photo-1594938328870-9623159c8c99?w=800&q=80"
    ],
    rating: 4.6,
    reviews: 36,
    stock: 18,
    deliveryTime: "5-7 business days",
    tags: ["summer", "casual", "lightweight"],
    sku: "NOO-BLZ-005"
  },

  // MEN - WAISTCOATS (4 products)
  {
    id: "M025",
    name: "Gold Embroidered Waistcoat",
    designer: "The Ivory Thread",
    category: "men",
    subcategory: "waistcoats",
    price: 22000,
    discountPrice: 18700,
    description: "Stunning gold embroidered waistcoat perfect for layering over kurtas or sherwanis. Features intricate zardozi work.",
    fabricDetails: "Silk with Zardozi Embroidery",
    occasion: "Wedding, Festive, Reception",
    color: "Gold",
    sizes: ["36", "38", "40", "42", "44"],
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
      "https://images.unsplash.com/photo-1610652492500-ded49ceeb378?w=800&q=80"
    ],
    rating: 4.7,
    reviews: 27,
    stock: 14,
    deliveryTime: "5-7 business days",
    tags: ["waistcoat", "wedding", "festive"],
    sku: "IVY-WST-001"
  },
  {
    id: "M026",
    name: "Velvet Burgundy Waistcoat",
    designer: "Aurum Legacy",
    category: "men",
    subcategory: "waistcoats",
    price: 25000,
    description: "Luxurious burgundy velvet waistcoat with subtle embroidery. Perfect for winter celebrations and formal events.",
    fabricDetails: "Premium Velvet with Thread Embroidery",
    occasion: "Wedding, Formal, Winter Festive",
    color: "Burgundy",
    sizes: ["36", "38", "40", "42", "44"],
    images: [
      "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&q=80",
      "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&q=80"
    ],
    rating: 4.8,
    reviews: 19,
    stock: 11,
    deliveryTime: "5-7 business days",
    tags: ["waistcoat", "velvet", "luxury"],
    sku: "AUR-WST-002"
  },
  {
    id: "M027",
    name: "Black Classic Waistcoat",
    designer: "Regal Loom",
    category: "men",
    subcategory: "waistcoats",
    price: 18000,
    discountPrice: 15300,
    description: "Classic black waistcoat that pairs perfectly with any formal outfit. Features premium construction and timeless design.",
    fabricDetails: "Premium Wool Blend",
    occasion: "Formal, Business, Wedding",
    color: "Black",
    sizes: ["36", "38", "40", "42", "44", "46"],
    images: [
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"
    ],
    rating: 4.6,
    reviews: 42,
    stock: 25,
    deliveryTime: "3-5 business days",
    tags: ["classic", "formal", "versatile"],
    sku: "REG-WST-003"
  },
  {
    id: "M028",
    name: "Navy Brocade Waistcoat",
    designer: "Vardhan Atelier",
    category: "men",
    subcategory: "waistcoats",
    price: 20000,
    description: "Elegant navy brocade waistcoat with traditional patterns. Perfect for adding a royal touch to any ensemble.",
    fabricDetails: "Silk Brocade with Gold Weave",
    occasion: "Festive, Wedding, Reception",
    color: "Navy Blue",
    sizes: ["36", "38", "40", "42", "44"],
    images: [
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=80",
      "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&q=80"
    ],
    rating: 4.7,
    reviews: 23,
    stock: 16,
    deliveryTime: "5-7 business days",
    tags: ["brocade", "traditional", "elegant"],
    sku: "VAR-WST-004"
  },

  // ACCESSORIES (7 products)
  {
    id: "ACC001",
    name: "Heritage Silk Stole",
    designer: "Regal Loom",
    category: "accessories",
    subcategory: "stoles",
    price: 12000,
    description: "Exquisite silk stole with intricate zardozi embroidery along the borders. Perfect companion to any sherwani or kurta.",
    fabricDetails: "Pure Silk with Zardozi Embroidery",
    occasion: "Wedding, Festive, Celebration",
    color: "Gold",
    sizes: ["One Size"],
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80"
    ],
    rating: 4.8,
    reviews: 41,
    stock: 15,
    deliveryTime: "2-4 business days",
    tags: ["accessory", "luxury", "wedding"],
    sku: "REG-STO-001"
  },
  {
    id: "ACC002",
    name: "Premium Leather Mojaris",
    designer: "Regal Loom",
    category: "accessories",
    subcategory: "mojaris",
    price: 8500,
    description: "Handcrafted leather mojaris with intricate embroidery and ornamental work. Perfect to complete any ethnic look.",
    fabricDetails: "Premium Leather with Gold Thread Embellishments",
    occasion: "Festive, Wedding, Casual",
    color: "Brown",
    sizes: ["6", "7", "8", "9", "10", "11"],
    images: [
      "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&q=80"
    ],
    rating: 4.7,
    reviews: 35,
    stock: 18,
    deliveryTime: "3-5 business days",
    tags: ["footwear", "handcrafted", "luxury"],
    sku: "REG-MOJ-001"
  },
  {
    id: "ACC003",
    name: "Luxury Heritage Watch",
    designer: "Aurum Legacy",
    category: "accessories",
    subcategory: "watches",
    price: 45000,
    description: "Exquisite luxury timepiece combining traditional Indian design with Swiss precision. A statement piece for the connoisseur.",
    fabricDetails: "18K Gold Plated Case, Swiss Movement",
    occasion: "Formal, Wedding, Everyday Luxury",
    color: "Gold",
    sizes: ["One Size"],
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"
    ],
    rating: 4.9,
    reviews: 12,
    stock: 5,
    deliveryTime: "5-7 business days",
    tags: ["luxury", "accessory", "timepiece"],
    sku: "AUR-WTC-001"
  },
  {
    id: "ACC004",
    name: "Embroidered Pocket Square Set",
    designer: "House of Aryav",
    category: "accessories",
    subcategory: "pocket-squares",
    price: 4500,
    description: "Set of 3 premium silk pocket squares with subtle embroidery. Each piece features unique traditional motifs.",
    fabricDetails: "Pure Silk with Hand Embroidery",
    occasion: "Formal, Wedding, Business",
    color: "Assorted",
    sizes: ["One Size"],
    images: [
      "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&q=80"
    ],
    rating: 4.6,
    reviews: 23,
    stock: 30,
    deliveryTime: "2-4 business days",
    tags: ["accessory", "formal", "silk"],
    sku: "ARY-PSQ-001"
  },
  {
    id: "ACC005",
    name: "Royal Brooch Collection",
    designer: "The Ivory Thread",
    category: "accessories",
    subcategory: "brooches",
    price: 8000,
    description: "Exquisite brooch set featuring traditional Indian motifs. Perfect for adorning sherwanis and blazers.",
    fabricDetails: "Gold Plated with Kundan and Pearl",
    occasion: "Wedding, Festive, Formal",
    color: "Gold",
    sizes: ["One Size"],
    images: [
      "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&q=80"
    ],
    rating: 4.8,
    reviews: 15,
    stock: 20,
    deliveryTime: "3-5 business days",
    tags: ["accessory", "wedding", "brooch"],
    sku: "IVY-BRO-001"
  },
  {
    id: "ACC006",
    name: "Premium Leather Belt",
    designer: "Vardhan Atelier",
    category: "accessories",
    subcategory: "belts",
    price: 6500,
    description: "Handcrafted premium leather belt with ornate buckle design. A perfect blend of style and functionality.",
    fabricDetails: "Genuine Leather with Metal Buckle",
    occasion: "Formal, Casual, Business",
    color: "Brown",
    sizes: ["32", "34", "36", "38", "40"],
    images: [
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=80"
    ],
    rating: 4.7,
    reviews: 42,
    stock: 25,
    deliveryTime: "2-4 business days",
    tags: ["accessory", "leather", "formal"],
    sku: "VAR-BLT-001"
  },
  {
    id: "ACC007",
    name: "Designer Cufflinks Set",
    designer: "Aurum Legacy",
    category: "accessories",
    subcategory: "cufflinks",
    price: 9500,
    description: "Elegant cufflinks set featuring traditional Indian motifs. Crafted with precision and premium materials.",
    fabricDetails: "18K Gold Plated with Enamel",
    occasion: "Formal, Wedding, Business",
    color: "Gold",
    sizes: ["One Size"],
    images: [
      "https://images.unsplash.com/photo-1507680434567-5739c80be1ac?w=800&q=80"
    ],
    rating: 4.8,
    reviews: 18,
    stock: 22,
    deliveryTime: "3-5 business days",
    tags: ["accessory", "luxury", "formal"],
    sku: "AUR-CUF-001"
  }
];

export const categories = [
  { id: "men", label: "Men", count: 300 },
  { id: "accessories", label: "Accessories", count: 50 }
];

export const subcategories = {
  men: [
    { id: "sherwanis", label: "Sherwanis" },
    { id: "kurtas", label: "Kurtas" },
    { id: "indo-western", label: "Indo-Western" },
    { id: "blazers", label: "Blazers & Suits" },
    { id: "waistcoats", label: "Waistcoats" }
  ],
  accessories: [
    { id: "stoles", label: "Stoles" },
    { id: "mojaris", label: "Mojaris" },
    { id: "watches", label: "Watches" },
    { id: "pocket-squares", label: "Pocket Squares" },
    { id: "brooches", label: "Brooches" },
    { id: "belts", label: "Belts" },
    { id: "cufflinks", label: "Cufflinks" }
  ]
};

export const reviews = [
  {
    id: "1",
    productId: "M001",
    userName: "Rajesh Verma",
    userImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    rating: 5,
    title: "Perfect Wedding Attire",
    comment: "The sherwani fit perfectly and the embroidery work is beyond expectations. Worth every penny!",
    verified: true,
    helpful: 38
  },
  {
    id: "2",
    productId: "M002",
    userName: "Aditya Patel",
    userImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
    rating: 5,
    title: "Absolutely Stunning!",
    comment: "The craftsmanship is exceptional. Every detail is perfect. I received so many compliments at my wedding!",
    verified: true,
    helpful: 45
  },
  {
    id: "3",
    productId: "M006",
    userName: "Vikram Singh",
    userImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
    rating: 5,
    title: "Excellent Quality Kurta",
    comment: "The silk quality is outstanding and the fit is perfect. Great for festive occasions.",
    verified: true,
    helpful: 32
  }
];

export const testimonials = [
  {
    id: "1",
    name: "Rajesh Verma",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    text: "Hall of Fashion made my wedding dreams come true. The sherwani quality and attention to detail is unmatched.",
    rating: 5,
    occasion: "Groom, 2024"
  },
  {
    id: "2",
    name: "Aditya Patel",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
    text: "The Indo-Western collection is exceptional. Perfect blend of tradition and modernity.",
    rating: 5,
    occasion: "Customer, 2024"
  },
  {
    id: "3",
    name: "Vikram Singh",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    text: "Beautiful collection and exceptional customer service. The kurta fit perfectly!",
    rating: 5,
    occasion: "Customer, 2024"
  },
  {
    id: "4",
    name: "Arjun Malhotra",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80",
    text: "Wore the burgundy sherwani for my wedding. Felt like royalty! The craftsmanship is impeccable.",
    rating: 5,
    occasion: "Groom, 2024"
  },
  {
    id: "5",
    name: "Karan Mehta",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80",
    text: "The entire shopping experience was seamless. From selection to delivery, everything was perfect!",
    rating: 5,
    occasion: "Customer, 2024"
  },
  {
    id: "6",
    name: "Rohit Sharma",
    image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&q=80",
    text: "The Nehru jacket collection is outstanding. Perfect for formal occasions and parties.",
    rating: 5,
    occasion: "Customer, 2024"
  },
  {
    id: "7",
    name: "Deepak Chauhan",
    image: "https://images.unsplash.com/photo-1507680434567-5739c80be1ac?w=200&q=80",
    text: "Got compliments all night at the reception! The blazer fit perfectly and the quality is top-notch.",
    rating: 5,
    occasion: "Customer, 2024"
  }
];

export const blogPosts = [
  {
    id: "1",
    title: "Wedding Season Style Guide: Men's Ethnic Wear Trends 2024",
    excerpt: "Discover the latest trends in Indian menswear for weddings. From sherwani styles to color palettes.",
    image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&q=80",
    author: "Fashion Editor",
    date: "Dec 15, 2024",
    readTime: "5 min"
  },
  {
    id: "2",
    title: "The Art of Zardozi: Understanding Luxury Embroidery",
    excerpt: "Explore the intricate art of zardozi embroidery and its significance in Indian menswear couture.",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
    author: "Heritage Expert",
    date: "Dec 10, 2024",
    readTime: "7 min"
  },
  {
    id: "3",
    title: "Indo-Western Fashion: The Modern Gentleman's Guide",
    excerpt: "How to style Indo-Western outfits for various occasions from casual to formal.",
    image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&q=80",
    author: "Style Columnist",
    date: "Dec 5, 2024",
    readTime: "6 min"
  },
  {
    id: "4",
    title: "Designer Spotlight: Masters of Men's Couture",
    excerpt: "Meet the visionary designers transforming the Indian menswear landscape with their artistry.",
    image: "https://images.unsplash.com/photo-1610652492500-ded49ceeb378?w=800&q=80",
    author: "Fashion Journalist",
    date: "Nov 28, 2024",
    readTime: "8 min"
  }
];

export const faqItems = [
  {
    id: "1",
    question: "What is the delivery timeline?",
    answer: "Delivery typically takes 5-10 business days for in-stock items. Custom orders may take 2-4 weeks depending on complexity."
  },
  {
    id: "2",
    question: "Do you offer customization services?",
    answer: "Yes! We offer bespoke tailoring and customization for all our menswear. Please contact our team for details."
  },
  {
    id: "3",
    question: "What is your return policy?",
    answer: "We offer 30 days return policy for unused items in original packaging. Custom pieces are non-returnable."
  },
  {
    id: "4",
    question: "How do I care for my designer wear?",
    answer: "Each piece comes with detailed care instructions. Generally, dry cleaning is recommended for embroidered items."
  },
  {
    id: "5",
    question: "Do you ship internationally?",
    answer: "Yes, we ship to select countries. Please check our shipping policy or contact customer service."
  }
];
