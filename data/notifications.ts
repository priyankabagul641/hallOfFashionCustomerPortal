export interface Notification {
  id: string;
  type: 'order' | 'offer' | 'system' | 'wishlist' | 'tailor' | 'payment';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  icon: string;
  actionLabel?: string;
  actionHref?: string;
}

export const notifications: Notification[] = [
  {
    id: 'N001',
    type: 'order',
    title: 'Order Shipped!',
    message: 'Your Black Silk Kurta Set (HOF-2025-089) has been shipped via DTDC. Expected delivery: Feb 6, 2025.',
    time: '2 hours ago',
    isRead: false,
    icon: '📦',
    actionLabel: 'Track Order',
    actionHref: '/orders',
  },
  {
    id: 'N002',
    type: 'offer',
    title: 'Exclusive Offer – 20% Off',
    message: 'Use code HALLVIP20 to get 20% off on your next custom sherwani. Valid till Jan 31, 2025.',
    time: '5 hours ago',
    isRead: false,
    icon: '🎁',
    actionLabel: 'Shop Now',
    actionHref: '/shop',
  },
  {
    id: 'N003',
    type: 'tailor',
    title: 'Tailor Accepted Your Request',
    message: 'Masterji Ravi Shankar has accepted your customization request for the Royal Sherwani. Work begins tomorrow.',
    time: '1 day ago',
    isRead: false,
    icon: '🧵',
    actionLabel: 'View Order',
    actionHref: '/orders',
  },
  {
    id: 'N004',
    type: 'wishlist',
    title: 'Price Drop Alert!',
    message: 'Imperial Gold Sherwani in your wishlist is now ₹5,000 off. Limited stock remaining.',
    time: '2 days ago',
    isRead: true,
    icon: '❤️',
    actionLabel: 'View Product',
    actionHref: '/product/sherwani-imperial-gold',
  },
  {
    id: 'N005',
    type: 'order',
    title: 'Order Delivered Successfully',
    message: 'Your Imperial Gold Sherwani (HOF-2024-001) has been delivered. We hope you love it!',
    time: '3 days ago',
    isRead: true,
    icon: '✅',
    actionLabel: 'Write a Review',
    actionHref: '/orders',
  },
  {
    id: 'N006',
    type: 'payment',
    title: 'Payment Confirmed',
    message: 'Payment of ₹33,500 for order HOF-2025-042 has been confirmed via UPI.',
    time: '5 days ago',
    isRead: true,
    icon: '💳',
    actionLabel: 'View Invoice',
    actionHref: '/orders',
  },
  {
    id: 'N007',
    type: 'system',
    title: 'New Collection Launched',
    message: 'The "Heritage Groom 2025" collection is now live. Featuring exclusive pieces by House of Aryav and Aurum Legacy.',
    time: '1 week ago',
    isRead: true,
    icon: '🎉',
    actionLabel: 'Explore Collection',
    actionHref: '/collections',
  },
  {
    id: 'N008',
    type: 'tailor',
    title: 'Measurement Profile Updated',
    message: 'Your measurement profile "Wedding Measurements 2024" has been shared with Masterji Ravi Shankar for your upcoming order.',
    time: '1 week ago',
    isRead: true,
    icon: '📐',
  },
  {
    id: 'N009',
    type: 'offer',
    title: 'Festive Season Sale Ends Tomorrow',
    message: 'Last chance! Up to 30% off on sherwanis and kurta sets. Offer expires tonight at midnight.',
    time: '2 weeks ago',
    isRead: true,
    icon: '⏰',
    actionLabel: 'Shop Sale',
    actionHref: '/shop',
  },
];
