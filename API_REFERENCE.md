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
  - [Shipping Methods](#shipping-methods)
  - [Payment Methods](#payment-methods)
- [Query Examples](#query-examples)
- [Real-time Updates](#real-time-updates)
- [Image Handling](#image-handling)
- [Webhooks](#webhooks)

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

## Best Practices

1. **Caching**: Implement client-side caching for product data
2. **Pagination**: Use GROQ's offset and limit for large datasets
3. **Projections**: Only request the fields you need
4. **Error Handling**: Implement proper error handling for API calls
5. **Rate Limiting**: Respect API rate limits
6. **Environment Variables**: Store sensitive information in environment variables

## Example Frontend Integration

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
      purchaseCount
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
```

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

## Support

For additional help, please contact the development team or refer to the [Sanity documentation](https://www.sanity.io/docs).
