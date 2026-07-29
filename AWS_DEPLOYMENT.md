# AWS S3 + CloudFront Deployment Guide
## Hall of Fashion — Static Next.js Export

---

## Prerequisites

- AWS account with billing enabled
- AWS CLI installed locally (`aws --version`)
- Node.js 20+ installed
- A registered domain name (optional but recommended)

---

## PART 1 — Local Build & Verify

### 1.1 Install dependencies and build

```bash
# Install
npm ci

# Build → generates out/ folder
npm run build

# Verify out/ was created
ls out/
# You should see: index.html, about/, shop/, product/, _next/, ...

# (Optional) Preview locally with any static server
npx serve out
```

### 1.2 Test the export locally before deploying

```bash
# Install serve globally (once)
npm install -g serve

# Serve with clean URLs matching S3/CloudFront behaviour
serve out -s

# Open http://localhost:3000 — test:
# ✅ Home page loads
# ✅ Navigate to /shop, /about, /cart
# ✅ Open a product detail page
# ✅ Refresh the page — should not 404
# ✅ Type a direct URL in the address bar — should not 404
```

---

## PART 2 — IAM User Setup (least privilege)

Create a dedicated IAM user that GitHub Actions will use. **Never use root credentials.**

### 2.1 Create IAM user

```
AWS Console → IAM → Users → Create user
User name: hall-of-fashion-deploy
Access type: Programmatic access (Access key)
```

### 2.2 Attach inline policy

Replace `YOUR_BUCKET_NAME` and `YOUR_DISTRIBUTION_ID`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "S3SyncDeploy",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:GetObject",
        "s3:ListBucket",
        "s3:GetBucketLocation"
      ],
      "Resource": [
        "arn:aws:s3:::YOUR_BUCKET_NAME",
        "arn:aws:s3:::YOUR_BUCKET_NAME/*"
      ]
    },
    {
      "Sid": "CloudFrontInvalidate",
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation",
        "cloudfront:GetInvalidation",
        "cloudfront:ListInvalidations"
      ],
      "Resource": "arn:aws:cloudfront::*:distribution/YOUR_DISTRIBUTION_ID"
    }
  ]
}
```

### 2.3 Save the credentials

After creating the user, **download the CSV immediately** — you cannot view the secret key again.

---

## PART 3 — S3 Bucket Setup

### 3.1 Create the bucket

```
AWS Console → S3 → Create bucket

Bucket name: hall-of-fashion-prod          ← must be globally unique
AWS Region:  ap-south-1                    ← choose closest to your users
```

**IMPORTANT settings during creation:**
- ✅ **Block all public access** → **UNCHECK** "Block all public access"
  - Acknowledge the warning (CloudFront needs to read objects)
- Object Ownership: ACLs disabled (recommended)
- Versioning: Optional (useful for rollback)

### 3.2 Enable Static Website Hosting

```
S3 → Your Bucket → Properties → Static website hosting → Edit

Static website hosting: Enable
Index document: index.html
Error document: index.html       ← This handles client-side routing 404s
```

> **Why `index.html` for error document?**  
> When a user refreshes `/cart`, S3 looks for `cart.html` or `cart/index.html`.
> With `trailingSlash: true`, it will find `cart/index.html`. But as a safety net,
> setting the error document to `index.html` ensures the React app loads and
> client-side routing takes over even if S3 returns a 404.

Note the **Static website hosting endpoint** URL — you'll use it as CloudFront origin.

### 3.3 Set Bucket Policy (public read)

```
S3 → Your Bucket → Permissions → Bucket policy → Edit
```

Paste (replace `YOUR_BUCKET_NAME`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
    }
  ]
}
```

### 3.4 Upload files manually (first time)

```bash
# Configure AWS CLI with your IAM credentials
aws configure
# AWS Access Key ID: <paste key>
# AWS Secret Access Key: <paste secret>
# Default region: ap-south-1
# Default output format: json

# Upload HTML files with no-cache headers
aws s3 sync out/ s3://YOUR_BUCKET_NAME \
  --delete \
  --exclude "*" \
  --include "*.html" \
  --cache-control "public, max-age=0, must-revalidate" \
  --content-type "text/html"

# Upload hashed JS/CSS with 1-year immutable cache
aws s3 sync out/_next/static/ s3://YOUR_BUCKET_NAME/_next/static/ \
  --cache-control "public, max-age=31536000, immutable"

# Upload everything else (images, fonts, public assets)
aws s3 sync out/ s3://YOUR_BUCKET_NAME \
  --exclude "*.html" \
  --exclude "_next/static/*" \
  --cache-control "public, max-age=86400"

echo "✅ Files uploaded to S3"
```

---

## PART 4 — CloudFront Distribution Setup

CloudFront sits in front of S3, adds HTTPS, global CDN edge locations, and handles routing.

### 4.1 Create CloudFront Distribution

```
AWS Console → CloudFront → Create distribution
```

**Origin settings:**

| Field | Value |
|-------|-------|
| Origin domain | Use the **S3 static website endpoint** (e.g. `hall-of-fashion-prod.s3-website.ap-south-1.amazonaws.com`) — NOT the S3 bucket domain |
| Protocol | HTTP only (S3 website hosting is HTTP) |
| Name | hall-of-fashion-origin |

> ⚠️ **Critical:** Use the S3 **website endpoint** (`bucket.s3-website.region.amazonaws.com`), NOT the bucket REST API endpoint (`bucket.s3.amazonaws.com`). Only the website endpoint respects the `index.html` error document config.

**Default cache behavior:**

| Field | Value |
|-------|-------|
| Viewer protocol policy | Redirect HTTP to HTTPS |
| Allowed HTTP methods | GET, HEAD |
| Compress objects automatically | Yes |
| Cache policy | CachingOptimized |

**Distribution settings:**

| Field | Value |
|-------|-------|
| Price class | Use all edge locations (best performance) |
| Default root object | `index.html` |
| IPv6 | Enabled |

### 4.2 Client-side routing — fix page refresh (CRITICAL)

Without this, refreshing `/cart` returns a CloudFront 403/404 error because CloudFront can't find that exact file.

```
CloudFront → Your Distribution → Error pages → Create custom error response

HTTP error code:   403
Customize error response: Yes
Response page path: /index.html
HTTP response code: 200

----- repeat -----

HTTP error code:   404
Customize error response: Yes
Response page path: /index.html
HTTP response code: 200
```

> **How it works:** When S3 returns 403 or 404 for `/cart`, CloudFront intercepts it,
> serves `/index.html` with a 200 status, and the Next.js router reads the URL and
> renders the correct page client-side.

### 4.3 Note your CloudFront domain

After creation (takes ~5 minutes), you get:
```
https://d1abc23defghij.cloudfront.net
```

Test it — your site should be live.

---

## PART 5 — SSL Certificate & Custom Domain (Route53)

### 5.1 Request ACM Certificate

**IMPORTANT: Certificates for CloudFront MUST be created in `us-east-1` (N. Virginia),
regardless of where your S3 bucket is.**

```
AWS Console → Certificate Manager → (switch region to us-east-1) → Request certificate

Certificate type: Public
Domain names:
  halloffashion.com
  www.halloffashion.com

Validation method: DNS validation
```

### 5.2 Validate via Route53

If your domain is in Route53:
```
ACM → Certificate → Create records in Route53 (button)
```
Auto-creates the CNAME validation records. Wait ~5 minutes for validation.

### 5.3 Attach certificate to CloudFront

```
CloudFront → Your Distribution → Settings → Edit

Custom SSL certificate: Select the ACM cert you just created
Supported HTTP versions: HTTP/2 and HTTP/3
```

Add your CNAMEs:
```
Alternate domain names (CNAMEs):
  halloffashion.com
  www.halloffashion.com
```

### 5.4 Route53 DNS Records

```
Route53 → Hosted Zone → halloffashion.com → Create record

Record 1 (apex domain):
  Name:   (blank / @)
  Type:   A
  Route traffic to: Alias → CloudFront distribution
  Distribution: select yours

Record 2 (www):
  Name:   www
  Type:   A
  Route traffic to: Alias → CloudFront distribution
  Distribution: select yours
```

DNS propagation: 5 minutes (Route53) to 48 hours (external registrar).

---

## PART 6 — Cache Invalidation Strategy

After each deployment, invalidate CloudFront so users get fresh HTML immediately.
(Hashed JS/CSS assets never need invalidation.)

```bash
# Invalidate all HTML files
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"

# More targeted (saves cost if you know what changed):
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/index.html" "/shop/*" "/product/*"
```

**Cost note:** First 1,000 invalidation paths/month are free. After that, $0.005 per path.
Using `/*` counts as 1 path.

---

## PART 7 — Full Deployment Commands Reference

```bash
# ── Development ──────────────────────────────────────────────────────────────
npm run dev                    # starts http://localhost:3000 with hot reload

# ── Production Build + Export ────────────────────────────────────────────────
npm run build                  # generates out/ folder (static HTML/CSS/JS)

# ── Preview export locally ───────────────────────────────────────────────────
npx serve out                  # preview at http://localhost:3000

# ── Manual deploy to S3 ──────────────────────────────────────────────────────
aws s3 sync out/ s3://YOUR_BUCKET_NAME --delete \
  --exclude "*" --include "*.html" \
  --cache-control "public, max-age=0, must-revalidate"

aws s3 sync out/_next/static/ s3://YOUR_BUCKET_NAME/_next/static/ \
  --cache-control "public, max-age=31536000, immutable"

aws s3 sync out/ s3://YOUR_BUCKET_NAME \
  --exclude "*.html" --exclude "_next/static/*" \
  --cache-control "public, max-age=86400"

# ── Invalidate CloudFront ─────────────────────────────────────────────────────
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

---

## PART 8 — Deployment Checklist

### Build verification
- [ ] `npm run build` completes without errors
- [ ] `out/` folder exists after build
- [ ] `out/index.html` exists
- [ ] `out/shop/index.html` exists (trailingSlash pages)
- [ ] `out/product/` contains subdirectory for each product ID
- [ ] `out/_next/static/` contains hashed JS/CSS files

### S3 verification
- [ ] Bucket created with public access unblocked
- [ ] Static website hosting enabled with `index.html` as both index and error document
- [ ] Bucket policy allows `s3:GetObject` for `Principal: "*"`
- [ ] Files synced to S3 (`aws s3 ls s3://YOUR_BUCKET_NAME`)
- [ ] S3 website URL loads the site over HTTP

### CloudFront verification
- [ ] Origin points to S3 **website endpoint** (not REST endpoint)
- [ ] Default root object: `index.html`
- [ ] HTTP → HTTPS redirect enabled
- [ ] Custom error responses for 403 and 404 → `/index.html` with 200 status
- [ ] Distribution deployed (Status: Enabled)
- [ ] `https://dXXXX.cloudfront.net` loads the site

### Routing verification
- [ ] Navigate to `/shop` from home — works
- [ ] Navigate to `/product/[id]` — works
- [ ] **Refresh `/cart`** — does NOT show CloudFront error page
- [ ] **Refresh `/product/[id]`** — does NOT show CloudFront error page
- [ ] Type `/about` directly in address bar — loads correctly

### SSL / Domain verification
- [ ] ACM certificate issued (Status: Issued) in `us-east-1`
- [ ] CloudFront CNAME alternate domain names configured
- [ ] `https://halloffashion.com` loads with padlock
- [ ] `https://www.halloffashion.com` loads with padlock
- [ ] HTTP redirect to HTTPS works

### GitHub Actions verification
- [ ] All 5 secrets set in repository settings
- [ ] Push to `main` triggers workflow
- [ ] Workflow passes all steps (green checkmarks)
- [ ] Site updated after workflow completes

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| `out/` folder not generated | Missing `output: 'export'` in `next.config.mjs` | Add it |
| Build fails: "Page is missing generateStaticParams" | Dynamic route without static path enumeration | Server wrapper pattern (already applied) |
| Build fails: "Route ... is not supported" | `app/api/route.ts` files exist | Delete `app/api/` folder (already done) |
| CloudFront returns 403/404 on refresh | Error page config missing | Set 403+404 → `/index.html` (200) in CloudFront error pages |
| Images broken in production | `images.unoptimized` not set | Already set in `next.config.mjs` |
| Old version showing on site | CloudFront cache not cleared | Run `create-invalidation --paths "/*"` |
| SSL cert not showing in CloudFront | Certificate in wrong region | ACM cert MUST be in `us-east-1` |
| S3 origin 403 from CloudFront | Using REST endpoint instead of website endpoint | Use `bucket.s3-website.region.amazonaws.com` |
