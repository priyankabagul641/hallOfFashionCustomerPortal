export interface OrderItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
  size: string;
  designer: string;
  customized: boolean;
  measurementProfileId?: string;
  measurementProfileName?: string;
  measurementType?: 'shirt' | 'pant' | 'combined';
  measurementUnit?: 'in' | 'cm';
  measurementSnapshot?: Partial<Record<string, number>>;
}

export interface TrackingEvent {
  date: string;
  time: string;
  status: string;
  description: string;
  completed: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'Processing' | 'Confirmed' | 'In Tailoring' | 'Quality Check' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled' | 'Returned';
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  trackingNumber?: string;
  estimatedDelivery: string;
  tracking: TrackingEvent[];
  measurementProfile?: {
    height: number;
    weight: number;
    chest: number;
    waist: number;
    hips: number;
    inseam: number;
  };
}

export const orders: Order[] = [
  {
    id: 'ORD001',
    orderNumber: 'HOF-2024-001',
    date: '2024-12-10',
    status: 'Delivered',
    items: [
      {
        id: 'p1',
        name: 'Imperial Gold Sherwani',
        image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4c4e?w=400&q=80',
        quantity: 1,
        price: 48000,
        size: 'M',
        designer: 'House of Aryav',
        customized: true,
      },
    ],
    subtotal: 48000,
    discount: 4800,
    shipping: 0,
    total: 43200,
    paymentMethod: 'Credit Card (HDFC)',
    paymentStatus: 'Paid',
    shippingAddress: {
      name: 'Rahul Sharma',
      address: '42, Park View Apartments, MG Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560001',
      phone: '+91 98765 43210',
    },
    trackingNumber: 'BLUEDART7892341',
    estimatedDelivery: '2024-12-22',
    tracking: [
      { date: 'Dec 10, 2024', time: '02:30 PM', status: 'Order Placed', description: 'Your order has been placed successfully.', completed: true },
      { date: 'Dec 11, 2024', time: '10:00 AM', status: 'Confirmed', description: 'Order confirmed by House of Aryav.', completed: true },
      { date: 'Dec 11, 2024', time: '03:00 PM', status: 'In Tailoring', description: 'Your custom sherwani is being crafted by expert tailors.', completed: true },
      { date: 'Dec 17, 2024', time: '11:00 AM', status: 'Quality Check', description: 'Garment passed quality inspection.', completed: true },
      { date: 'Dec 18, 2024', time: '09:00 AM', status: 'Shipped', description: 'Dispatched via BlueDart. Tracking: BLUEDART7892341', completed: true },
      { date: 'Dec 20, 2024', time: '08:00 AM', status: 'Out for Delivery', description: 'Your package is out for delivery today.', completed: true },
      { date: 'Dec 20, 2024', time: '02:15 PM', status: 'Delivered', description: 'Package delivered. Signed by Rahul Sharma.', completed: true },
    ],
  },
  {
    id: 'ORD002',
    orderNumber: 'HOF-2025-042',
    date: '2025-01-15',
    status: 'In Tailoring',
    items: [
      {
        id: 'p2',
        name: 'Royal Blue Indo-Western Set',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80',
        quantity: 1,
        price: 32000,
        size: 'L',
        designer: 'Regal Loom',
        customized: true,
      },
      {
        id: 'p3',
        name: 'Heritage Silk Stole',
        image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&q=80',
        quantity: 1,
        price: 4500,
        size: 'Free Size',
        designer: 'Noor Heritage',
        customized: false,
      },
    ],
    subtotal: 36500,
    discount: 3000,
    shipping: 0,
    total: 33500,
    paymentMethod: 'UPI (GPay)',
    paymentStatus: 'Paid',
    shippingAddress: {
      name: 'Rahul Sharma',
      address: '42, Park View Apartments, MG Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560001',
      phone: '+91 98765 43210',
    },
    estimatedDelivery: '2025-01-28',
    tracking: [
      { date: 'Jan 15, 2025', time: '04:45 PM', status: 'Order Placed', description: 'Your order has been placed successfully.', completed: true },
      { date: 'Jan 16, 2025', time: '09:00 AM', status: 'Confirmed', description: 'Order confirmed by Regal Loom.', completed: true },
      { date: 'Jan 16, 2025', time: '02:00 PM', status: 'In Tailoring', description: 'Your custom outfit is being crafted. Est. 7–10 days.', completed: true },
      { date: '', time: '', status: 'Quality Check', description: 'Garment will undergo quality inspection.', completed: false },
      { date: '', time: '', status: 'Shipped', description: 'Will be dispatched after quality check.', completed: false },
      { date: '', time: '', status: 'Delivered', description: 'Expected delivery: Jan 28, 2025.', completed: false },
    ],
  },
  {
    id: 'ORD003',
    orderNumber: 'HOF-2025-089',
    date: '2025-02-01',
    status: 'Shipped',
    items: [
      {
        id: 'p4',
        name: 'Black Silk Kurta Set',
        image: 'https://images.unsplash.com/photo-1544441452-7e8cbcc9f0ea?w=400&q=80',
        quantity: 1,
        price: 18500,
        size: 'M',
        designer: 'Vardhan Atelier',
        customized: false,
      },
    ],
    subtotal: 18500,
    discount: 1500,
    shipping: 150,
    total: 17150,
    paymentMethod: 'Net Banking (SBI)',
    paymentStatus: 'Paid',
    shippingAddress: {
      name: 'Rahul Sharma',
      address: '42, Park View Apartments, MG Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560001',
      phone: '+91 98765 43210',
    },
    trackingNumber: 'DTDC8823441',
    estimatedDelivery: '2025-02-06',
    tracking: [
      { date: 'Feb 1, 2025', time: '11:00 AM', status: 'Order Placed', description: 'Your order has been placed.', completed: true },
      { date: 'Feb 1, 2025', time: '03:00 PM', status: 'Confirmed', description: 'Order confirmed by Vardhan Atelier.', completed: true },
      { date: 'Feb 2, 2025', time: '10:00 AM', status: 'Quality Check', description: 'Garment inspected and packed.', completed: true },
      { date: 'Feb 3, 2025', time: '08:30 AM', status: 'Shipped', description: 'Dispatched via DTDC. Tracking: DTDC8823441', completed: true },
      { date: '', time: '', status: 'Out for Delivery', description: 'Expected Feb 6, 2025.', completed: false },
      { date: '', time: '', status: 'Delivered', description: 'Expected Feb 6, 2025.', completed: false },
    ],
  },
];
