# The Jar Co - Sanity E-commerce Backend

## Overview
This is the Sanity.io backend for The Jar Co, a South African e-commerce platform specializing in iPhones and sneakers. The backend is built with Sanity Studio v3 and includes custom schemas for product management, inventory, and order processing.

## Features

- **Product Management**: Comprehensive schemas for iPhones, sneakers, and accessories
- **Inventory Tracking**: Detailed inventory management with color variants, sizes, and conditions
- **Pricing**: Flexible pricing with adjustments for different variants and conditions
- **SEO & Content**: Built-in SEO fields and content management
- **South Africa Focus**: Localized for South African market (ZAR currency, local shipping, etc.)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your Sanity project details:
   ```
   SANITY_PROJECT_ID=your_project_id
   SANITY_DATASET=production
   SANITY_API_VERSION=2023-05-03
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Schema Documentation

### 1. Product Schema
**File:** `schemas/product.ts`  
**Description:** Base product schema with common fields  
**Fields:**
- `title`: Product name
- `slug`: URL-friendly identifier
- `description`: Detailed product description
- `brand`: Reference to brand
- `price`: Base price in ZAR
- `compareAtPrice`: Original price for showing discounts
- `featuredImage`: Main product image
- `images`: Additional product images
- `isAvailable`: Stock status
- `tags`: Product tags for filtering
- `seo`: SEO metadata
- `type`: Product type (iphone, sneaker, accessory)

### 2. iPhone Product Type
**File:** `schemas/iphoneAttributes.ts`  
**Description:** Extended attributes for iPhone products  
**Features:**
- **Color Variants**: Multiple color options with individual inventory
- **Storage Options**: 64GB, 128GB, 256GB configurations
- **Battery Grades**: A (90-100%), B (80-89%), C (70-79%)
- **Condition**: New, Refurbished, Used conditions
- **Network**: Carrier options (Vodacom, MTN, etc.)

**Fields:**
- `model`: iPhone model (15 Pro Max, 14, etc.)
- `colorVariants`: Array of color options
  - `color`: Color name (Space Black, Silver, etc.)
  - `quantity`: Total stock for this color
  - `priceAdjustment`: Additional cost for this color
  - `images`: Color-specific images
  - `storageOptions`: Available storage configurations
    - `capacity`: 64GB/128GB/256GB
    - `priceAdjustment`: Additional cost for this storage
    - `batteryGrades`: Available battery conditions
      - `grade`: A/B/C
      - `quantity`: Stock for this grade
      - `priceAdjustment`: Additional cost for this grade
      - `healthPercentage`: Actual battery health (70-100%)
- `condition`: Product condition (New, Refurbished, Used)
- `network`: Carrier (Unlocked, Vodacom, MTN, etc.)
- `warranty`: Warranty information
- `imei`: Device IMEI number
- `includes`: Included accessories

### 3. Sneaker Product Type
**File:** `schemas/sneakerAttributes.ts`  
**Description:** Extended attributes for sneaker products  
**Features:**
- **Color Variants**: Multiple colorways with individual inventory
- **Size Options**: UK sizing with stock levels
- **Condition**: New/Used conditions

**Fields:**
- `brand`: Sneaker brand (Nike, Adidas, etc.)
- `model`: Shoe model name
- `colorVariants`: Array of color options
  - `color`: Color name
  - `quantity`: Total stock for this color
  - `priceAdjustment`: Additional cost for this color
  - `images`: Color-specific images
  - `sizes`: Available sizes
    - `size`: UK size
    - `quantity`: Stock for this size
    - `priceAdjustment`: Additional cost for this size
- `condition`: New or Used
- `releaseDate`: Original release date
- `styleCode`: Manufacturer style code

### 4. Category Schema
**File:** `schemas/category.ts`  
**Description:** Product categorization  
**Fields:**
- `title`: Category name
- `slug`: URL-friendly identifier
- `description`: Category description
- `image`: Category thumbnail
- `seo`: SEO metadata

### 5. Collection Schema
**File:** `schemas/collection.ts`  
**Description:** Grouping of related products  
**Fields:**
- `title`: Collection name
- `slug`: URL-friendly identifier
- `description`: Collection description
- `featuredImage`: Main collection image
- `products`: Products in this collection
- `isFeatured`: Mark as featured collection
- `seo`: SEO metadata

### 6. Customer Schema
**File:** `schemas/customer.ts`  
**Description:** Customer information  
**Fields:**
- `name`: Full name
- `email`: Contact email
- `phone`: Contact number
- `billingAddress`: Default billing details
- `shippingAddress`: Default shipping details
- `additionalAddresses`: Saved addresses
- `orders`: Order history

### 7. Order Schema
**File:** `schemas/order.ts`  
**Description:** Customer orders  
**Fields:**
- `orderNumber`: Unique order ID
- `customer`: Reference to customer
- `items`: Ordered products with variants
- `subtotal`: Order subtotal
- `shipping`: Shipping cost
- `tax`: Tax amount
- `total`: Order total
- `status`: Order status
- `paymentMethod`: Payment details
- `shippingAddress`: Delivery address
- `tracking`: Shipping tracking information

## Localization

The schema is localized for the South African market:
- Currency: ZAR (South African Rand)
- Payment Methods: PayFast, EFT, Cash on Delivery
- Delivery: Limited to Johannesburg areas
- Phone numbers: South African format
- Addresses: South African address format

## Development

### Adding New Product Types
1. Create a new schema file in `schemas/`
2. Define the schema using `defineType` and `defineField`
3. Import and add it to the schema types in `sanity.config.ts`

### Custom Input Components
Custom input components are used for:
- Price adjustments
- Inventory management
- Variant selection

## Deployment

1. Build for production:
   ```bash
   npm run build
   ```
2. Deploy to Sanity:
   ```bash
   sanity deploy
   ```

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

MIT
