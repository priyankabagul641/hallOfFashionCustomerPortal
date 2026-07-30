// Mock content with no backend-public endpoint yet (designers, static
// category taxonomy, reviews, testimonials, blog posts, FAQs).
// ponytail: stays mocked until backend exposes public endpoints for these.

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
