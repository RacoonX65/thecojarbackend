import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'sneakerAttributes',
  title: 'Sneaker Attributes',
  type: 'object',
  fields: [
    defineField({
      name: 'brand',
      title: 'Brand',
      type: 'reference',
      to: [{ type: 'brand' }],
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'model',
      title: 'Model',
      type: 'string',
      description: 'e.g., Air Jordan 1, Yeezy 350',
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'colorVariants',
      title: 'Color Variants',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'colorName',
              title: 'Color Name',
              type: 'string',
              description: 'e.g., Bred, University Blue',
              validation: (Rule: any) => Rule.required(),
            }),
            defineField({
              name: 'colorCode',
              title: 'Color Code',
              type: 'string',
              description: 'Hex color code (e.g., #FF0000 for red)',
              validation: (Rule: any) => 
                Rule.custom((color: string) => {
                  if (!color) return 'Color code is required';
                  if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
                    return 'Must be a valid hex color code (e.g., #FF0000)';
                  }
                  return true;
                })
            }),
            defineField({
              name: 'quantity',
              title: 'Total Quantity in Stock',
              type: 'number',
              description: 'Total quantity available across all sizes',
              initialValue: 0,
              validation: (Rule: any) => Rule.min(0).integer().required(),
            }),
            defineField({
              name: 'priceAdjustment',
              title: 'Price Adjustment (ZAR)',
              type: 'number',
              description: 'Additional amount to add to base price for this color',
              initialValue: 0,
            }),
            defineField({
              name: 'images',
              title: 'Color-Specific Images',
              type: 'array',
              of: [{ type: 'image' }],
              options: {
                layout: 'grid',
              },
            }),
            defineField({
              name: 'sizeOptions',
              title: 'Size Options & Inventory',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'size',
                      title: 'Size',
                      type: 'number',
                      description: 'South African sizing (UK)',
                      validation: (Rule: any) => Rule.min(1).max(20).precision(0.5).required(),
                    }),
                    defineField({
                      name: 'quantity',
                      title: 'Quantity in Stock',
                      type: 'number',
                      initialValue: 0,
                      validation: (Rule: any) => Rule.required().min(0).integer(),
                    }),
                    defineField({
                      name: 'sizePriceAdjustment',
                      title: 'Price Adjustment (ZAR)',
                      type: 'number',
                      description: 'Additional amount for this specific size',
                      initialValue: 0,
                    }),
                  ],
                  preview: {
                    select: {
                      size: 'size',
                      quantity: 'quantity',
                      adjustment: 'sizePriceAdjustment',
                    },
                    prepare: (selection: any) => {
                      const { size, quantity, adjustment } = selection;
                      const adjText = adjustment ? 
                        (adjustment > 0 ? ` (+R${adjustment})` : ` (R${adjustment})`) : '';
                      return {
                        title: `UK ${size}${adjText}`,
                        subtitle: `In stock: ${quantity}`,
                      };
                    },
                  },
                },
              ],
              validation: (Rule: any) => Rule.min(1).unique('size'),
            }),
          ],
          preview: {
            select: {
              title: 'colorName',
              color: 'colorCode',
              quantity: 'quantity',
              sizes: 'sizeOptions',
              media: 'images.0',
            },
            prepare: (selection: any) => {
              const { title, color, quantity, sizes = [], media } = selection;
              const sizeCount = sizes.length;
              const totalQty = sizes.reduce((sum: number, size: any) => sum + (size.quantity || 0), 0);
              
              return {
                title: title || 'Unnamed Color',
                subtitle: `${sizeCount} sizes, ${totalQty} total in stock`,
                media,
                style: {
                  borderLeft: `5px solid ${color || '#ccc'}`,
                  paddingLeft: '10px',
                },
              };
            },
          },
        },
      ],
      validation: (Rule: any) => Rule.min(1).unique('colorName'),
    }),
    defineField({
      name: 'sku',
      title: 'Base SKU',
      type: 'string',
      description: 'Base Stock Keeping Unit (color/size variants will have suffixes)',
    }),
    defineField({
      name: 'releaseDate',
      title: 'Release Date',
      type: 'date',
    }),
    defineField({
      name: 'gender',
      title: 'Gender',
      type: 'string',
      options: {
        list: [
          { title: 'Men', value: 'men' },
          { title: 'Women', value: 'women' },
          { title: 'Youth', value: 'youth' },
          { title: 'Kids', value: 'kids' },
          { title: 'Unisex', value: 'unisex' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'condition',
      title: 'Condition',
      type: 'string',
      options: {
        list: [
          { title: 'Deadstock (DS)', value: 'deadstock' },
          { title: 'New with Defects', value: 'new_with_defects' },
          { title: 'Used - Like New', value: 'used_like_new' },
          { title: 'Used - Good', value: 'used_good' },
          { title: 'Used - Fair', value: 'used_fair' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'deadstock',
    }),
    defineField({
      name: 'materials',
      title: 'Materials',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Key features like Air cushioning, Boost technology, etc.',
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'boxIncluded',
      title: 'Original Box Included',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'accessories',
      title: 'Included Accessories',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Dust Bag', value: 'dust_bag' },
          { title: 'Extra Laces', value: 'extra_laces' },
          { title: 'Shoe Trees', value: 'shoe_trees' },
          { title: 'Receipt', value: 'receipt' },
          { title: 'Authenticity Card', value: 'authenticity_card' },
        ],
        layout: 'grid',
      },
    }),
  ],
});
