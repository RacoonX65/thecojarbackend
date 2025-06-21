// Frontend-optimized GROQ queries for The Jar Co e-commerce

// ============================================================================
// PRODUCT QUERIES
// ============================================================================

// Get all active products with basic info for product listings
export const getAllProductsQuery = `
  *[_type == "product" && status == "active"] | order(_createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    price,
    compareAtPrice,
    "mainImage": mainImage.asset->url,
    productType,
    purchaseCount,
    "brand": brand->name,
    "categories": categories[]->title,
    "inStock": inventory.inStock,
    "quantity": inventory.quantity,
    _createdAt
  }
`;

// Get featured products
export const getFeaturedProductsQuery = `
  *[_type == "product" && status == "active" && purchaseCount > 0] | order(purchaseCount desc)[0...8] {
    _id,
    title,
    "slug": slug.current,
    price,
    compareAtPrice,
    "mainImage": mainImage.asset->url,
    productType,
    purchaseCount,
    "brand": brand->name
  }
`;

// Get single product with full details and variants
export const getProductBySlugQuery = `
  *[_type == "product" && slug.current == $slug && status == "active"][0] {
    _id,
    title,
    description,
    price,
    compareAtPrice,
    "mainImage": mainImage.asset->url,
    "images": images[].asset->url,
    productType,
    purchaseCount,
    "brand": brand->name,
    "categories": categories[]->{
      _id,
      title,
      "slug": slug.current
    },
    "tags": tags,
    "inStock": inventory.inStock,
    "quantity": inventory.quantity,
    "allowBackorder": inventory.allowBackorder,
    
    // iPhone specific data
    iphone {
      model,
      colorVariants[] {
        color,
        quantity,
        priceAdjustment,
        "images": images[].asset->url,
        storageOptions[] {
          capacity,
          storagePriceAdjustment,
          batteryGrades[] {
            grade,
            quantity,
            priceAdjustment,
            healthPercentage
          }
        }
      },
      condition,
      network,
      warranty,
      imei,
      includes
    },
    
    // Sneaker specific data
    sneaker {
      "brand": brand->name,
      model,
      colorVariants[] {
        colorName,
        colorCode,
        quantity,
        priceAdjustment,
        "images": images[].asset->url,
        sizeOptions[] {
          size,
          quantity,
          sizePriceAdjustment
        }
      },
      condition,
      releaseDate,
      styleCode,
      gender,
      materials
    },
    
    // Accessory specific data
    accessory {
      type,
      "brand": brand->name,
      compatibility,
      color,
      material,
      features,
      includes,
      warranty
    },
    
    // SEO data
    seo {
      metaTitle,
      metaDescription,
      keywords,
      "metaImage": metaImage.asset->url,
      noIndex
    }
  }
`;

// Get products by category
export const getProductsByCategoryQuery = `
  *[_type == "product" && status == "active" && $categoryId in categories[]._ref] | order(_createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    price,
    compareAtPrice,
    "mainImage": mainImage.asset->url,
    productType,
    purchaseCount,
    "brand": brand->name,
    "inStock": inventory.inStock
  }
`;

// Get products by collection
export const getProductsByCollectionQuery = `
  *[_type == "collection" && slug.current == $collectionSlug][0] {
    _id,
    title,
    description,
    "image": image.asset->url,
    "products": products[]->{
      _id,
      title,
      "slug": slug.current,
      price,
      compareAtPrice,
      "mainImage": mainImage.asset->url,
      productType,
      purchaseCount,
      "brand": brand->name,
      "inStock": inventory.inStock
    }
  }
`;

// Search products
export const searchProductsQuery = `
  *[_type == "product" && status == "active" && (
    title match $searchTerm + "*" ||
    description[0].children[0].text match $searchTerm + "*" ||
    brand->name match $searchTerm + "*" ||
    $searchTerm in tags
  )] | order(purchaseCount desc) {
    _id,
    title,
    "slug": slug.current,
    price,
    compareAtPrice,
    "mainImage": mainImage.asset->url,
    productType,
    purchaseCount,
    "brand": brand->name,
    "categories": categories[]->title,
    "inStock": inventory.inStock
  }
`;

// ============================================================================
// CATEGORY & NAVIGATION QUERIES
// ============================================================================

// Get all categories with product counts
export const getAllCategoriesQuery = `
  *[_type == "category"] {
    _id,
    title,
    "slug": slug.current,
    description,
    "image": image.asset->url,
    "productCount": count(*[_type == "product" && status == "active" && references(^._id)]),
    "parent": parent->{
      _id,
      title,
      "slug": slug.current
    }
  }
`;

// Get category by slug
export const getCategoryBySlugQuery = `
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    title,
    description,
    "image": image.asset->url,
    "slug": slug.current,
    seo {
      metaTitle,
      metaDescription,
      keywords,
      "metaImage": metaImage.asset->url
    }
  }
`;

// ============================================================================
// SITE SETTINGS QUERIES
// ============================================================================

// Get site settings
export const getSiteSettingsQuery = `
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
`;

// ============================================================================
// CART QUERIES
// ============================================================================

// Get cart by session ID
export const getCartBySessionQuery = `
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
`;

// ============================================================================
// SHIPPING & PAYMENT QUERIES
// ============================================================================

// Get active shipping methods
export const getActiveShippingMethodsQuery = `
  *[_type == "shippingMethod" && isActive == true] | order(price asc) {
    _id,
    provider,
    name,
    description,
    price,
    freeThreshold,
    estimatedDelivery,
    serviceType,
    paxiPoint,
    cashOnDeliveryAreas,
    codFee,
    minOrderAmount,
    maxWeight
  }
`;

// Get active payment methods
export const getActivePaymentMethodsQuery = `
  *[_type == "paymentMethod" && isActive == true] | order(name asc) {
    _id,
    name,
    description,
    instructions,
    codFee,
    minOrderAmount,
    availableForDelivery,
    availableForCollection
  }
`;

// ============================================================================
// COUPON QUERIES
// ============================================================================

// Get active public coupons
export const getActivePublicCouponsQuery = `
  *[_type == "coupon" && isActive == true && isPublic == true && 
    validFrom <= now() && validUntil >= now()] | order(_createdAt desc) {
    _id,
    code,
    title,
    description,
    discountType,
    discountValue,
    minimumOrderAmount,
    maximumDiscount,
    validUntil
  }
`;

// Validate coupon code
export const validateCouponQuery = `
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
`;

// ============================================================================
// ORDER QUERIES
// ============================================================================

// Get customer orders
export const getCustomerOrdersQuery = `
  *[_type == "order" && customer._ref == $customerId] | order(_createdAt desc) {
    _id,
    orderNumber,
    status,
    "items": items[] {
      quantity,
      price,
      variant,
      "product": product->{
        title,
        "mainImage": mainImage.asset->url
      }
    },
    totals,
    _createdAt
  }
`;

// Get order by ID
export const getOrderByIdQuery = `
  *[_type == "order" && _id == $orderId][0] {
    _id,
    orderNumber,
    "customer": customer->{
      _id,
      name,
      email,
      phone
    },
    "items": items[] {
      quantity,
      price,
      variant,
      "product": product->{
        _id,
        title,
        "slug": slug.current,
        "mainImage": mainImage.asset->url
      }
    },
    status,
    payment {
      method,
      status,
      transactionId
    },
    shipping {
      method,
      trackingNumber,
      deliveryAddress,
      collectionPoint
    },
    totals,
    _createdAt
  }
`;

// ============================================================================
// REVIEW QUERIES
// ============================================================================

// Get approved reviews for a product
export const getProductReviewsQuery = `
  *[_type == "review" && product._ref == $productId && isApproved == true] | order(_createdAt desc) {
    _id,
    title,
    rating,
    comment,
    "customer": customer->name,
    "customerImage": customer->image.asset->url,
    helpfulCount,
    notHelpfulCount,
    _createdAt,
    "comments": *[_type == "reviewComment" && review._ref == ^._id && isApproved == true] {
      _id,
      comment,
      "customer": customer->name,
      guestName,
      _createdAt
    }
  }
`;

// ============================================================================
// UTILITY QUERIES
// ============================================================================

// Get product count for pagination
export const getProductCountQuery = `
  count(*[_type == "product" && status == "active"])
`;

// Get products with pagination
export const getProductsWithPaginationQuery = `
  *[_type == "product" && status == "active"] | order(_createdAt desc) [$start...$end] {
    _id,
    title,
    "slug": slug.current,
    price,
    compareAtPrice,
    "mainImage": mainImage.asset->url,
    productType,
    purchaseCount,
    "brand": brand->name,
    "categories": categories[]->title,
    "inStock": inventory.inStock
  }
`;

// Get related products
export const getRelatedProductsQuery = `
  *[_type == "product" && status == "active" && _id != $productId && 
    (brand._ref == $brandId || count(categories[]._ref in $categoryIds) > 0)] | 
    order(purchaseCount desc)[0...4] {
    _id,
    title,
    "slug": slug.current,
    price,
    compareAtPrice,
    "mainImage": mainImage.asset->url,
    productType,
    purchaseCount,
    "brand": brand->name
  }
`; 