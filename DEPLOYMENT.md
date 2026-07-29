# STYLEKART - Deployment Guide

## Quick Deployment (Vercel)

### Step 1: Prepare Repository
```bash
# Initialize Git if not already done
git init
git add .
git commit -m "Initial STYLEKART commit"
```

### Step 2: Push to GitHub
```bash
# Create new repository on GitHub
git remote add origin https://github.com/yourusername/stylekart.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Vercel
1. Go to https://vercel.com
2. Click "New Project"
3. Import the GitHub repository
4. Configure settings:
   - Framework: Next.js
   - Build Command: `pnpm build`
   - Output Directory: `.next`
5. Click Deploy

**That's it!** Your site is now live.

---

## Environment Variables (Vercel)

In Vercel Dashboard, go to Settings → Environment Variables and add:

```
# Required (leave blank for now, will be configured later)
DATABASE_URL=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
JWT_SECRET=your-super-secret-key-here

# Optional
NODE_ENV=production
```

---

## Backend Setup (Local Development)

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or pnpm

### Installation

```bash
# Create backend directory
mkdir stylekart-backend
cd stylekart-backend

# Initialize Node project
npm init -y

# Install dependencies
npm install express mongoose bcryptjs jsonwebtoken cors multer dotenv razorpay

# Install dev dependencies
npm install -D typescript ts-node @types/node @types/express
```

### Environment Setup

Create `.env` file:
```
# Database
MONGODB_URI=mongodb://localhost:27017/stylekart
# OR use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stylekart

# Security
JWT_SECRET=your-super-secret-key-here
BCRYPT_ROUNDS=10

# Payments (Razorpay)
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_secret

# Server
PORT=5000
NODE_ENV=development

# CORS (Frontend URL)
FRONTEND_URL=http://localhost:3000
```

### Start Backend Server

```bash
npm start
# or for development:
npm run dev
```

Server will run on `http://localhost:5000`

---

## Database Setup

### Option 1: Local MongoDB

```bash
# Install MongoDB Community Edition
# macOS:
brew install mongodb-community

# Start MongoDB:
brew services start mongodb-community

# Access MongoDB:
mongosh
```

### Option 2: MongoDB Atlas (Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Get connection string
5. Update `.env` with connection string

---

## Razorpay Integration

### Setup
1. Create account at https://razorpay.com
2. Get API credentials from dashboard
3. Add to `.env`:
```
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
```

### Implementation in Backend
```javascript
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// In payment route:
const order = await razorpay.orders.create({
  amount: amount * 100, // Amount in paise
  currency: 'INR',
  receipt: orderNumber,
  payment_capture: 1,
});
```

---

## Cloudinary Setup (Image Upload)

1. Create account at https://cloudinary.com
2. Get credentials from dashboard
3. Install package:
```bash
npm install cloudinary next-cloudinary
```

4. Add to `.env`:
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## Email Service Setup (SendGrid)

1. Create account at https://sendgrid.com
2. Get API key
3. Install package:
```bash
npm install @sendgrid/mail
```

4. Add to `.env`:
```
SENDGRID_API_KEY=your_api_key
SENDGRID_FROM_EMAIL=noreply@stylekart.com
```

---

## Production Deployment

### Frontend (Vercel)
Already deployed! Just push to main branch and Vercel will auto-deploy.

### Backend Options

#### Option 1: Railway (Recommended)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and link project
railway login
railway link

# Deploy
railway up
```

#### Option 2: Render
1. Go to https://render.com
2. Create new Web Service
3. Connect GitHub repo
4. Add environment variables
5. Deploy

#### Option 3: Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create stylekart-api

# Set environment variables
heroku config:set MONGODB_URI=...

# Deploy
git push heroku main
```

---

## Connect Frontend to Backend

### Update API Calls

In your frontend code, replace localhost with production URL:

```typescript
// Before:
const API_URL = 'http://localhost:5000';

// After:
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://stylekart-api.railway.app';
```

### Add Environment Variable (Vercel)

In Vercel Dashboard:
```
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

---

## SSL Certificate

Vercel and most hosting services provide free SSL. If self-hosting:

```bash
# Using Let's Encrypt (free)
sudo certbot certonly --standalone -d yourdomain.com
```

---

## Performance Optimization

### Frontend
- Vercel handles CDN and optimization
- Set cache headers in next.config.js
- Image optimization enabled
- Code splitting automatic

### Backend
```javascript
// Add compression middleware
const compression = require('compression');
app.use(compression());

// Add caching headers
app.use((req, res, next) => {
  if (req.method === 'GET') {
    res.set('Cache-Control', 'public, max-age=3600');
  }
  next();
});
```

### Database
- Add indexes on frequently queried fields
- Use MongoDB Atlas performance metrics
- Monitor query performance

---

## Monitoring & Analytics

### Error Tracking (Sentry)
```bash
npm install @sentry/nextjs

# Add Sentry DSN to .env
SENTRY_DSN=your_sentry_dsn
```

### Analytics (PostHog)
```bash
npm install posthog-js

# Add PostHog key to .env
NEXT_PUBLIC_POSTHOG_KEY=your_key
```

---

## Backup & Security

### Database Backup
```bash
# MongoDB Atlas automated backups (included)

# Manual backup:
mongodump --uri "mongodb+srv://..." --out ./backup
```

### Security Checklist
- [ ] Enable HTTPS everywhere
- [ ] Set strong JWT secret
- [ ] Use bcrypt for password hashing
- [ ] Enable CORS properly
- [ ] Rate limiting on APIs
- [ ] Validate all inputs
- [ ] Use environment variables for secrets
- [ ] Enable MongoDB user authentication
- [ ] Regular backups
- [ ] Monitor for security updates

---

## Troubleshooting

### Issue: Deployment stuck
```bash
# Clear Vercel cache and redeploy
vercel --prod --skip-build
```

### Issue: Database connection error
```bash
# Check connection string
# Verify IP whitelist in MongoDB Atlas
# Test connection locally first
```

### Issue: CORS errors
```javascript
// In backend:
const cors = require('cors');
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
```

### Issue: Payment not working
- Verify Razorpay credentials
- Check webhook configuration
- Ensure signature verification is correct

---

## Monitoring Checklist

After deployment:
- [ ] Test login flow
- [ ] Test payment flow
- [ ] Check image loading
- [ ] Verify API endpoints
- [ ] Test mobile responsiveness
- [ ] Check console for errors
- [ ] Monitor Vercel analytics
- [ ] Test email notifications
- [ ] Verify database backups
- [ ] Set up error alerts

---

## Going Live Checklist

- [ ] Domain name registered
- [ ] SSL certificate installed
- [ ] Environment variables configured
- [ ] Database migrated and backed up
- [ ] Payment gateway tested
- [ ] Email service configured
- [ ] Analytics set up
- [ ] Error tracking enabled
- [ ] Monitoring alerts configured
- [ ] Uptime monitoring enabled
- [ ] CDN configured
- [ ] Load testing completed

---

## Support Resources

- Next.js Docs: https://nextjs.org/docs
- MongoDB Docs: https://docs.mongodb.com
- Razorpay Docs: https://razorpay.com/docs
- Vercel Docs: https://vercel.com/docs

---

**Last Updated:** May 2026
**Version:** 1.0.0
