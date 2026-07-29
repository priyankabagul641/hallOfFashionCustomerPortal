# Hall of Fashion — Backend API Documentation
**Version:** 1.0.0  
**Base URL:** `https://api.halloffashion.com/v1`  
**Auth:** Bearer Token (JWT) in `Authorization` header  
**Content-Type:** `application/json`

---

## Table of Contents
1. [Authentication](#1-authentication)
2. [Products](#2-products)
3. [Collections](#3-collections)
4. [Cart](#4-cart)
5. [Wishlist](#5-wishlist)
6. [Orders](#6-orders)
7. [Customization](#7-customization)
8. [Tailors](#8-tailors)
9. [Measurements](#9-measurements)
10. [Notifications](#10-notifications)
11. [User Profile](#11-user-profile)
12. [Reviews](#12-reviews)
13. [Support](#13-support)
14. [Search](#14-search)
15. [Error Codes](#15-error-codes)

---

## 1. Authentication

### 1.1 Sign Up
`POST /auth/signup`

**Request Body**
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "phone": "+919876543210",
  "password": "MyPassword@123"
}
```

**Response 201**
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "user": {
      "id": "usr_abc123",
      "name": "Rahul Sharma",
      "email": "rahul@example.com",
      "phone": "+919876543210",
      "avatar": null,
      "createdAt": "2025-06-02T10:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400
  }
}
```

**Error 409**
```json
{
  "success": false,
  "error": {
    "code": "EMAIL_ALREADY_EXISTS",
    "message": "An account with this email already exists"
  }
}
```

---

### 1.2 Login
`POST /auth/login`

**Request Body**
```json
{
  "email": "rahul@example.com",
  "password": "MyPassword@123"
}
```

**Response 200**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_abc123",
      "name": "Rahul Sharma",
      "email": "rahul@example.com",
      "phone": "+919876543210",
      "avatar": "https://cdn.halloffashion.com/avatars/usr_abc123.jpg"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400
  }
}
```

**Error 401**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email or password is incorrect"
  }
}
```

---

### 1.3 Send OTP
`POST /auth/send-otp`

**Request Body**
```json
{
  "phone": "+919876543210",
  "purpose": "login"
}
```
> `purpose`: `"login"` | `"signup"` | `"password_reset"`

**Response 200**
```json
{
  "success": true,
  "data": {
    "otpId": "otp_xyz789",
    "expiresIn": 300,
    "maskedPhone": "+91XXXXXX3210"
  }
}
```

---

### 1.4 Verify OTP
`POST /auth/verify-otp`

**Request Body**
```json
{
  "otpId": "otp_xyz789",
  "otp": "482910"
}
```

**Response 200**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_abc123",
      "name": "Rahul Sharma",
      "email": "rahul@example.com",
      "phone": "+919876543210"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400
  }
}
```

**Error 400**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_OTP",
    "message": "OTP is incorrect or has expired"
  }
}
```

---

### 1.5 Forgot Password
`POST /auth/forgot-password`

**Request Body**
```json
{
  "email": "rahul@example.com"
}
```

**Response 200**
```json
{
  "success": true,
  "message": "Password reset link sent to rahul@example.com"
}
```

---

### 1.6 Reset Password
`POST /auth/reset-password`

**Request Body**
```json
{
  "token": "reset_token_abc",
  "newPassword": "NewPassword@456"
}
```

**Response 200**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

### 1.7 Logout
`POST /auth/logout`  
🔒 *Requires Auth*

**Response 200**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 2. Products

### 2.1 List Products
`GET /products`

**Query Parameters**

| Param | Type | Description |
|-------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 20, max: 50) |
| `category` | string | `sherwanis` \| `kurtas` \| `indo-western` \| `blazers` \| `waistcoats` \| `accessories` |
| `designer` | string | Designer slug e.g. `house-of-aryav` |
| `fabric` | string | `silk` \| `velvet` \| `cotton` \| `brocade` \| `georgette` \| `linen` |
| `occasion` | string | `wedding` \| `festive` \| `formal` \| `casual` \| `party` |
| `minPrice` | number | Minimum price in INR |
| `maxPrice` | number | Maximum price in INR |
| `minRating` | number | Minimum rating (1–5) |
| `sort` | string | `newest` \| `popular` \| `rating` \| `price_asc` \| `price_desc` |
| `search` | string | Full-text search keyword |

**Response 200**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "prod_sherwani_001",
        "name": "Imperial Gold Sherwani",
        "designer": {
          "id": "des_001",
          "name": "House of Aryav",
          "slug": "house-of-aryav"
        },
        "category": "sherwanis",
        "subcategory": "wedding",
        "price": 48000,
        "discountPrice": 43200,
        "discountPercent": 10,
        "description": "A magnificent gold sherwani for the royal groom.",
        "fabricDetails": "Pure Silk with Zardosi embroidery",
        "occasion": "Wedding",
        "color": "Gold",
        "sizes": ["S", "M", "L", "XL", "XXL"],
        "images": [
          "https://cdn.halloffashion.com/products/prod_sherwani_001_1.jpg",
          "https://cdn.halloffashion.com/products/prod_sherwani_001_2.jpg"
        ],
        "rating": 4.8,
        "reviewCount": 42,
        "stock": 12,
        "deliveryTime": "7–10 days",
        "tags": ["groom", "wedding", "gold", "silk"],
        "sku": "HOF-SHW-001",
        "isNew": true,
        "isBestSeller": false,
        "createdAt": "2025-01-10T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 35,
      "totalPages": 2,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

### 2.2 Get Product by ID
`GET /products/:id`

**Response 200**
```json
{
  "success": true,
  "data": {
    "id": "prod_sherwani_001",
    "name": "Imperial Gold Sherwani",
    "designer": {
      "id": "des_001",
      "name": "House of Aryav",
      "slug": "house-of-aryav",
      "image": "https://cdn.halloffashion.com/designers/des_001.jpg"
    },
    "category": "sherwanis",
    "subcategory": "wedding",
    "price": 48000,
    "discountPrice": 43200,
    "discountPercent": 10,
    "description": "A magnificent gold sherwani for the royal groom.",
    "fabricDetails": "Pure Silk with Zardosi embroidery",
    "careInstructions": "Dry clean only",
    "occasion": "Wedding",
    "color": "Gold",
    "sizes": ["S", "M", "L", "XL", "XXL"],
    "images": [
      "https://cdn.halloffashion.com/products/prod_sherwani_001_1.jpg",
      "https://cdn.halloffashion.com/products/prod_sherwani_001_2.jpg",
      "https://cdn.halloffashion.com/products/prod_sherwani_001_3.jpg"
    ],
    "rating": 4.8,
    "reviewCount": 42,
    "stock": 12,
    "deliveryTime": "7–10 days",
    "tags": ["groom", "wedding", "gold", "silk"],
    "sku": "HOF-SHW-001",
    "isNew": true,
    "isBestSeller": false,
    "relatedProducts": ["prod_sherwani_002", "prod_kurta_001"],
    "createdAt": "2025-01-10T00:00:00Z"
  }
}
```

**Error 404**
```json
{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Product not found"
  }
}
```

---

### 2.3 Get Featured Products
`GET /products/featured`

**Query Parameters:** `limit` (default: 8)

**Response 200**
```json
{
  "success": true,
  "data": {
    "products": [ /* same product shape as above */ ]
  }
}
```

---

## 3. Collections

### 3.1 List Collections
`GET /collections`

**Response 200**
```json
{
  "success": true,
  "data": {
    "collections": [
      {
        "id": "col_groom",
        "slug": "groom",
        "name": "Groom Collection",
        "subtitle": "Your Perfect Wedding Look",
        "description": "Curated exclusively for the groom.",
        "banner": "https://cdn.halloffashion.com/collections/groom-banner.jpg",
        "thumbnail": "https://cdn.halloffashion.com/collections/groom-thumb.jpg",
        "productCount": 24,
        "isActive": true,
        "sortOrder": 1
      }
    ]
  }
}
```

---

### 3.2 Get Collection with Products
`GET /collections/:slug`

**Query Parameters:** `page`, `limit`, `sort`

**Response 200**
```json
{
  "success": true,
  "data": {
    "collection": {
      "id": "col_groom",
      "slug": "groom",
      "name": "Groom Collection",
      "subtitle": "Your Perfect Wedding Look",
      "description": "Curated exclusively for the groom.",
      "banner": "https://cdn.halloffashion.com/collections/groom-banner.jpg",
      "productCount": 24
    },
    "products": [ /* product array */ ],
    "pagination": { /* pagination object */ }
  }
}
```

---

## 4. Cart

### 4.1 Get Cart
`GET /cart`  
🔒 *Requires Auth*

**Response 200**
```json
{
  "success": true,
  "data": {
    "cart": {
      "id": "cart_usr_abc123",
      "items": [
        {
          "id": "cartitem_001",
          "product": {
            "id": "prod_sherwani_001",
            "name": "Imperial Gold Sherwani",
            "image": "https://cdn.halloffashion.com/products/prod_sherwani_001_1.jpg",
            "designer": "House of Aryav",
            "price": 48000,
            "discountPrice": 43200
          },
          "size": "L",
          "quantity": 1,
          "isCustomized": false,
          "unitPrice": 43200,
          "totalPrice": 43200
        }
      ],
      "subtotal": 43200,
      "discount": 4800,
      "shippingCharge": 0,
      "total": 43200,
      "itemCount": 1,
      "couponApplied": null
    }
  }
}
```

---

### 4.2 Add to Cart
`POST /cart/items`  
🔒 *Requires Auth*

**Request Body**
```json
{
  "productId": "prod_sherwani_001",
  "size": "L",
  "quantity": 1,
  "customizationId": null
}
```

**Response 201**
```json
{
  "success": true,
  "message": "Item added to cart",
  "data": {
    "cartItemId": "cartitem_002",
    "cart": { /* updated cart object */ }
  }
}
```

**Error 400**
```json
{
  "success": false,
  "error": {
    "code": "OUT_OF_STOCK",
    "message": "Selected size is out of stock"
  }
}
```

---

### 4.3 Update Cart Item
`PATCH /cart/items/:cartItemId`  
🔒 *Requires Auth*

**Request Body**
```json
{
  "quantity": 2
}
```

**Response 200**
```json
{
  "success": true,
  "data": {
    "cart": { /* updated cart object */ }
  }
}
```

---

### 4.4 Remove Cart Item
`DELETE /cart/items/:cartItemId`  
🔒 *Requires Auth*

**Response 200**
```json
{
  "success": true,
  "message": "Item removed from cart",
  "data": {
    "cart": { /* updated cart object */ }
  }
}
```

---

### 4.5 Apply Coupon
`POST /cart/coupon`  
🔒 *Requires Auth*

**Request Body**
```json
{
  "couponCode": "HALLVIP20"
}
```

**Response 200**
```json
{
  "success": true,
  "data": {
    "coupon": {
      "code": "HALLVIP20",
      "discountType": "percentage",
      "discountValue": 20,
      "maxDiscount": 10000,
      "description": "20% off on custom sherwanis"
    },
    "cart": { /* updated cart with coupon applied */ }
  }
}
```

**Error 400**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_COUPON",
    "message": "Coupon code is invalid or expired"
  }
}
```

---

### 4.6 Remove Coupon
`DELETE /cart/coupon`  
🔒 *Requires Auth*

**Response 200**
```json
{
  "success": true,
  "data": { "cart": { /* updated cart */ } }
}
```

---

## 5. Wishlist

### 5.1 Get Wishlist
`GET /wishlist`  
🔒 *Requires Auth*

**Response 200**
```json
{
  "success": true,
  "data": {
    "wishlist": {
      "items": [
        {
          "id": "wish_001",
          "product": {
            "id": "prod_sherwani_001",
            "name": "Imperial Gold Sherwani",
            "price": 48000,
            "discountPrice": 43200,
            "image": "https://cdn.halloffashion.com/products/prod_sherwani_001_1.jpg",
            "designer": "House of Aryav",
            "inStock": true
          },
          "addedAt": "2025-01-15T10:00:00Z"
        }
      ],
      "count": 1
    }
  }
}
```

---

### 5.2 Add to Wishlist
`POST /wishlist/items`  
🔒 *Requires Auth*

**Request Body**
```json
{
  "productId": "prod_sherwani_001"
}
```

**Response 201**
```json
{
  "success": true,
  "message": "Added to wishlist",
  "data": {
    "wishlistItemId": "wish_002"
  }
}
```

---

### 5.3 Remove from Wishlist
`DELETE /wishlist/items/:productId`  
🔒 *Requires Auth*

**Response 200**
```json
{
  "success": true,
  "message": "Removed from wishlist"
}
```

---

### 5.4 Move Wishlist Item to Cart
`POST /wishlist/items/:wishlistItemId/move-to-cart`  
🔒 *Requires Auth*

**Request Body**
```json
{
  "size": "L",
  "quantity": 1
}
```

**Response 200**
```json
{
  "success": true,
  "message": "Moved to cart",
  "data": {
    "cart": { /* updated cart */ }
  }
}
```

---

## 6. Orders

### 6.1 Create Order (Checkout)
`POST /orders`  
🔒 *Requires Auth*

**Request Body**
```json
{
  "cartId": "cart_usr_abc123",
  "shippingAddressId": "addr_001",
  "deliveryOption": "standard",
  "paymentMethod": "razorpay",
  "couponCode": "HALLVIP20",
  "notes": "Please pack carefully"
}
```

**Response 201**
```json
{
  "success": true,
  "data": {
    "order": {
      "id": "ord_hof_2025_089",
      "orderNumber": "HOF-2025-089",
      "status": "Processing",
      "paymentStatus": "Pending",
      "items": [
        {
          "id": "orditem_001",
          "productId": "prod_sherwani_001",
          "name": "Imperial Gold Sherwani",
          "image": "https://cdn.halloffashion.com/products/prod_sherwani_001_1.jpg",
          "designer": "House of Aryav",
          "size": "L",
          "quantity": 1,
          "unitPrice": 43200,
          "totalPrice": 43200,
          "isCustomized": false
        }
      ],
      "subtotal": 43200,
      "discount": 4800,
      "shippingCharge": 0,
      "total": 38400,
      "shippingAddress": {
        "name": "Rahul Sharma",
        "address": "42, Park View Apartments, MG Road",
        "city": "Bengaluru",
        "state": "Karnataka",
        "pincode": "560001",
        "phone": "+919876543210"
      },
      "estimatedDelivery": "2025-06-10",
      "createdAt": "2025-06-02T14:30:00Z"
    },
    "payment": {
      "razorpayOrderId": "order_razorpay_abc",
      "amount": 38400,
      "currency": "INR",
      "key": "rzp_live_xxxxxxxxxx"
    }
  }
}
```

---

### 6.2 Get All Orders
`GET /orders`  
🔒 *Requires Auth*

**Query Parameters**

| Param | Type | Description |
|-------|------|-------------|
| `page` | number | Page (default: 1) |
| `limit` | number | Items (default: 10) |
| `status` | string | `Processing` \| `Confirmed` \| `In Tailoring` \| `Shipped` \| `Delivered` \| `Cancelled` |

**Response 200**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "ord_hof_2025_089",
        "orderNumber": "HOF-2025-089",
        "date": "2025-06-02",
        "status": "Shipped",
        "paymentStatus": "Paid",
        "total": 38400,
        "itemCount": 1,
        "items": [
          {
            "name": "Imperial Gold Sherwani",
            "image": "https://cdn.halloffashion.com/products/prod_sherwani_001_1.jpg",
            "quantity": 1
          }
        ],
        "estimatedDelivery": "2025-06-10",
        "trackingNumber": "BLUEDART7892341"
      }
    ],
    "pagination": { /* pagination object */ }
  }
}
```

---

### 6.3 Get Order by ID
`GET /orders/:orderId`  
🔒 *Requires Auth*

**Response 200**
```json
{
  "success": true,
  "data": {
    "order": {
      "id": "ord_hof_2025_089",
      "orderNumber": "HOF-2025-089",
      "date": "2025-06-02",
      "status": "Shipped",
      "paymentStatus": "Paid",
      "paymentMethod": "UPI (GPay)",
      "items": [ /* order items */ ],
      "subtotal": 43200,
      "discount": 4800,
      "shippingCharge": 0,
      "total": 38400,
      "shippingAddress": { /* address object */ },
      "trackingNumber": "BLUEDART7892341",
      "estimatedDelivery": "2025-06-10",
      "tracking": [
        {
          "status": "Order Placed",
          "description": "Your order has been placed successfully.",
          "date": "2025-06-02",
          "time": "02:30 PM",
          "completed": true
        },
        {
          "status": "Confirmed",
          "description": "Order confirmed by House of Aryav.",
          "date": "2025-06-03",
          "time": "10:00 AM",
          "completed": true
        },
        {
          "status": "In Tailoring",
          "description": "Your outfit is being crafted by expert tailors.",
          "date": "2025-06-03",
          "time": "02:00 PM",
          "completed": true
        },
        {
          "status": "Quality Check",
          "description": "Garment passed quality inspection.",
          "date": "2025-06-07",
          "time": "11:00 AM",
          "completed": true
        },
        {
          "status": "Shipped",
          "description": "Dispatched via BlueDart.",
          "date": "2025-06-08",
          "time": "09:00 AM",
          "completed": true
        },
        {
          "status": "Out for Delivery",
          "description": "Expected today.",
          "date": "",
          "time": "",
          "completed": false
        },
        {
          "status": "Delivered",
          "description": "Expected by 2025-06-10.",
          "date": "",
          "time": "",
          "completed": false
        }
      ],
      "createdAt": "2025-06-02T14:30:00Z"
    }
  }
}
```

---

### 6.4 Cancel Order
`POST /orders/:orderId/cancel`  
🔒 *Requires Auth*

**Request Body**
```json
{
  "reason": "Changed my mind",
  "details": "I found a better option"
}
```

**Response 200**
```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "data": {
    "orderId": "ord_hof_2025_089",
    "status": "Cancelled",
    "refund": {
      "amount": 38400,
      "method": "Original payment method",
      "estimatedDays": 5
    }
  }
}
```

**Error 400**
```json
{
  "success": false,
  "error": {
    "code": "CANNOT_CANCEL",
    "message": "Order cannot be cancelled after tailoring has started"
  }
}
```

---

### 6.5 Request Return / Alteration
`POST /orders/:orderId/return`  
🔒 *Requires Auth*

**Request Body**
```json
{
  "type": "alteration",
  "reason": "Size issue",
  "description": "The waist needs to be taken in by 1 inch",
  "images": ["https://cdn.halloffashion.com/returns/img_001.jpg"]
}
```
> `type`: `"return"` | `"alteration"` | `"exchange"`

**Response 201**
```json
{
  "success": true,
  "data": {
    "returnRequestId": "ret_001",
    "type": "alteration",
    "status": "Pending Review",
    "pickupScheduled": null,
    "message": "Our team will contact you within 24 hours"
  }
}
```

---

### 6.6 Payment Verification (Razorpay)
`POST /orders/payments/verify`  
🔒 *Requires Auth*

**Request Body**
```json
{
  "orderId": "ord_hof_2025_089",
  "razorpayOrderId": "order_razorpay_abc",
  "razorpayPaymentId": "pay_razorpay_xyz",
  "razorpaySignature": "signature_hash_here"
}
```

**Response 200**
```json
{
  "success": true,
  "data": {
    "orderId": "ord_hof_2025_089",
    "paymentStatus": "Paid",
    "orderStatus": "Confirmed",
    "transactionId": "pay_razorpay_xyz"
  }
}
```

---

## 7. Customization

### 7.1 Create Custom Order
`POST /customizations`  
🔒 *Requires Auth*

**Request Body**
```json
{
  "productType": "sherwani",
  "fabric": "silk",
  "color": "gold",
  "neckDesign": "mandarin",
  "sleeveDesign": "full",
  "backDesign": "embroidered",
  "additionalFeatures": ["zardosi", "monogram"],
  "notes": "Prefer relaxed fit at waist. Add inner pocket on left.",
  "referenceImageUrl": "https://cdn.halloffashion.com/uploads/ref_img_001.jpg",
  "measurementProfileId": "M001",
  "tailorId": "tailor_001",
  "estimatedPrice": 52300
}
```

**Response 201**
```json
{
  "success": true,
  "data": {
    "customization": {
      "id": "cust_001",
      "status": "Draft",
      "productType": "sherwani",
      "fabric": "silk",
      "color": "gold",
      "neckDesign": "mandarin",
      "sleeveDesign": "full",
      "backDesign": "embroidered",
      "additionalFeatures": ["zardosi", "monogram"],
      "notes": "Prefer relaxed fit at waist.",
      "referenceImageUrl": "https://cdn.halloffashion.com/uploads/ref_img_001.jpg",
      "measurementProfileId": "M001",
      "tailorId": "tailor_001",
      "estimatedPrice": 52300,
      "createdAt": "2025-06-02T15:00:00Z"
    }
  }
}
```

---

### 7.2 Get Customization Options
`GET /customizations/options`

**Response 200**
```json
{
  "success": true,
  "data": {
    "productTypes": [
      { "id": "sherwani", "label": "Sherwani", "basePrice": 18000, "image": "https://..." },
      { "id": "kurta", "label": "Kurta Set", "basePrice": 12000, "image": "https://..." }
    ],
    "fabrics": [
      { "id": "silk", "label": "Pure Silk", "description": "Luxurious and breathable", "priceAdd": 5000, "image": "https://..." },
      { "id": "brocade", "label": "Brocade", "description": "Rich woven pattern", "priceAdd": 6000, "image": "https://..." }
    ],
    "colors": [
      { "id": "gold", "label": "Royal Gold", "hex": "#C8A96B" },
      { "id": "ivory", "label": "Ivory White", "hex": "#F5F0E8" }
    ],
    "neckDesigns": [
      { "id": "mandarin", "label": "Mandarin Collar", "description": "Classic standing collar", "priceAdd": 0 }
    ],
    "sleeveDesigns": [
      { "id": "full", "label": "Full Sleeves", "priceAdd": 0 }
    ],
    "backDesigns": [
      { "id": "plain", "label": "Plain Back", "priceAdd": 0 },
      { "id": "embroidered", "label": "Embroidered Panel", "priceAdd": 3000 }
    ],
    "additionalFeatures": [
      { "id": "zardosi", "label": "Zardosi Embroidery", "priceAdd": 4000 },
      { "id": "monogram", "label": "Monogram", "priceAdd": 800 }
    ]
  }
}
```

---

### 7.3 Upload Reference Image
`POST /customizations/upload-reference`  
🔒 *Requires Auth*  
**Content-Type:** `multipart/form-data`

**Request Body**
```
file: <image file> (JPG/PNG/PDF, max 10MB)
```

**Response 200**
```json
{
  "success": true,
  "data": {
    "url": "https://cdn.halloffashion.com/uploads/ref_img_usr_abc_001.jpg",
    "fileId": "file_ref_001",
    "size": 2048576,
    "mimeType": "image/jpeg"
  }
}
```

---

### 7.4 Get Price Estimate
`POST /customizations/estimate`

**Request Body**
```json
{
  "productType": "sherwani",
  "fabric": "silk",
  "additionalFeatures": ["zardosi", "monogram"]
}
```

**Response 200**
```json
{
  "success": true,
  "data": {
    "breakdown": {
      "basePrice": 18000,
      "fabricAdd": 5000,
      "featuresAdd": 4800,
      "total": 27800
    },
    "currency": "INR",
    "note": "Final price confirmed after tailor consultation"
  }
}
```

---

## 8. Tailors

### 8.1 List Tailors
`GET /tailors`

**Query Parameters**

| Param | Type | Description |
|-------|------|-------------|
| `city` | string | `Delhi` \| `Mumbai` \| `Bengaluru` \| `Hyderabad` \| `Jaipur` \| `Lucknow` |
| `specialization` | string | `Sherwanis` \| `Kurta Sets` \| `Indo-Western` etc. |
| `availability` | string | `Available` \| `Appointment Only` |
| `minRating` | number | Minimum rating |
| `page` | number | Page |
| `limit` | number | Items per page |
| `search` | string | Search by name or location |

**Response 200**
```json
{
  "success": true,
  "data": {
    "tailors": [
      {
        "id": "tailor_001",
        "name": "Masterji Ravi Shankar",
        "image": "https://cdn.halloffashion.com/tailors/tailor_001.jpg",
        "location": "Chandni Chowk, Delhi",
        "city": "Delhi",
        "rating": 4.9,
        "reviewCount": 312,
        "experience": "28 years",
        "specializations": ["Sherwanis", "Kurta Sets", "Bespoke Suits"],
        "priceRange": "₹8,000 – ₹60,000",
        "deliveryTime": "7–14 days",
        "availability": "Available",
        "badge": "Master Craftsman",
        "completedOrders": 1480
      }
    ],
    "pagination": { /* pagination object */ }
  }
}
```

---

### 8.2 Get Tailor by ID
`GET /tailors/:tailorId`

**Response 200**
```json
{
  "success": true,
  "data": {
    "tailor": {
      "id": "tailor_001",
      "name": "Masterji Ravi Shankar",
      "image": "https://cdn.halloffashion.com/tailors/tailor_001.jpg",
      "location": "Chandni Chowk, Delhi",
      "city": "Delhi",
      "rating": 4.9,
      "reviewCount": 312,
      "experience": "28 years",
      "specializations": ["Sherwanis", "Kurta Sets", "Bespoke Suits"],
      "priceRange": "₹8,000 – ₹60,000",
      "deliveryTime": "7–14 days",
      "bio": "A master craftsman with 28 years of experience...",
      "portfolio": [
        {
          "id": "port_001",
          "image": "https://cdn.halloffashion.com/tailors/tailor_001_portfolio_1.jpg",
          "title": "Royal Sherwani",
          "category": "Wedding"
        }
      ],
      "availability": "Available",
      "languages": ["Hindi", "Urdu", "English"],
      "completedOrders": 1480,
      "badge": "Master Craftsman",
      "skills": ["Hand Embroidery", "Zardosi Work", "Bespoke Fitting"],
      "certifications": ["NIFT Certified", "Master Artisan - AIACA"]
    }
  }
}
```

---

### 8.3 Book Tailor Appointment
`POST /tailors/:tailorId/appointments`  
🔒 *Requires Auth*

**Request Body**
```json
{
  "name": "Rahul Sharma",
  "phone": "+919876543210",
  "preferredDate": "2025-06-15",
  "preferredTime": "11:00 AM",
  "requirement": "Custom sherwani for wedding in August"
}
```

**Response 201**
```json
{
  "success": true,
  "data": {
    "appointment": {
      "id": "apt_001",
      "tailorId": "tailor_001",
      "tailorName": "Masterji Ravi Shankar",
      "userId": "usr_abc123",
      "date": "2025-06-15",
      "time": "11:00 AM",
      "status": "Pending Confirmation",
      "confirmationCode": "HOF-APT-001",
      "message": "Tailor will confirm within 24 hours via SMS/Email"
    }
  }
}
```

---

### 8.4 Get Tailor Reviews
`GET /tailors/:tailorId/reviews`

**Query Parameters:** `page`, `limit`

**Response 200**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": "rev_tailor_001",
        "userId": "usr_001",
        "userName": "Arjun Mehta",
        "userAvatar": "https://cdn.halloffashion.com/avatars/usr_001.jpg",
        "rating": 5,
        "comment": "Absolutely stunning work. My wedding sherwani was a masterpiece.",
        "orderId": "ord_hof_2024_001",
        "createdAt": "2024-12-15T00:00:00Z"
      }
    ],
    "summary": {
      "averageRating": 4.9,
      "totalReviews": 312,
      "breakdown": {
        "5": 280,
        "4": 25,
        "3": 5,
        "2": 1,
        "1": 1
      }
    },
    "pagination": { /* pagination object */ }
  }
}
```

---

## 9. Measurements

### 9.1 Get All Measurement Profiles
`GET /measurements`  
🔒 *Requires Auth*

**Query Parameters**

| Param | Type | Description |
|-------|------|-------------|
| `type` | string | Optional filter: `shirt` \| `pant` \| `combined` |
| `unit` | string | Optional filter: `in` \| `cm` |

**Response 200**
```json
{
  "success": true,
  "data": {
    "profiles": [
      {
        "id": "meas_001",
        "name": "My Default Profile",
        "measurementType": "shirt",
        "unit": "in",
        "isDefault": true,
        "measurements": {
          "neck": 15.5,
          "shoulder": 17,
          "chest": 40,
          "waist": 34,
          "hip": 38,
          "shirtLength": 44,
          "sleeveLength": 25,
          "armhole": 9,
          "bicep": 14,
          "wrist": 7,
          "frontLength": 43,
          "backLength": 44,
          "cuff": 8
        },
        "notes": "Slightly broad shoulders.",
        "createdAt": "2024-09-15T00:00:00Z",
        "updatedAt": "2024-12-01T00:00:00Z"
      }
    ]
  }
}
```

---

### 9.1.1 Get Profile Details
`GET /measurements/:profileId`  
🔒 *Requires Auth*

**Response 200**
```json
{
  "success": true,
  "data": {
    "profile": {
      "id": "meas_001",
      "name": "My Default Profile",
      "measurementType": "combined",
      "unit": "cm",
      "isDefault": false,
      "measurements": {
        "neck": 39.5,
        "shoulder": 43.1,
        "chest": 102.0,
        "waist": 86.0,
        "hip": 96.0,
        "shirtLength": 111.5,
        "sleeveLength": 63.5,
        "thigh": 57.0,
        "inseam": 76.0,
        "pantLength": 103.0
      },
      "notes": "Combination profile for coordinated sets",
      "createdAt": "2024-09-15T00:00:00Z",
      "updatedAt": "2024-12-01T00:00:00Z"
    }
  }
}
```

---

### 9.2 Create Measurement Profile
`POST /measurements`  
🔒 *Requires Auth*

**Request Body**
```json
{
  "name": "Wedding 2025",
  "measurementType": "combined",
  "unit": "in",
  "isDefault": false,
  "measurements": {
    "neck": 16,
    "shoulder": 17.5,
    "chest": 41,
    "waist": 35,
    "hip": 39,
    "shirtLength": 45,
    "sleeveLength": 25.5,
    "armhole": 10,
    "bicep": 14.5,
    "wrist": 7.2,
    "frontLength": 44,
    "backLength": 45,
    "cuff": 8,
    "thigh": 24,
    "inseam": 30,
    "outseam": 41,
    "rise": 12,
    "pantLength": 42,
    "calf": 16
  },
  "notes": "Taken after gym session"
}
```

**Response 201**
```json
{
  "success": true,
  "data": {
    "profile": {
      "id": "meas_002",
      "name": "Wedding 2025",
      "measurementType": "combined",
      "unit": "in",
      "isDefault": false,
      "measurements": { /* measurements object */ },
      "createdAt": "2025-06-02T15:00:00Z"
    }
  }
}
```

---

### 9.3 Update Measurement Profile
`PATCH /measurements/:profileId`  
🔒 *Requires Auth*

**Request Body** *(partial update)*
```json
{
  "name": "Wedding 2025 Updated",
  "unit": "cm",
  "measurements": {
    "chest": 42
  }
}
```

**Response 200**
```json
{
  "success": true,
  "data": {
    "profile": { /* updated profile */ }
  }
}
```

---

### 9.4 Delete Measurement Profile
`DELETE /measurements/:profileId`  
🔒 *Requires Auth*

**Response 200**
```json
{
  "success": true,
  "message": "Measurement profile deleted"
}
```

---

### 9.5 Set Default Profile
`PATCH /measurements/:profileId/set-default`  
🔒 *Requires Auth*

**Response 200**
```json
{
  "success": true,
  "data": {
    "profileId": "meas_002",
    "isDefault": true
  }
}
```

---

### 9.6 Validation Rules

- `name` must be unique per user, case-insensitive.
- `measurementType` must be one of `shirt`, `pant`, or `combined`.
- `unit` must be one of `in` or `cm`.
- Required measurement fields depend on the selected measurement type.
- Values must be numeric and within the allowed range for the selected unit.
- Units can be switched without validation loss; values should convert on the client or server.

### 9.7 Cart and Order Metadata

When a custom profile is used for an order, the item payload should preserve:

- `measurementProfileId`
- `measurementProfileName`
- `measurementType`
- `measurementUnit`
- `measurementSnapshot`

This lets product detail, cart, checkout, and order history display the same measurement profile without duplicating data.

---

## 10. Notifications

### 10.1 Get Notifications
`GET /notifications`  
🔒 *Requires Auth*

**Query Parameters**

| Param | Type | Description |
|-------|------|-------------|
| `page` | number | Page |
| `limit` | number | Items (default: 20) |
| `type` | string | `order` \| `offer` \| `system` \| `wishlist` \| `tailor` \| `payment` |
| `unreadOnly` | boolean | Filter unread only |

**Response 200**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "notif_001",
        "type": "order",
        "title": "Order Shipped!",
        "message": "Your Black Silk Kurta Set (HOF-2025-089) has been shipped via DTDC.",
        "icon": "📦",
        "isRead": false,
        "actionLabel": "Track Order",
        "actionUrl": "/orders/ord_hof_2025_089",
        "metadata": {
          "orderId": "ord_hof_2025_089",
          "orderNumber": "HOF-2025-089"
        },
        "createdAt": "2025-06-02T12:00:00Z"
      }
    ],
    "unreadCount": 3,
    "pagination": { /* pagination object */ }
  }
}
```

---

### 10.2 Mark Notification as Read
`PATCH /notifications/:notificationId/read`  
🔒 *Requires Auth*

**Response 200**
```json
{
  "success": true,
  "data": {
    "notificationId": "notif_001",
    "isRead": true
  }
}
```

---

### 10.3 Mark All as Read
`PATCH /notifications/read-all`  
🔒 *Requires Auth*

**Response 200**
```json
{
  "success": true,
  "message": "All notifications marked as read",
  "data": { "updatedCount": 3 }
}
```

---

### 10.4 Delete Notification
`DELETE /notifications/:notificationId`  
🔒 *Requires Auth*

**Response 200**
```json
{
  "success": true,
  "message": "Notification deleted"
}
```

---

### 10.5 Update Notification Preferences
`PATCH /notifications/preferences`  
🔒 *Requires Auth*

**Request Body**
```json
{
  "orderUpdates": true,
  "offers": false,
  "wishlistAlerts": true,
  "tailorMessages": true,
  "newCollections": false
}
```

**Response 200**
```json
{
  "success": true,
  "data": {
    "preferences": {
      "orderUpdates": true,
      "offers": false,
      "wishlistAlerts": true,
      "tailorMessages": true,
      "newCollections": false
    }
  }
}
```

---

## 11. User Profile

### 11.1 Get Profile
`GET /users/me`  
🔒 *Requires Auth*

**Response 200**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_abc123",
      "name": "Rahul Sharma",
      "email": "rahul@example.com",
      "phone": "+919876543210",
      "avatar": "https://cdn.halloffashion.com/avatars/usr_abc123.jpg",
      "dateOfBirth": "1992-05-15",
      "gender": "male",
      "defaultMeasurementProfileId": "meas_001",
      "stats": {
        "totalOrders": 5,
        "totalSpent": 185000,
        "wishlistCount": 8,
        "savedDesigns": 2
      },
      "createdAt": "2024-01-10T00:00:00Z"
    }
  }
}
```

---

### 11.2 Update Profile
`PATCH /users/me`  
🔒 *Requires Auth*

**Request Body**
```json
{
  "name": "Rahul K Sharma",
  "phone": "+919876543211",
  "dateOfBirth": "1992-05-15",
  "gender": "male"
}
```

**Response 200**
```json
{
  "success": true,
  "data": {
    "user": { /* updated user object */ }
  }
}
```

---

### 11.3 Upload Avatar
`POST /users/me/avatar`  
🔒 *Requires Auth*  
**Content-Type:** `multipart/form-data`

**Request:** `avatar: <image file>`

**Response 200**
```json
{
  "success": true,
  "data": {
    "avatarUrl": "https://cdn.halloffashion.com/avatars/usr_abc123_v2.jpg"
  }
}
```

---

### 11.4 Get Saved Addresses
`GET /users/me/addresses`  
🔒 *Requires Auth*

**Response 200**
```json
{
  "success": true,
  "data": {
    "addresses": [
      {
        "id": "addr_001",
        "label": "Home",
        "name": "Rahul Sharma",
        "phone": "+919876543210",
        "address": "42, Park View Apartments, MG Road",
        "city": "Bengaluru",
        "state": "Karnataka",
        "pincode": "560001",
        "country": "India",
        "isDefault": true
      }
    ]
  }
}
```

---

### 11.5 Add Address
`POST /users/me/addresses`  
🔒 *Requires Auth*

**Request Body**
```json
{
  "label": "Office",
  "name": "Rahul Sharma",
  "phone": "+919876543210",
  "address": "5th Floor, Tech Park, Whitefield",
  "city": "Bengaluru",
  "state": "Karnataka",
  "pincode": "560066",
  "country": "India",
  "isDefault": false
}
```

**Response 201**
```json
{
  "success": true,
  "data": {
    "address": {
      "id": "addr_002",
      "label": "Office",
      /* ... rest of fields */
    }
  }
}
```

---

### 11.6 Update Address
`PATCH /users/me/addresses/:addressId`  
🔒 *Requires Auth*

**Request Body** *(partial)*
```json
{
  "pincode": "560067",
  "isDefault": true
}
```

**Response 200** — returns updated address

---

### 11.7 Delete Address
`DELETE /users/me/addresses/:addressId`  
🔒 *Requires Auth*

**Response 200**
```json
{
  "success": true,
  "message": "Address deleted"
}
```

---

### 11.8 Change Password
`POST /users/me/change-password`  
🔒 *Requires Auth*

**Request Body**
```json
{
  "currentPassword": "OldPass@123",
  "newPassword": "NewPass@456"
}
```

**Response 200**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## 12. Reviews

### 12.1 Create Product Review
`POST /reviews`  
🔒 *Requires Auth*

**Request Body**
```json
{
  "productId": "prod_sherwani_001",
  "orderId": "ord_hof_2025_001",
  "rating": 5,
  "title": "Absolutely stunning!",
  "comment": "The quality exceeded my expectations. Perfect fit and beautiful embroidery.",
  "images": ["https://cdn.halloffashion.com/reviews/rev_img_001.jpg"]
}
```

**Response 201**
```json
{
  "success": true,
  "data": {
    "review": {
      "id": "rev_001",
      "productId": "prod_sherwani_001",
      "userId": "usr_abc123",
      "userName": "Rahul S.",
      "rating": 5,
      "title": "Absolutely stunning!",
      "comment": "The quality exceeded my expectations.",
      "images": ["https://cdn.halloffashion.com/reviews/rev_img_001.jpg"],
      "isVerifiedPurchase": true,
      "createdAt": "2025-01-05T00:00:00Z"
    }
  }
}
```

---

### 12.2 Get Product Reviews
`GET /products/:productId/reviews`

**Query Parameters:** `page`, `limit`, `sort` (`newest` | `highest` | `lowest`)

**Response 200**
```json
{
  "success": true,
  "data": {
    "reviews": [ /* review array */ ],
    "summary": {
      "averageRating": 4.8,
      "totalReviews": 42,
      "breakdown": { "5": 30, "4": 8, "3": 3, "2": 1, "1": 0 }
    },
    "pagination": { /* pagination */ }
  }
}
```

---

## 13. Support

### 13.1 Create Support Ticket
`POST /support/tickets`  
🔒 *Requires Auth*

**Request Body**
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "phone": "+919876543210",
  "subject": "Order Inquiry",
  "category": "order",
  "orderId": "ord_hof_2025_089",
  "message": "My order hasn't been dispatched yet even after 10 days."
}
```
> `category`: `"order"` | `"custom_order"` | `"return"` | `"payment"` | `"feedback"` | `"other"`

**Response 201**
```json
{
  "success": true,
  "data": {
    "ticket": {
      "id": "ticket_001",
      "ticketNumber": "HOF-TKT-2025-001",
      "subject": "Order Inquiry",
      "status": "Open",
      "priority": "Medium",
      "estimatedResponseTime": "4 hours",
      "createdAt": "2025-06-02T15:00:00Z"
    }
  }
}
```

---

### 13.2 Get My Tickets
`GET /support/tickets`  
🔒 *Requires Auth*

**Response 200**
```json
{
  "success": true,
  "data": {
    "tickets": [
      {
        "id": "ticket_001",
        "ticketNumber": "HOF-TKT-2025-001",
        "subject": "Order Inquiry",
        "status": "Resolved",
        "lastUpdated": "2025-06-03T10:00:00Z",
        "createdAt": "2025-06-02T15:00:00Z"
      }
    ]
  }
}
```

---

### 13.3 Send Chat Message (Bot / Agent)
`POST /support/chat`

**Request Body**
```json
{
  "sessionId": "chat_session_abc123",
  "message": "Where is my order HOF-2025-089?",
  "userId": "usr_abc123"
}
```

**Response 200**
```json
{
  "success": true,
  "data": {
    "sessionId": "chat_session_abc123",
    "reply": "I can help you track your order! Your order HOF-2025-089 was shipped on June 8th via BlueDart (BLUEDART7892341) and is expected by June 10th.",
    "type": "bot",
    "quickReplies": ["Track on courier site", "Speak to agent", "Return policy"],
    "timestamp": "2025-06-02T15:05:00Z"
  }
}
```

---

## 14. Search

### 14.1 Global Search
`GET /search`

**Query Parameters**

| Param | Type | Description |
|-------|------|-------------|
| `q` | string | Search query (required) |
| `type` | string | `all` \| `products` \| `designers` \| `collections` |
| `limit` | number | Results per type (default: 5) |

**Response 200**
```json
{
  "success": true,
  "data": {
    "query": "gold sherwani",
    "results": {
      "products": [
        {
          "id": "prod_sherwani_001",
          "name": "Imperial Gold Sherwani",
          "price": 48000,
          "discountPrice": 43200,
          "image": "https://cdn.halloffashion.com/products/prod_sherwani_001_1.jpg",
          "designer": "House of Aryav",
          "rating": 4.8,
          "type": "product"
        }
      ],
      "designers": [
        {
          "id": "des_001",
          "name": "House of Aryav",
          "image": "https://cdn.halloffashion.com/designers/des_001.jpg",
          "location": "New Delhi",
          "type": "designer"
        }
      ],
      "collections": [
        {
          "id": "col_groom",
          "name": "Groom Collection",
          "thumbnail": "https://cdn.halloffashion.com/collections/groom-thumb.jpg",
          "productCount": 24,
          "type": "collection"
        }
      ],
      "totalCount": 7
    }
  }
}
```

---

### 14.2 Search Suggestions (Autocomplete)
`GET /search/suggestions`

**Query Parameters:** `q` (min 2 chars)

**Response 200**
```json
{
  "success": true,
  "data": {
    "suggestions": [
      { "type": "product", "text": "Imperial Gold Sherwani", "id": "prod_sherwani_001" },
      { "type": "category", "text": "Sherwanis", "href": "/collection/sherwanis" },
      { "type": "designer", "text": "House of Aryav", "id": "des_001" }
    ]
  }
}
```

---

## 15. Error Codes

### HTTP Status Codes

| Status | Meaning |
|--------|---------|
| `200` | OK |
| `201` | Created |
| `400` | Bad Request |
| `401` | Unauthorized — missing or invalid token |
| `403` | Forbidden — insufficient permissions |
| `404` | Not Found |
| `409` | Conflict — duplicate resource |
| `422` | Unprocessable Entity — validation failed |
| `429` | Too Many Requests — rate limited |
| `500` | Internal Server Error |

### Application Error Codes

| Code | Description |
|------|-------------|
| `INVALID_CREDENTIALS` | Wrong email or password |
| `EMAIL_ALREADY_EXISTS` | Signup with existing email |
| `INVALID_OTP` | Wrong or expired OTP |
| `OTP_EXPIRED` | OTP older than 5 minutes |
| `TOKEN_EXPIRED` | JWT token has expired |
| `PRODUCT_NOT_FOUND` | Product ID doesn't exist |
| `OUT_OF_STOCK` | Requested size/quantity unavailable |
| `INVALID_COUPON` | Coupon code invalid or expired |
| `COUPON_LIMIT_REACHED` | Coupon usage limit exhausted |
| `ORDER_NOT_FOUND` | Order ID doesn't exist |
| `CANNOT_CANCEL` | Order in non-cancellable state |
| `RETURN_WINDOW_EXPIRED` | Return requested after 14 days |
| `PAYMENT_FAILED` | Razorpay payment failure |
| `PAYMENT_VERIFICATION_FAILED` | Signature mismatch |
| `TAILOR_NOT_AVAILABLE` | Tailor is fully booked |
| `PROFILE_NOT_FOUND` | Measurement profile not found |
| `VALIDATION_ERROR` | Request body validation failed |
| `RATE_LIMIT_EXCEEDED` | Too many requests from this IP |
| `FILE_TOO_LARGE` | Uploaded file exceeds 10MB |
| `INVALID_FILE_TYPE` | Only JPG/PNG/PDF accepted |

### Standard Error Response Shape
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable error description",
    "fields": {
      "email": "Invalid email format",
      "password": "Must be at least 8 characters"
    }
  }
}
```

---

## Request Headers

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
Accept: application/json
X-App-Version: 1.0.0
X-Platform: web
```

## Rate Limits

| Endpoint Group | Limit |
|----------------|-------|
| Auth endpoints | 10 req / min / IP |
| Product listing | 100 req / min / user |
| Order creation | 5 req / min / user |
| OTP send | 3 req / 10 min / phone |
| File upload | 10 req / hour / user |
| Search | 60 req / min / user |

---

*Last updated: June 2025 — Hall of Fashion v1.0.0*
