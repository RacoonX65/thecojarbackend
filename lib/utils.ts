// Frontend utility functions for The Jar Co e-commerce

// ============================================================================
// PRICE & CURRENCY UTILITIES
// ============================================================================

/**
 * Format price in ZAR currency
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 2,
  }).format(price);
};

/**
 * Calculate final price with all adjustments
 */
export const calculateFinalPrice = (
  basePrice: number,
  adjustments: {
    colorAdjustment?: number;
    sizeAdjustment?: number;
    storageAdjustment?: number;
    batteryAdjustment?: number;
  } = {}
): number => {
  const totalAdjustment = Object.values(adjustments).reduce((sum, adj) => sum + (adj || 0), 0);
  return basePrice + totalAdjustment;
};

/**
 * Calculate discount percentage
 */
export const calculateDiscountPercentage = (originalPrice: number, salePrice: number): number => {
  if (originalPrice <= salePrice) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
};

/**
 * Calculate cart totals
 */
export const calculateCartTotals = (items: any[], shippingCost: number = 0, discount: number = 0) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.15; // 15% VAT
  const total = subtotal + shippingCost + tax - discount;
  
  return {
    subtotal,
    shipping: shippingCost,
    tax,
    discount,
    total,
  };
};

// ============================================================================
// PRODUCT VARIANT UTILITIES
// ============================================================================

/**
 * Get available variants for a product
 */
export const getProductVariants = (product: any) => {
  if (!product) return null;

  switch (product.productType) {
    case 'iphone':
      return product.iphone?.colorVariants?.map((colorVariant: any) => ({
        type: 'color',
        name: colorVariant.color,
        priceAdjustment: colorVariant.priceAdjustment || 0,
        images: colorVariant.images || [],
        storageOptions: colorVariant.storageOptions?.map((storage: any) => ({
          capacity: storage.capacity,
          priceAdjustment: storage.storagePriceAdjustment || 0,
          batteryGrades: storage.batteryGrades?.map((battery: any) => ({
            grade: battery.grade,
            healthPercentage: battery.healthPercentage,
            priceAdjustment: battery.priceAdjustment || 0,
            quantity: battery.quantity || 0,
          })) || [],
        })) || [],
      })) || [];

    case 'sneaker':
      return product.sneaker?.colorVariants?.map((colorVariant: any) => ({
        type: 'color',
        name: colorVariant.colorName,
        colorCode: colorVariant.colorCode,
        priceAdjustment: colorVariant.priceAdjustment || 0,
        images: colorVariant.images || [],
        sizes: colorVariant.sizeOptions?.map((size: any) => ({
          size: size.size,
          priceAdjustment: size.sizePriceAdjustment || 0,
          quantity: size.quantity || 0,
        })) || [],
      })) || [];

    default:
      return null;
  }
};

/**
 * Check if a specific variant is in stock
 */
export const isVariantInStock = (product: any, selectedVariant: any): boolean => {
  if (!product || !selectedVariant) return false;

  switch (product.productType) {
    case 'iphone':
      const colorVariant = product.iphone?.colorVariants?.find(
        (cv: any) => cv.color === selectedVariant.color
      );
      if (!colorVariant) return false;

      const storageOption = colorVariant.storageOptions?.find(
        (so: any) => so.capacity === selectedVariant.storage
      );
      if (!storageOption) return false;

      const batteryGrade = storageOption.batteryGrades?.find(
        (bg: any) => bg.grade === selectedVariant.batteryGrade
      );
      return batteryGrade ? batteryGrade.quantity > 0 : false;

    case 'sneaker':
      const sneakerColorVariant = product.sneaker?.colorVariants?.find(
        (cv: any) => cv.colorName === selectedVariant.color
      );
      if (!sneakerColorVariant) return false;

      const sizeOption = sneakerColorVariant.sizeOptions?.find(
        (so: any) => so.size === selectedVariant.size
      );
      return sizeOption ? sizeOption.quantity > 0 : false;

    default:
      return product.inventory?.inStock || false;
  }
};

/**
 * Get variant price
 */
export const getVariantPrice = (product: any, selectedVariant: any): number => {
  if (!product || !selectedVariant) return product?.price || 0;

  let totalAdjustment = 0;

  switch (product.productType) {
    case 'iphone':
      const colorVariant = product.iphone?.colorVariants?.find(
        (cv: any) => cv.color === selectedVariant.color
      );
      if (colorVariant) {
        totalAdjustment += colorVariant.priceAdjustment || 0;

        const storageOption = colorVariant.storageOptions?.find(
          (so: any) => so.capacity === selectedVariant.storage
        );
        if (storageOption) {
          totalAdjustment += storageOption.storagePriceAdjustment || 0;

          const batteryGrade = storageOption.batteryGrades?.find(
            (bg: any) => bg.grade === selectedVariant.batteryGrade
          );
          if (batteryGrade) {
            totalAdjustment += batteryGrade.priceAdjustment || 0;
          }
        }
      }
      break;

    case 'sneaker':
      const sneakerColorVariant = product.sneaker?.colorVariants?.find(
        (cv: any) => cv.colorName === selectedVariant.color
      );
      if (sneakerColorVariant) {
        totalAdjustment += sneakerColorVariant.priceAdjustment || 0;

        const sizeOption = sneakerColorVariant.sizeOptions?.find(
          (so: any) => so.size === selectedVariant.size
        );
        if (sizeOption) {
          totalAdjustment += sizeOption.sizePriceAdjustment || 0;
        }
      }
      break;
  }

  return product.price + totalAdjustment;
};

// ============================================================================
// STRING & FORMATTING UTILITIES
// ============================================================================

/**
 * Generate slug from string
 */
export const generateSlug = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Format date
 */
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format datetime
 */
export const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleString('en-ZA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Validate email address
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate South African phone number
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^(\+27|0)[6-8][0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Validate South African postal code
 */
export const isValidPostalCode = (postalCode: string): boolean => {
  const postalCodeRegex = /^[0-9]{4}$/;
  return postalCodeRegex.test(postalCode);
};

// ============================================================================
// CART UTILITIES
// ============================================================================

/**
 * Generate unique session ID
 */
export const generateSessionId = (): string => {
  return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
};

/**
 * Add item to cart
 */
export const addToCart = (cart: any, product: any, quantity: number, selectedVariant: any = null) => {
  const existingItemIndex = cart.items?.findIndex((item: any) => 
    item.product._id === product._id && 
    JSON.stringify(item.selectedVariant) === JSON.stringify(selectedVariant)
  );

  const newCart = { ...cart };
  
  if (existingItemIndex >= 0) {
    // Update existing item
    newCart.items[existingItemIndex].quantity += quantity;
  } else {
    // Add new item
    const newItem = {
      _key: `item_${Date.now()}_${Math.random()}`,
      product: { _id: product._id },
      quantity,
      price: getVariantPrice(product, selectedVariant),
      selectedVariant,
      addedAt: new Date().toISOString(),
    };
    
    newCart.items = [...(cart.items || []), newItem];
  }

  // Update totals
  newCart.totals = calculateCartTotals(newCart.items, newCart.shipping?.price || 0);
  newCart.lastActivity = new Date().toISOString();

  return newCart;
};

/**
 * Remove item from cart
 */
export const removeFromCart = (cart: any, itemKey: string) => {
  const newCart = {
    ...cart,
    items: cart.items?.filter((item: any) => item._key !== itemKey) || [],
  };
  
  newCart.totals = calculateCartTotals(newCart.items, newCart.shipping?.price || 0);
  newCart.lastActivity = new Date().toISOString();
  
  return newCart;
};

/**
 * Update cart item quantity
 */
export const updateCartItemQuantity = (cart: any, itemKey: string, quantity: number) => {
  if (quantity <= 0) {
    return removeFromCart(cart, itemKey);
  }

  const newCart = {
    ...cart,
    items: cart.items?.map((item: any) => 
      item._key === itemKey ? { ...item, quantity } : item
    ) || [],
  };
  
  newCart.totals = calculateCartTotals(newCart.items, newCart.shipping?.price || 0);
  newCart.lastActivity = new Date().toISOString();
  
  return newCart;
};

// ============================================================================
// SEO & META UTILITIES
// ============================================================================

/**
 * Generate meta title
 */
export const generateMetaTitle = (title: string, siteTitle?: string): string => {
  if (siteTitle) {
    return `${title} | ${siteTitle}`;
  }
  return title;
};

/**
 * Generate meta description
 */
export const generateMetaDescription = (description: string, maxLength: number = 160): string => {
  if (description.length <= maxLength) return description;
  return truncateText(description, maxLength);
};

// ============================================================================
// PORTABLE TEXT RENDERER
// ============================================================================

/**
 * Portable Text components for rendering rich text
 * Note: These are component configurations, not actual JSX
 * Use these in your React components with PortableText
 */
export const portableTextComponents = {
  types: {
    image: ({ value }: any) => {
      // This should be used in a .tsx file with actual JSX
      // For now, return a configuration object
      return {
        type: 'image',
        src: value.asset?.url,
        alt: value.alt || '',
        className: 'max-w-full h-auto'
      };
    },
  },
  marks: {
    link: ({ children, value }: any) => {
      // This should be used in a .tsx file with actual JSX
      // For now, return a configuration object
      return {
        type: 'link',
        href: value.href,
        className: 'text-blue-600 hover:text-blue-800 underline',
        children
      };
    },
  },
};

/**
 * Render portable text
 * Note: This function should be used in a .tsx file
 * For .ts files, use the configuration objects above
 */
export const renderPortableText = (content: any) => {
  if (!content) return null;
  // In a .tsx file, you would use:
  // return <PortableText value={content} components={portableTextComponents} />;
  // For .ts files, return the content as-is
  return content;
};

// ============================================================================
// FILTERING & SORTING UTILITIES
// ============================================================================

/**
 * Filter products by various criteria
 */
export const filterProducts = (
  products: any[],
  filters: {
    category?: string;
    brand?: string;
    priceRange?: { min: number; max: number };
    inStock?: boolean;
    productType?: string;
  }
) => {
  return products.filter(product => {
    if (filters.category && !product.categories?.includes(filters.category)) {
      return false;
    }
    
    if (filters.brand && product.brand !== filters.brand) {
      return false;
    }
    
    if (filters.priceRange) {
      const price = product.price;
      if (price < filters.priceRange.min || price > filters.priceRange.max) {
        return false;
      }
    }
    
    if (filters.inStock !== undefined && product.inStock !== filters.inStock) {
      return false;
    }
    
    if (filters.productType && product.productType !== filters.productType) {
      return false;
    }
    
    return true;
  });
};

/**
 * Sort products
 */
export const sortProducts = (
  products: any[],
  sortBy: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'popularity' | 'newest'
) => {
  const sortedProducts = [...products];
  
  switch (sortBy) {
    case 'price_asc':
      return sortedProducts.sort((a, b) => a.price - b.price);
    case 'price_desc':
      return sortedProducts.sort((a, b) => b.price - a.price);
    case 'name_asc':
      return sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
    case 'name_desc':
      return sortedProducts.sort((a, b) => b.title.localeCompare(a.title));
    case 'popularity':
      return sortedProducts.sort((a, b) => (b.purchaseCount || 0) - (a.purchaseCount || 0));
    case 'newest':
      return sortedProducts.sort((a, b) => new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime());
    default:
      return sortedProducts;
  }
}; 