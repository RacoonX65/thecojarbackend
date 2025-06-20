import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  icon: () => '📦',
  fields: [
    defineField({
      name: 'productType',
      title: 'Product Type',
      type: 'string',
      options: {
        list: [
          { title: 'Sneaker', value: 'sneaker' },
          { title: 'iPhone', value: 'iphone' },
          { title: 'Accessory', value: 'accessory' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading', value: 'h3' },
          ],
          lists: [{ title: 'Bullet', value: 'bullet' }],
        },
      ],
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Additional Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
    }),
    defineField({
      name: 'price',
      title: 'Price (ZAR)',
      type: 'number',
      validation: Rule => Rule.required().min(0),
    }),
    defineField({
      name: 'compareAtPrice',
      title: 'Compare at Price (ZAR)',
      type: 'number',
      description: 'Original price before discount (leave empty if not on sale)',
      validation: Rule => Rule.min(0),
    }),
    defineField({
      name: 'sku',
      title: 'SKU',
      type: 'string',
      description: 'Stock Keeping Unit',
    }),
    defineField({
      name: 'barcode',
      title: 'Barcode',
      type: 'string',
      description: 'EAN, UPC, or other barcode',
    }),
    defineField({
      name: 'inventory',
      title: 'Inventory',
      type: 'object',
      fields: [
        defineField({
          name: 'trackQuantity',
          title: 'Track Quantity',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'quantity',
          title: 'Quantity',
          type: 'number',
          initialValue: 0,
          hidden: ({ parent }) => !parent?.trackQuantity,
        }),
        defineField({
          name: 'allowBackorder',
          title: 'Allow Backorder',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'inStock',
          title: 'In Stock',
          type: 'boolean',
          initialValue: true,
          description: 'Override stock status',
        }),
      ],
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'sneaker',
      title: 'Sneaker Details',
      type: 'sneakerAttributes',
      hidden: ({ parent }) => parent?.productType !== 'sneaker',
    }),
    defineField({
      name: 'iphone',
      title: 'iPhone Details',
      type: 'iphoneAttributes',
      hidden: ({ parent }) => parent?.productType !== 'iphone',
    }),
    defineField({
      name: 'accessory',
      title: 'Accessory Details',
      type: 'accessoryAttributes',
      hidden: ({ parent }) => parent?.productType !== 'accessory',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Active', value: 'active' },
          { title: 'Archived', value: 'archived' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'draft',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      productType: 'productType',
      media: 'mainImage',
      price: 'price',
      status: 'status',
    },
    prepare(selection) {
      const { title, productType, media, price, status } = selection;
      
      const typeIcons = {
        sneaker: '👟',
        iphone: '📱',
        accessory: '📦',
      };
      
      const statusIcons = {
        draft: '📝',
        active: '✅',
        archived: '🗄️',
      };
      
      return {
        title: title || 'Untitled',
        subtitle: `${typeIcons[productType as keyof typeof typeIcons] || '📦'} ${productType ? productType.charAt(0).toUpperCase() + productType.slice(1) : 'Product'} • ZAR ${price || 0} • ${statusIcons[status as keyof typeof statusIcons] || ''} ${status || ''}`,
        media,
      };
    },
  },
  orderings: [
    {
      title: 'Title (A-Z)',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
    {
      title: 'Title (Z-A)',
      name: 'titleDesc',
      by: [{ field: 'title', direction: 'desc' }],
    },
    {
      title: 'Price (High to Low)',
      name: 'priceDesc',
      by: [{ field: 'price', direction: 'desc' }],
    },
    {
      title: 'Price (Low to High)',
      name: 'priceAsc',
      by: [{ field: 'price', direction: 'asc' }],
    },
  ],
});
