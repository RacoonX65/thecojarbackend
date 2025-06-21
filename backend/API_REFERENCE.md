# The Jar Co - Sanity Backend API Reference

This document provides comprehensive documentation for frontend developers and AI assistants working with The Jar Co's Sanity backend.

## Table of Contents
- [Authentication](#authentication)
- [Base URL](#base-url)
- [API Version](#api-version)
- [Schema Reference](#schema-reference)
  - [Product](#product)
  - [Category](#category)
  - [Order](#order)
  - [Customer](#customer)
  - [Site Settings](#site-settings)
  - [Cart](#cart)
  - [Coupon](#coupon)
  - [Shipping Methods](#shipping-methods)
  - [Payment Methods](#payment-methods)
- [Query Examples](#query-examples)
- [Real-time Updates](#real-time-updates)
- [Image Handling](#image-handling)
- [Webhooks](#webhooks)
- [Frontend Integration](#frontend-integration)

## Authentication

All API requests require authentication using your project's API token.

```javascript
// Example headers for authenticated request
const headers = {
  'Authorization': `Bearer ${process.env.SANITY_API_TOKEN}`,
  'Content-Type': 'application/json'
};
```

## Base URL

```
https://[your-project-id].api.sanity.io/v[api-version]/data/query/[dataset]
```

## API Version
Current API version: `2023-05-03`

## Schema Reference

### Product

**Type:** `product`

**Fields:**
- `_id` - Unique identifier
- `_type` - Always "product"
- `productType` - "sneaker", "iphone", or "accessory"
- `title` - Product name
- `slug` - URL-friendly identifier
- `description` - Rich text content
- `price` - Base price in ZAR
- `compareAtPrice` - Original price (for sales)
- `purchaseCount` - Number of times purchased
- `lastPurchased` - Timestamp of last purchase
- `status` - "draft", "active", or "archived"
- `inventory` - Stock management object
- `categories` - Array of category references
- `sneaker` - Sneaker-specific attributes (if productType is "sneaker")
- `iphone` - iPhone-specific attributes (if productType is "iphone")
- `accessory` - Accessory-specific attributes (if productType is "accessory")
- `seo` - SEO metadata

### Category

**Type:** `category`

**Fields:**
- `title` - Category name
- `slug` - URL-friendly identifier
- `description` - Category description
- `parent` - Parent category reference
- `image` - Category image
- `seo` - SEO metadata

### Order

**Type:** `order`

**Fields:**
- `orderNumber` - Unique order identifier
- `customer` - Reference to customer
- `items` - Array of ordered products
- `status` - Order status
- `shippingAddress` - Delivery information
- `billingAddress` - Billing information
- `shippingMethod` - Selected shipping method
- `paymentMethod` - Selected payment method
- `subtotal` - Order subtotal
- `shipping` - Shipping cost
- `tax` - Tax amount
- `total` - Order total
- `notes` - Order notes

### Customer

**Type:** `customer`

**Fields:**
- `name` - Full name
- `email` - Contact email
- `phone` - Contact number
- `billingAddress` - Default billing details
- `shippingAddress` - Default shipping details
- `additionalAddresses` - Saved addresses
- `orders` - Order history
- `wishlist` - Saved products
- `loyaltyPoints` - Loyalty points balance

### Site Settings

**Type:** `siteSettings`

**Fields:**
- `title` - Site title
- `description` - Site description
- `logo` - Site logo
- `favicon` - Site favicon
- `business` - Business information
  - `name` - Business name
  - `phone` - Contact phone
  - `email` - Contact email
  - `address` - Business address
  - `vatNumber` - VAT number
  - `businessHours` - Operating hours
- `social` - Social media links
  - `facebook` - Facebook URL
  - `instagram` - Instagram URL
  - `twitter` - Twitter URL
  - `whatsapp` - WhatsApp number
- `navigation` - Navigation structure
  - `mainMenu` - Main navigation items
  - `footerLinks` - Footer links
- `checkout` - Checkout settings
  - `minimumOrderAmount` - Minimum order value
  - `freeShippingThreshold` - Free shipping threshold
  - `termsAndConditions` - Terms & conditions
  - `privacyPolicy` - Privacy policy
  - `returnPolicy` - Return policy
  - `shippingPolicy` - Shipping policy

### Cart

**Type:** `cart`

**Fields:**
- `sessionId` - Unique session identifier
- `customer` - Customer reference (for logged-in users)
- `items` - Cart items array
  - `product` - Product reference
  - `quantity` - Item quantity
  - `selectedVariant` - Selected variant details
  - `price` - Price at time of addition
  - `addedAt` - When item was added
- `shippingMethod` - Selected shipping method
- `shippingAddress` - Shipping address
- `billingAddress` - Billing address
- `appliedCoupon` - Applied discount coupon
- `totals` - Cart totals
  - `subtotal` - Items subtotal
  - `shipping` - Shipping cost
  - `tax` - Tax amount
  - `discount` - Discount amount
  - `total` - Final total
- `expiresAt` - Cart expiration date
- `lastActivity` - Last activity timestamp

### Coupon

**Type:** `coupon`

**Fields:**
- `code` - Coupon code
- `title` - Coupon title
- `description` - Coupon description
- `discountType` - "percentage", "fixed", or "free_shipping"
- `discountValue` - Discount amount or percentage
- `minimumOrderAmount` - Minimum order value required
- `maximumDiscount` - Maximum discount (for percentage)
- `applicableProducts` - Products this coupon applies to
- `applicableCategories` - Categories this coupon applies to
- `excludedProducts` - Products excluded from coupon
- `usageLimit` - Total usage limit
- `usageCount` - Times used
- `perCustomerLimit` - Usage limit per customer
- `validFrom` - Start date
- `validUntil` - End date
- `isActive` - Whether coupon is active
- `isPublic` - Whether to show publicly
- `customerGroups` - Target customer groups
- `firstTimeOnly` - First-time customers only
- `combineWithOtherOffers` - Can combine with other offers

## Query Examples

### Get All Active Products

```groovy
// GROQ Query
*[_type == "product" && status == "active"] {
  _id,
  title,
  "slug": slug.current,
  description,
  price,
  "imageUrl": mainImage.asset->url,
  purchaseCount,
  productType
}
```

### Get Product by Slug with Variants

```groovy
// GROQ Query
*[_type == "product" && slug.current == $slug][0] {
  _id,
  title,
  description,
  price,
  compareAtPrice,
  "mainImage": mainImage.asset->url,
  "images": images[].asset->url,
  purchaseCount,
  productType,
  // Include variant data based on product type
  ...select(
    productType == "sneaker" => {
      "variants": sneaker.colorVariants[] {
        name,
        color,
        "image": image.asset->url,
        sizes[] {
          size,
          quantity,
          priceAdjustment
        }
      }
    },
    productType == "iphone" => {
      "variants": iphone.colorVariants[] {
        name,
        color,
        "image": image.asset->url,
        storageOptions[] {
          size,
          priceAdjustment,
          batteryGrades[] {
            grade,
            quantity,
            priceAdjustment,
            healthPercentage
          }
        }
      }
    },
    // Default case for accessories
    {
      "inStock": inventory.inStock
    }
  )
}
```

### Get Products by Category

```groovy
// GROQ Query
*[_type == "product" && $categoryId in categories[]._ref && status == "active"] {
  _id,
  title,
  "slug": slug.current,
  price,
  "imageUrl": mainImage.asset->url,
  purchaseCount
}
```

### Get Site Settings

```groovy
// GROQ Query
*[_type == "siteSettings"][0] {
  title,
  description,
  "logo": logo.asset->url,
  "favicon": favicon.asset->url,
  business {
    name,
    phone,
    email,
    address,
    vatNumber,
    businessHours
  },
  social {
    facebook,
    instagram,
    twitter,
    whatsapp
  },
  navigation {
    mainMenu[] {
      title,
      link,
      isExternal,
      "category": category->{
        _id,
        title,
        "slug": slug.current
      },
      "collection": collection->{
        _id,
        title,
        "slug": slug.current
      },
      children[] {
        title,
        link,
        "category": category->{
          _id,
          title,
          "slug": slug.current
        }
      }
    },
    footerLinks[] {
      title,
      link
    }
  },
  checkout {
    minimumOrderAmount,
    freeShippingThreshold,
    termsAndConditions,
    privacyPolicy,
    returnPolicy,
    shippingPolicy
  },
  seo {
    metaTitle,
    metaDescription,
    keywords,
    "metaImage": metaImage.asset->url
  }
}
```

### Get Cart by Session

```groovy
// GROQ Query
*[_type == "cart" && sessionId == $sessionId][0] {
  _id,
  sessionId,
  "customer": customer->{
    _id,
    name,
    email
  },
  items[] {
    _key,
    quantity,
    price,
    selectedVariant,
    "product": product->{
      _id,
      title,
      "slug": slug.current,
      "mainImage": mainImage.asset->url,
      productType,
      price
    }
  },
  shippingMethod,
  shippingAddress,
  billingAddress,
  appliedCoupon,
  totals,
  expiresAt,
  lastActivity
}
```

### Validate Coupon Code

```groovy
// GROQ Query
*[_type == "coupon" && code == $code && isActive == true && 
  validFrom <= now() && validUntil >= now()][0] {
  _id,
  code,
  title,
  description,
  discountType,
  discountValue,
  minimumOrderAmount,
  maximumDiscount,
  usageLimit,
  usageCount,
  perCustomerLimit,
  applicableProducts[]->._id,
  applicableCategories[]->._id,
  excludedProducts[]->._id,
  firstTimeOnly,
  combineWithOtherOffers
}
```

## Real-time Updates

To subscribe to real-time updates for products:

```javascript
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const client = createClient({
  projectId: 'your-project-id',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: true,
  token: 'your-sanity-token'
});

// Subscribe to product updates
const subscription = client
  .listen('*[_type == "product" && _id == $productId]', { productId })
  .subscribe(update => {
    console.log('Product updated:', update);
    // Handle the update
  });

// Don't forget to unsubscribe when done
// subscription.unsubscribe();
```

## Image Handling

### Generate Image URL

```javascript
const builder = imageUrlBuilder(client);

function urlFor(source) {
  return builder.image(source);
}

// Example usage
const imageUrl = urlFor(product.mainImage)
  .width(800)
  .height(600)
  .auto('format')
  .url();
```

### Image Transformations

```javascript
// Basic resize
urlFor(image).width(400).height(300).url()

// Auto format
urlFor(image).auto('format').url()

// Crop
urlFor(image).crop('focalpoint').focalPoint(0.5, 0.5).width(400).height(300).url()

// Quality
urlFor(image).quality(80).url()
```

## Webhooks

### Order Created
Triggered when a new order is created.

**Endpoint:** `[YOUR_WEBHOOK_URL]/api/orders/created`

**Payload:**
```json
{
  "_type": "order",
  "_id": "order-id",
  "status": "processing",
  "total": 9999,
  "customer": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "items": [
    {
      "productId": "product-123",
      "title": "Product Name",
      "quantity": 1,
      "price": 9999
    }
  ]
}
```

### Product Updated
Triggered when a product is created or updated.

**Endpoint:** `[YOUR_WEBHOOK_URL]/api/products/updated`

**Payload:**
```json
{
  "_type": "product",
  "_id": "product-123",
  "title": "Product Name",
  "status": "active",
  "price": 9999,
  "inStock": true,
  "purchaseCount": 42
}
```

### Cart Updated
Triggered when a cart is updated.

**Endpoint:** `[YOUR_WEBHOOK_URL]/api/cart/updated`

**Payload:**
```json
{
  "_type": "cart",
  "_id": "cart-id",
  "sessionId": "session_abc123",
  "itemCount": 3,
  "total": 2999,
  "lastActivity": "2024-01-15T10:30:00Z"
}
```

## Frontend Integration

### Next.js Setup

```javascript
// lib/sanity.js
import { createClient } from 'next-sanity';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  useCdn: process.env.NODE_ENV === 'production',
});

// Fetch all products
export async function getAllProducts() {
  return client.fetch(`
    *[_type == "product" && status == "active"] | order(_createdAt desc) {
      _id,
      title,
      "slug": slug.current,
      price,
      "imageUrl": mainImage.asset->url,
      purchaseCount,
      productType
    }
  `);
}

// Fetch single product by slug
export async function getProductBySlug(slug) {
  const result = await client.fetch(
    `*[_type == "product" && slug.current == $slug][0] {
      _id,
      title,
      description,
      price,
      compareAtPrice,
      "mainImage": mainImage.asset->url,
      "images": images[].asset->url,
      purchaseCount,
      productType,
      // Include variant data based on product type
      ...select(
        productType == "sneaker" => {
          "variants": sneaker.colorVariants[] {
            name,
            color,
            "image": image.asset->url,
            sizes[] {
              size,
              quantity,
              priceAdjustment
            }
          }
        },
        productType == "iphone" => {
          "variants": iphone.colorVariants[] {
            name,
            color,
            "image": image.asset->url,
            storageOptions[] {
              size,
              priceAdjustment,
              batteryGrades[] {
                grade,
                quantity,
                priceAdjustment,
                healthPercentage
              }
            }
          }
        },
        // Default case for accessories
        {
          "inStock": inventory.inStock,
          "accessory": {
            "type": accessory.type,
            "brand": accessory.brand,
            "compatibility": accessory.compatibility,
            "color": accessory.color,
            "material": accessory.material,
            "features": accessory.features,
            "includes": accessory.includes,
            "warranty": accessory.warranty
          }
        }
      )
    }`,
    { slug }
  );
  return result;
}

// Fetch site settings
export async function getSiteSettings() {
  return client.fetch(`
    *[_type == "siteSettings"][0] {
      title,
      description,
      "logo": logo.asset->url,
      "favicon": favicon.asset->url,
      business {
        name,
        phone,
        email,
        address,
        vatNumber,
        businessHours
      },
      social {
        facebook,
        instagram,
        twitter,
        whatsapp
      },
      navigation {
        mainMenu[] {
          title,
          link,
          isExternal,
          "category": category->{
            _id,
            title,
            "slug": slug.current
          },
          "collection": collection->{
            _id,
            title,
            "slug": slug.current
          },
          children[] {
            title,
            link,
            "category": category->{
              _id,
              title,
              "slug": slug.current
            }
          }
        },
        footerLinks[] {
          title,
          link
        }
      },
      checkout {
        minimumOrderAmount,
        freeShippingThreshold,
        termsAndConditions,
        privacyPolicy,
        returnPolicy,
        shippingPolicy
      },
      seo {
        metaTitle,
        metaDescription,
        keywords,
        "metaImage": metaImage.asset->url
      }
    }
  `);
}

// Validate coupon
export async function validateCoupon(code, customerId = null) {
  return client.fetch(`
    *[_type == "coupon" && code == $code && isActive == true && 
      validFrom <= now() && validUntil >= now()][0] {
      _id,
      code,
      title,
      description,
      discountType,
      discountValue,
      minimumOrderAmount,
      maximumDiscount,
      usageLimit,
      usageCount,
      perCustomerLimit,
      applicableProducts[]->._id,
      applicableCategories[]->._id,
      excludedProducts[]->._id,
      firstTimeOnly,
      combineWithOtherOffers
    }`,
    { code }
  );
}
```

### Cart Management

```javascript
// lib/cart.js
import { client } from './sanity';

// Create or update cart
export async function updateCart(cartData) {
  const { sessionId, customer, items, totals, lastActivity } = cartData;
  
  // Check if cart exists
  const existingCart = await client.fetch(
    `*[_type == "cart" && sessionId == $sessionId][0]`,
    { sessionId }
  );

  if (existingCart) {
    // Update existing cart
    return client
      .patch(existingCart._id)
      .set({
        items,
        totals,
        lastActivity: new Date().toISOString(),
        ...(customer && { customer: { _type: 'reference', _ref: customer._id } })
      })
      .commit();
  } else {
    // Create new cart
    return client.create({
      _type: 'cart',
      sessionId,
      customer: customer ? { _type: 'reference', _ref: customer._id } : null,
      items,
      totals,
      lastActivity: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    });
  }
}

// Get cart by session
export async function getCart(sessionId) {
  return client.fetch(`
    *[_type == "cart" && sessionId == $sessionId][0] {
      _id,
      sessionId,
      "customer": customer->{
        _id,
        name,
        email
      },
      items[] {
        _key,
        quantity,
        price,
        selectedVariant,
        "product": product->{
          _id,
          title,
          "slug": slug.current,
          "mainImage": mainImage.asset->url,
          productType,
          price
        }
      },
      shippingMethod,
      shippingAddress,
      billingAddress,
      appliedCoupon,
      totals,
      expiresAt,
      lastActivity
    }`,
    { sessionId }
  );
}
```

## Best Practices

1. **Caching**: Implement client-side caching for product data
2. **Pagination**: Use GROQ's offset and limit for large datasets
3. **Projections**: Only request the fields you need
4. **Error Handling**: Implement proper error handling for API calls
5. **Rate Limiting**: Respect API rate limits
6. **Environment Variables**: Store sensitive information in environment variables
7. **Type Safety**: Use TypeScript for better development experience
8. **Image Optimization**: Use Sanity's image transformations
9. **Real-time Updates**: Implement real-time updates for critical data
10. **Security**: Validate all inputs and sanitize outputs

## Troubleshooting

### Common Issues

1. **Missing Data**
   - Verify the document exists in the dataset
   - Check for typos in field names
   - Ensure you're querying the correct dataset

2. **Authentication Errors**
   - Verify your API token is valid
   - Check token permissions
   - Ensure CORS is configured correctly

3. **Performance Issues**
   - Add indexes for frequently queried fields
   - Use projections to limit returned data
   - Implement caching where appropriate

4. **Image Loading Issues**
   - Check image asset references
   - Verify image transformations
   - Ensure proper CORS headers

5. **Cart Issues**
   - Check session ID format
   - Verify cart expiration
   - Ensure proper variant selection

## Support

For additional help, please contact the development team or refer to the [Sanity documentation](https://www.sanity.io/docs).
