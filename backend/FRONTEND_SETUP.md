# Frontend Setup Guide for The Jar Co E-commerce

This guide will help you set up the frontend for The Jar Co e-commerce platform using the Sanity backend.

## 🚀 **Recommended Frontend Stack**

### **Primary Recommendation: Next.js 14 with App Router**
```bash
npx create-next-app@latest the-jar-co-frontend --typescript --tailwind --app --src-dir
```

**Why Next.js?**
- ✅ **SEO Optimized** - Perfect for e-commerce
- ✅ **Server-Side Rendering** - Better performance and SEO
- ✅ **Image Optimization** - Built-in with Next.js Image
- ✅ **API Routes** - Easy integration with Sanity
- ✅ **TypeScript Support** - Type safety
- ✅ **App Router** - Modern React patterns

### **Alternative Options:**
- **Nuxt.js 3** - If you prefer Vue.js
- **Remix** - Full-stack React framework
- **Astro** - For static-first approach

## 📦 **Essential Dependencies**

```bash
# Core dependencies
npm install @sanity/client @sanity/image-url next-sanity
npm install @portabletext/react @portabletext/types

# UI & Styling
npm install @headlessui/react @heroicons/react
npm install framer-motion
npm install clsx tailwind-merge

# Forms & Validation
npm install react-hook-form @hookform/resolvers zod
npm install react-hot-toast

# State Management
npm install zustand
npm install @tanstack/react-query

# Cart & Checkout
npm install js-cookie
npm install stripe @stripe/stripe-js

# Utilities
npm install date-fns
npm install lodash-es
npm install @types/lodash-es
```

## 🏗️ **Project Structure**

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── (shop)/            # Shop routes
│   ├── api/               # API routes
│   ├── cart/              # Cart pages
│   ├── checkout/          # Checkout flow
│   ├── products/          # Product pages
│   ├── categories/        # Category pages
│   ├── collections/       # Collection pages
│   ├── account/           # Customer account
│   ├── orders/            # Order history
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   ├── product/          # Product components
│   ├── cart/             # Cart components
│   ├── checkout/         # Checkout components
│   └── forms/            # Form components
├── lib/                  # Utility functions
│   ├── sanity.ts         # Sanity client
│   ├── queries.ts        # GROQ queries (from backend)
│   ├── utils.ts          # Utility functions (from backend)
│   ├── portableText.tsx  # Portable Text React components
│   ├── validations.ts    # Form validations
│   └── constants.ts      # App constants
├── hooks/                # Custom React hooks
├── stores/               # Zustand stores
├── types/                # TypeScript types
└── styles/               # Additional styles
```

## 🔧 **Environment Setup**

Create `.env.local`:
```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=gf16m01n
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-05-03
SANITY_API_TOKEN=your_write_token_here

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="The Jar Co"

# Payment (PayFast)
NEXT_PUBLIC_PAYFAST_MERCHANT_ID=your_merchant_id
PAYFAST_MERCHANT_KEY=your_merchant_key
PAYFAST_PASSPHRASE=your_passphrase

# Email (optional)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
```

## 🎯 **Key Features to Implement**

### **1. Product Catalog**
- [ ] Product listing with filters
- [ ] Product search
- [ ] Category/collection pages
- [ ] Product detail pages
- [ ] Related products
- [ ] Product reviews

### **2. Shopping Cart**
- [ ] Add/remove items
- [ ] Update quantities
- [ ] Variant selection (color, size, storage, battery)
- [ ] Cart persistence
- [ ] Cart sidebar/modal

### **3. Checkout Flow**
- [ ] Customer information
- [ ] Shipping address
- [ ] Shipping method selection
- [ ] Payment method selection
- [ ] Order review
- [ ] Order confirmation

### **4. Customer Account**
- [ ] Registration/login
- [ ] Order history
- [ ] Address management
- [ ] Wishlist
- [ ] Profile settings

### **5. Admin Features**
- [ ] Order management
- [ ] Inventory updates
- [ ] Customer management
- [ ] Analytics dashboard

## 🛠️ **Implementation Steps**

### **Step 1: Sanity Client Setup**

Create `src/lib/sanity.ts`:
```typescript
import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_TOKEN, // Only for write operations
});

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}
```

### **Step 2: Cart Store Setup**

Create `src/stores/cartStore.ts`:
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateSessionId, addToCart, removeFromCart, updateCartItemQuantity } from '@/lib/utils';

interface CartStore {
  sessionId: string;
  items: any[];
  totals: any;
  addItem: (product: any, quantity: number, variant?: any) => void;
  removeItem: (itemKey: string) => void;
  updateQuantity: (itemKey: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      sessionId: generateSessionId(),
      items: [],
      totals: { subtotal: 0, shipping: 0, tax: 0, discount: 0, total: 0 },
      
      addItem: (product, quantity, variant) => {
        const currentCart = get();
        const newCart = addToCart(currentCart, product, quantity, variant);
        set(newCart);
      },
      
      removeItem: (itemKey) => {
        const currentCart = get();
        const newCart = removeFromCart(currentCart, itemKey);
        set(newCart);
      },
      
      updateQuantity: (itemKey, quantity) => {
        const currentCart = get();
        const newCart = updateCartItemQuantity(currentCart, itemKey, quantity);
        set(newCart);
      },
      
      clearCart: () => {
        set({
          items: [],
          totals: { subtotal: 0, shipping: 0, tax: 0, discount: 0, total: 0 },
        });
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
```

### **Step 3: Product Components**

Create `src/components/product/ProductCard.tsx`:
```typescript
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice, calculateDiscountPercentage } from '@/lib/utils';

interface ProductCardProps {
  product: any;
}

export function ProductCard({ product }: ProductCardProps) {
  const discountPercentage = product.compareAtPrice 
    ? calculateDiscountPercentage(product.compareAtPrice, product.price)
    : 0;

  return (
    <div className="group relative">
      <Link href={`/products/${product.slug}`}>
        <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-200">
          <Image
            src={product.mainImage}
            alt={product.title}
            width={400}
            height={400}
            className="h-full w-full object-cover object-center group-hover:opacity-75"
          />
        </div>
        <div className="mt-4 flex justify-between">
          <div>
            <h3 className="text-sm text-gray-700">{product.title}</h3>
            <p className="mt-1 text-sm text-gray-500">{product.brand}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              {formatPrice(product.price)}
            </p>
            {discountPercentage > 0 && (
              <p className="text-sm text-gray-500 line-through">
                {formatPrice(product.compareAtPrice)}
              </p>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
```

### **Step 4: API Routes**

Create `src/app/api/products/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity';
import { getAllProductsQuery } from '@/lib/queries';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    let query = getAllProductsQuery;
    let params: any = {};

    if (category) {
      query = `*[_type == "product" && status == "active" && $categoryId in categories[]._ref] | order(_createdAt desc) [${(page - 1) * limit}...${page * limit}] {
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
      }`;
      params.categoryId = category;
    }

    if (search) {
      query = `*[_type == "product" && status == "active" && (
        title match $searchTerm + "*" ||
        brand->name match $searchTerm + "*" ||
        $searchTerm in tags
      )] | order(purchaseCount desc) [${(page - 1) * limit}...${page * limit}] {
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
      }`;
      params.searchTerm = search;
    }

    const products = await client.fetch(query, params);
    
    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
```

## 🎨 **UI/UX Recommendations**

### **Design System**
- Use **Tailwind CSS** for styling
- Implement **dark mode** support
- Use **Framer Motion** for animations
- Follow **mobile-first** design
- Implement **skeleton loading** states

### **Performance Optimizations**
- Use **Next.js Image** component
- Implement **infinite scroll** for product listings
- Use **React Query** for data fetching
- Implement **service worker** for offline support
- Use **lazy loading** for images

### **Accessibility**
- Follow **WCAG 2.1** guidelines
- Implement **keyboard navigation**
- Add **ARIA labels**
- Ensure **color contrast** compliance
- Test with **screen readers**

## 🔒 **Security Considerations**

### **Frontend Security**
- Validate all user inputs
- Sanitize data before rendering
- Use **CSP** headers
- Implement **rate limiting**
- Secure API endpoints

### **Payment Security**
- Never store payment data
- Use **PayFast** secure checkout
- Implement **webhook verification**
- Validate order data server-side

## 📱 **Mobile Optimization**

### **Progressive Web App (PWA)**
```bash
npm install next-pwa
```

### **Mobile Features**
- Touch-friendly buttons
- Swipe gestures
- Mobile-optimized images
- Fast loading times
- Offline functionality

## 🧪 **Testing Strategy**

### **Testing Tools**
```bash
npm install -D @testing-library/react @testing-library/jest-dom
npm install -D jest jest-environment-jsdom
npm install -D cypress
```

### **Test Coverage**
- Unit tests for utilities
- Component tests
- Integration tests
- E2E tests for checkout flow
- Performance testing

## 🚀 **Deployment**

### **Vercel (Recommended)**
```bash
npm install -g vercel
vercel
```

### **Environment Variables**
Set up environment variables in your deployment platform:
- Sanity project ID
- API tokens
- Payment credentials
- Email settings

## 📊 **Analytics & Monitoring**

### **Recommended Tools**
- **Google Analytics 4**
- **Google Tag Manager**
- **Hotjar** for user behavior
- **Sentry** for error tracking
- **Vercel Analytics**

## 🔄 **Next Steps**

1. **Set up the basic Next.js project**
2. **Configure Sanity client**
3. **Create basic product listing**
4. **Implement cart functionality**
5. **Build checkout flow**
6. **Add customer accounts**
7. **Implement payment processing**
8. **Add admin features**
9. **Optimize performance**
10. **Deploy and monitor**

## 📚 **Additional Resources**

- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [PayFast Integration Guide](https://developers.payfast.co.za/)
- [E-commerce Best Practices](https://web.dev/ecommerce/)

## 🆘 **Getting Help**

- Check the [API Reference](./API_REFERENCE.md)
- Review the [backend schemas](./schemas/)
- Join the Sanity community
- Contact the development team

---

**Happy coding! 🎉** 