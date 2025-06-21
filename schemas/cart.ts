import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'cart',
  title: 'Shopping Cart',
  type: 'document',
  fields: [
    defineField({
      name: 'sessionId',
      title: 'Session ID',
      type: 'string',
      description: 'Unique session identifier for guest carts',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'customer',
      title: 'Customer',
      type: 'reference',
      to: [{ type: 'customer' }],
      description: 'Customer reference (for logged-in users)',
    }),
    defineField({
      name: 'items',
      title: 'Cart Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'product',
              title: 'Product',
              type: 'reference',
              to: [{ type: 'product' }],
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'quantity',
              title: 'Quantity',
              type: 'number',
              validation: Rule => Rule.required().min(1),
              initialValue: 1,
            }),
            defineField({
              name: 'selectedVariant',
              title: 'Selected Variant',
              type: 'object',
              fields: [
                defineField({
                  name: 'color',
                  title: 'Color',
                  type: 'string',
                }),
                defineField({
                  name: 'size',
                  title: 'Size',
                  type: 'string',
                }),
                defineField({
                  name: 'storage',
                  title: 'Storage',
                  type: 'string',
                }),
                defineField({
                  name: 'batteryGrade',
                  title: 'Battery Grade',
                  type: 'string',
                }),
                defineField({
                  name: 'network',
                  title: 'Network',
                  type: 'string',
                }),
              ],
            }),
            defineField({
              name: 'price',
              title: 'Price at Time of Addition (ZAR)',
              type: 'number',
              description: 'Price when item was added to cart',
              validation: Rule => Rule.required().min(0),
            }),
            defineField({
              name: 'addedAt',
              title: 'Added At',
              type: 'datetime',
              readOnly: true,
              initialValue: () => new Date().toISOString(),
            }),
          ],
          preview: {
            select: {
              title: 'product.title',
              quantity: 'quantity',
              price: 'price',
              variant: 'selectedVariant',
            },
            prepare({ title, quantity, price, variant }) {
              const variantText = variant ? 
                Object.values(variant).filter(Boolean).join(', ') : '';
              return {
                title: `${quantity}x ${title}`,
                subtitle: `ZAR ${price}${variantText ? ` (${variantText})` : ''}`,
              };
            },
          },
        },
      ],
      validation: Rule => Rule.min(0),
    }),
    defineField({
      name: 'shippingMethod',
      title: 'Selected Shipping Method',
      type: 'reference',
      to: [{ type: 'shippingMethod' }],
    }),
    defineField({
      name: 'shippingAddress',
      title: 'Shipping Address',
      type: 'address',
    }),
    defineField({
      name: 'billingAddress',
      title: 'Billing Address',
      type: 'address',
    }),
    defineField({
      name: 'appliedCoupon',
      title: 'Applied Coupon',
      type: 'object',
      fields: [
        defineField({
          name: 'code',
          title: 'Coupon Code',
          type: 'string',
        }),
        defineField({
          name: 'discountAmount',
          title: 'Discount Amount (ZAR)',
          type: 'number',
        }),
        defineField({
          name: 'discountType',
          title: 'Discount Type',
          type: 'string',
          options: {
            list: [
              { title: 'Percentage', value: 'percentage' },
              { title: 'Fixed Amount', value: 'fixed' },
            ],
          },
        }),
      ],
    }),
    defineField({
      name: 'totals',
      title: 'Cart Totals',
      type: 'object',
      fields: [
        defineField({
          name: 'subtotal',
          title: 'Subtotal (ZAR)',
          type: 'number',
          readOnly: true,
          initialValue: 0,
        }),
        defineField({
          name: 'shipping',
          title: 'Shipping (ZAR)',
          type: 'number',
          readOnly: true,
          initialValue: 0,
        }),
        defineField({
          name: 'tax',
          title: 'Tax (ZAR)',
          type: 'number',
          readOnly: true,
          initialValue: 0,
        }),
        defineField({
          name: 'discount',
          title: 'Discount (ZAR)',
          type: 'number',
          readOnly: true,
          initialValue: 0,
        }),
        defineField({
          name: 'total',
          title: 'Total (ZAR)',
          type: 'number',
          readOnly: true,
          initialValue: 0,
        }),
      ],
    }),
    defineField({
      name: 'expiresAt',
      title: 'Expires At',
      type: 'datetime',
      description: 'When this cart expires (for guest carts)',
      initialValue: () => {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7); // 7 days from now
        return expiryDate.toISOString();
      },
    }),
    defineField({
      name: 'lastActivity',
      title: 'Last Activity',
      type: 'datetime',
      description: 'Last time cart was updated',
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      sessionId: 'sessionId',
      customerName: 'customer.name',
      itemCount: 'items.length',
      total: 'totals.total',
      lastActivity: 'lastActivity',
    },
    prepare({ sessionId, customerName, itemCount, total, lastActivity }) {
      const customer = customerName || `Guest (${sessionId?.slice(-8)})`;
      const lastActivityDate = lastActivity ? 
        new Date(lastActivity).toLocaleDateString() : 'Unknown';
      
      return {
        title: customer,
        subtitle: `${itemCount || 0} items • ZAR ${total || 0} • Last activity: ${lastActivityDate}`,
      };
    },
  },
  orderings: [
    {
      title: 'Most Recent Activity',
      name: 'lastActivityDesc',
      by: [{ field: 'lastActivity', direction: 'desc' }],
    },
    {
      title: 'Oldest Activity',
      name: 'lastActivityAsc',
      by: [{ field: 'lastActivity', direction: 'asc' }],
    },
  ],
}); 