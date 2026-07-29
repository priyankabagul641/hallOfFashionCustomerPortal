export interface CustomizationOption {
  id: string;
  label: string;
  image?: string;
  description?: string;
  priceAdd?: number;
}

export interface CustomizationStep {
  step: number;
  title: string;
  subtitle: string;
  options: CustomizationOption[];
}

export const productTypes: CustomizationOption[] = [
  { id: 'sherwani', label: 'Sherwani', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4c4e?w=300&q=80', description: 'Traditional long coat for weddings', priceAdd: 0 },
  { id: 'kurta', label: 'Kurta Set', image: 'https://images.unsplash.com/photo-1544441452-7e8cbcc9f0ea?w=300&q=80', description: 'Versatile ethnic top with bottom', priceAdd: 0 },
  { id: 'indo-western', label: 'Indo-Western', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=300&q=80', description: 'Fusion of Indian and Western styles', priceAdd: 0 },
  { id: 'nehruJacket', label: 'Nehru Jacket', image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=300&q=80', description: 'Iconic Indian jacket', priceAdd: 0 },
  { id: 'bandhgala', label: 'Bandhgala Suit', image: 'https://images.unsplash.com/photo-1617606002768-8082e0a73a5b?w=300&q=80', description: 'Formal Indian suit', priceAdd: 2000 },
];

export const fabrics: CustomizationOption[] = [
  { id: 'silk', label: 'Pure Silk', description: 'Luxurious and breathable', priceAdd: 5000, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80' },
  { id: 'cotton-silk', label: 'Cotton Silk Blend', description: 'Comfortable with sheen', priceAdd: 2500, image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=200&q=80' },
  { id: 'brocade', label: 'Brocade', description: 'Rich woven pattern fabric', priceAdd: 6000, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80' },
  { id: 'georgette', label: 'Georgette', description: 'Lightweight and elegant', priceAdd: 3000, image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=200&q=80' },
  { id: 'velvet', label: 'Velvet', description: 'Rich and opulent', priceAdd: 7000, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80' },
  { id: 'linen', label: 'Premium Linen', description: 'Casual and breathable', priceAdd: 1500, image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=200&q=80' },
];

export const neckDesigns: CustomizationOption[] = [
  { id: 'mandarin', label: 'Mandarin Collar', description: 'Classic standing collar', priceAdd: 0 },
  { id: 'nehru', label: 'Nehru Collar', description: 'Short band collar', priceAdd: 0 },
  { id: 'band', label: 'Band Collar', description: 'Minimal band neckline', priceAdd: 0 },
  { id: 'v-neck', label: 'V-Neck', description: 'Open V-shaped neckline', priceAdd: 0 },
  { id: 'round', label: 'Round Neck', description: 'Classic round neckline', priceAdd: 0 },
  { id: 'shawl', label: 'Shawl Collar', description: 'Lapel-style collar', priceAdd: 500 },
];

export const sleeveDesigns: CustomizationOption[] = [
  { id: 'full', label: 'Full Sleeves', description: 'Traditional full length', priceAdd: 0 },
  { id: 'half', label: 'Half Sleeves', description: 'Elbow length', priceAdd: 0 },
  { id: 'three-quarter', label: '3/4 Sleeves', description: 'Between elbow and wrist', priceAdd: 0 },
  { id: 'sleeveless', label: 'Sleeveless', description: 'No sleeves (waistcoat style)', priceAdd: -500 },
  { id: 'bishop', label: 'Bishop Sleeves', description: 'Flowing wide sleeves', priceAdd: 800 },
];

export const backDesigns: CustomizationOption[] = [
  { id: 'plain', label: 'Plain Back', description: 'Clean minimal back', priceAdd: 0 },
  { id: 'embroidered', label: 'Embroidered Panel', description: 'Decorative embroidery', priceAdd: 3000 },
  { id: 'buttons', label: 'Button Closure', description: 'Traditional button back', priceAdd: 200 },
  { id: 'zip', label: 'Hidden Zip', description: 'Modern concealed zip', priceAdd: 400 },
];

export const additionalFeatures: CustomizationOption[] = [
  { id: 'zardosi', label: 'Zardosi Embroidery', description: 'Gold thread embroidery', priceAdd: 4000 },
  { id: 'mirror-work', label: 'Mirror Work', description: 'Rajasthani mirror detailing', priceAdd: 2500 },
  { id: 'sequence', label: 'Sequin Work', description: 'Shimmering sequin accents', priceAdd: 2000 },
  { id: 'gota-patti', label: 'Gota Patti', description: 'Gold ribbon work', priceAdd: 3500 },
  { id: 'printed-lining', label: 'Printed Lining', description: 'Custom printed inner lining', priceAdd: 1500 },
  { id: 'monogram', label: 'Monogram', description: 'Personal monogram embroidery', priceAdd: 800 },
];

export const colors = [
  { id: 'ivory', label: 'Ivory White', hex: '#F5F0E8' },
  { id: 'gold', label: 'Royal Gold', hex: '#C8A96B' },
  { id: 'black', label: 'Matte Black', hex: '#0F0F0F' },
  { id: 'navy', label: 'Navy Blue', hex: '#1B3A6B' },
  { id: 'burgundy', label: 'Burgundy', hex: '#4B1E24' },
  { id: 'emerald', label: 'Emerald Green', hex: '#0F3B2E' },
  { id: 'maroon', label: 'Deep Maroon', hex: '#800000' },
  { id: 'teal', label: 'Teal', hex: '#1B6B7B' },
  { id: 'beige', label: 'Warm Beige', hex: '#D8C3A5' },
  { id: 'rose-gold', label: 'Rose Gold', hex: '#B76E79' },
  { id: 'charcoal', label: 'Charcoal Grey', hex: '#2C3E50' },
  { id: 'dusty-rose', label: 'Dusty Rose', hex: '#C4858F' },
];
