export interface Tailor {
  id: string;
  name: string;
  image: string;
  location: string;
  city: string;
  rating: number;
  reviews: number;
  experience: string;
  specializations: string[];
  priceRange: string;
  deliveryTime: string;
  bio: string;
  portfolio: { image: string; title: string; category: string }[];
  availability: 'Available' | 'Busy' | 'Appointment Only';
  languages: string[];
  completedOrders: number;
  badge: string;
  skills: string[];
  certifications: string[];
}

export const tailors: Tailor[] = [
  {
    id: '1',
    name: 'Masterji Ravi Shankar',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80',
    location: 'Chandni Chowk, Delhi',
    city: 'Delhi',
    rating: 4.9,
    reviews: 312,
    experience: '28 years',
    specializations: ['Sherwanis', 'Kurta Sets', 'Bespoke Suits'],
    priceRange: '₹8,000 – ₹60,000',
    deliveryTime: '7–14 days',
    bio: 'A master craftsman with 28 years of experience in bespoke Indian menswear. Known for perfectly tailored sherwanis and hand-embroidered kurtas worn at royal weddings.',
    portfolio: [
      { image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4c4e?w=400&q=80', title: 'Royal Sherwani', category: 'Wedding' },
      { image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80', title: 'Heritage Kurta Set', category: 'Festive' },
      { image: 'https://images.unsplash.com/photo-1537832816519-689ad163239b?w=400&q=80', title: 'Indo-Western Bandhgala', category: 'Formal' },
      { image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&q=80', title: 'Embroidered Nehru Jacket', category: 'Casual' },
    ],
    availability: 'Available',
    languages: ['Hindi', 'Urdu', 'English'],
    completedOrders: 1480,
    badge: 'Master Craftsman',
    skills: ['Hand Embroidery', 'Zardosi Work', 'Mirror Work', 'Bespoke Fitting'],
    certifications: ['NIFT Certified', 'Master Artisan - AIACA'],
  },
  {
    id: '2',
    name: 'Ustad Karim Ansari',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&q=80',
    location: 'Charminar Area, Hyderabad',
    city: 'Hyderabad',
    rating: 4.8,
    reviews: 241,
    experience: '22 years',
    specializations: ['Chikankari Kurtas', 'Achkans', 'Dupattas'],
    priceRange: '₹5,000 – ₹45,000',
    deliveryTime: '5–10 days',
    bio: 'Specialising in Hyderabadi royal garments, Ustad Karim brings the legacy of Nizami fashion to life. His chikankari work is renowned across India.',
    portfolio: [
      { image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80', title: 'Nizami Achkan', category: 'Royal' },
      { image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&q=80', title: 'Chikankari Kurta', category: 'Festive' },
      { image: 'https://images.unsplash.com/photo-1544441452-7e8cbcc9f0ea?w=400&q=80', title: 'Sherwani Classic', category: 'Wedding' },
      { image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&q=80', title: 'Embroidered Waistcoat', category: 'Formal' },
    ],
    availability: 'Appointment Only',
    languages: ['Urdu', 'Telugu', 'Hindi', 'English'],
    completedOrders: 960,
    badge: 'Heritage Expert',
    skills: ['Chikankari', 'Zardozi', 'Hand Printing', 'Block Printing'],
    certifications: ['Craft Council of India Member', 'UNESCO Intangible Heritage Artisan'],
  },
  {
    id: '3',
    name: 'Tailor Priya Menon',
    image: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=500&q=80',
    location: 'Koramangala, Bengaluru',
    city: 'Bengaluru',
    rating: 4.7,
    reviews: 188,
    experience: '15 years',
    specializations: ['Indo-Western', 'Blazers', 'Fusion Wear'],
    priceRange: '₹6,000 – ₹40,000',
    deliveryTime: '6–12 days',
    bio: 'A contemporary tailor bridging traditional craftsmanship with modern silhouettes. Priya is the go-to for fusion wear and Indo-western styles.',
    portfolio: [
      { image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&q=80', title: 'Fusion Blazer', category: 'Formal' },
      { image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=400&q=80', title: 'Modern Bandhgala', category: 'Wedding' },
      { image: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=400&q=80', title: 'Indo-Western Jacket', category: 'Festive' },
      { image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400&q=80', title: 'Custom Jodhpuri', category: 'Formal' },
    ],
    availability: 'Available',
    languages: ['Kannada', 'English', 'Hindi', 'Tamil'],
    completedOrders: 640,
    badge: 'Fusion Specialist',
    skills: ['Pattern Making', 'Draping', 'Fabric Sourcing', 'Custom Fitting'],
    certifications: ['NIFT Bengaluru Alumni', 'Sustainable Fashion Certified'],
  },
  {
    id: '4',
    name: 'Masterji Suresh Joshi',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&q=80',
    location: 'Johari Bazaar, Jaipur',
    city: 'Jaipur',
    rating: 4.9,
    reviews: 295,
    experience: '35 years',
    specializations: ['Rajasthani Sherwanis', 'Bandhani Kurtas', 'Royal Outfits'],
    priceRange: '₹10,000 – ₹80,000',
    deliveryTime: '10–20 days',
    bio: 'A living legend in Rajasthani fashion, Masterji Suresh has dressed royals and celebrities alike. His use of Bandhani, Leheriya, and Gota Patti is unparalleled.',
    portfolio: [
      { image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&q=80', title: 'Royal Rajasthani Sherwani', category: 'Wedding' },
      { image: 'https://images.unsplash.com/photo-1581803118522-7b72a50f7e9f?w=400&q=80', title: 'Bandhani Kurta', category: 'Festive' },
      { image: 'https://images.unsplash.com/photo-1602488610891-4e71a7b27ae1?w=400&q=80', title: 'Gota Patti Achkan', category: 'Royal' },
      { image: 'https://images.unsplash.com/photo-1617606002768-8082e0a73a5b?w=400&q=80', title: 'Heritage Nehru Jacket', category: 'Formal' },
    ],
    availability: 'Busy',
    languages: ['Rajasthani', 'Hindi', 'English'],
    completedOrders: 2100,
    badge: 'Royal Heritage Artisan',
    skills: ['Gota Patti', 'Bandhani', 'Leheriya', 'Zardosi', 'Mirror Work'],
    certifications: ['Rajasthan Craft Board Certified', 'National Award Artisan'],
  },
  {
    id: '5',
    name: 'Tailor Arjun Nair',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&q=80',
    location: 'Fort, Mumbai',
    city: 'Mumbai',
    rating: 4.6,
    reviews: 157,
    experience: '12 years',
    specializations: ['Bespoke Suits', 'Nehru Jackets', 'Corporate Wear'],
    priceRange: '₹7,000 – ₹55,000',
    deliveryTime: '5–8 days',
    bio: 'Based in Mumbai\'s fashion district, Arjun combines Mumbai\'s cosmopolitan aesthetic with Indian traditions to create stunning contemporary ethnic wear.',
    portfolio: [
      { image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&q=80', title: 'Modern Nehru Jacket', category: 'Formal' },
      { image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=400&q=80', title: 'Wedding Kurta Set', category: 'Wedding' },
      { image: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=400&q=80', title: 'Corporate Bandhgala', category: 'Formal' },
      { image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400&q=80', title: 'Festive Kurta', category: 'Festive' },
    ],
    availability: 'Available',
    languages: ['Marathi', 'Hindi', 'English', 'Malayalam'],
    completedOrders: 520,
    badge: 'Premium Tailor',
    skills: ['Bespoke Fitting', 'Italian Techniques', 'Pattern Drafting'],
    certifications: ['London School of Tailoring Alumni', 'NIFT Mumbai'],
  },
  {
    id: '6',
    name: 'Ustad Mohammed Raza',
    image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=500&q=80',
    location: 'Hazratganj, Lucknow',
    city: 'Lucknow',
    rating: 5.0,
    reviews: 98,
    experience: '40 years',
    specializations: ['Lucknowi Chikankari', 'Sherwani', 'Angarkha'],
    priceRange: '₹15,000 – ₹1,20,000',
    deliveryTime: '14–21 days',
    bio: 'Ustad Raza is the finest Chikankari artisan in Lucknow, with a lineage of 4 generations of master tailors. His work has been displayed in international fashion weeks.',
    portfolio: [
      { image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4c4e?w=400&q=80', title: 'Chikankari Sherwani', category: 'Wedding' },
      { image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80', title: 'Angarkha Set', category: 'Heritage' },
      { image: 'https://images.unsplash.com/photo-1537832816519-689ad163239b?w=400&q=80', title: 'Nawabi Achkan', category: 'Royal' },
      { image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&q=80', title: 'Heritage Kurta', category: 'Festive' },
    ],
    availability: 'Appointment Only',
    languages: ['Urdu', 'Hindi', 'English'],
    completedOrders: 3200,
    badge: 'Grand Master',
    skills: ['Chikankari', 'Mukaish Work', 'Angarkha Crafting', 'Hand Embroidery'],
    certifications: ['National Award - Craft', 'Padma Shri Nominee', 'UNESCO Artisan'],
  },
];
