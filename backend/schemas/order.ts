import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    defineField({
      name: 'orderNumber',
      title: 'Order Number',
      type: 'string',
      validation: Rule => Rule.required(),
      readOnly: true,
      initialValue: () => `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
    }),
    defineField({
      name: 'customer',
      title: 'Customer',
      type: 'reference',
      to: [{ type: 'customer' }],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Order Items',
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
              name: 'price',
              title: 'Price (ZAR)',
              type: 'number',
              validation: Rule => Rule.required().min(0),
            }),
            defineField({
              name: 'variant',
              title: 'Variant',
              type: 'string',
              description: 'Selected variant (if applicable)',
            }),
          ],
          preview: {
            select: {
              title: 'product.title',
              variant: 'variant',
              quantity: 'quantity',
              price: 'price',
            },
            prepare({ title, variant, quantity, price }) {
              return {
                title: `${quantity}x ${title}${variant ? ` (${variant})` : ''}`,
                subtitle: `ZAR ${price?.toFixed(2)} each`,
              };
            },
          },
        },
      ],
      validation: Rule => Rule.required().min(1),
    }),
    defineField({
      name: 'status',
      title: 'Order Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Processing', value: 'processing' },
          { title: 'Ready for Collection', value: 'ready_for_collection' },
          { title: 'Out for Delivery', value: 'out_for_delivery' },
          { title: 'Delivered', value: 'delivered' },
          { title: 'Collected', value: 'collected' },
          { title: 'Cancelled', value: 'cancelled' },
          { title: 'Refunded', value: 'refunded' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'pending',
    }),
    defineField({
      name: 'payment',
      title: 'Payment Information',
      type: 'object',
      fields: [
        defineField({
          name: 'method',
          title: 'Payment Method',
          type: 'reference',
          to: [{ type: 'paymentMethod' }],
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'status',
          title: 'Payment Status',
          type: 'string',
          options: {
            list: [
              { title: 'Pending', value: 'pending' },
              { title: 'Authorized', value: 'authorized' },
              { title: 'Paid', value: 'paid' },
              { title: 'Partially Refunded', value: 'partially_refunded' },
              { title: 'Refunded', value: 'refunded' },
              { title: 'Voided', value: 'voided' },
              { title: 'Failed', value: 'failed' },
            ],
            layout: 'dropdown',
          },
          initialValue: 'pending',
        }),
        defineField({
          name: 'transactionId',
          title: 'Transaction ID',
          type: 'string',
          description: 'Payment gateway transaction/reference number',
        }),
        defineField({
          name: 'proofOfPayment',
          title: 'Proof of Payment',
          type: 'file',
          description: 'Upload EFT payment confirmation',
          hidden: ({ parent }) => parent?.method?._ref !== 'paymentMethod.eft',
        }),
      ],
    }),
    defineField({
      name: 'shipping',
      title: 'Shipping Information',
      type: 'object',
      fields: [
        defineField({
          name: 'method',
          title: 'Shipping Method',
          type: 'reference',
          to: [{ type: 'shippingMethod' }],
        }),
        defineField({
          name: 'trackingNumber',
          title: 'Tracking Number',
          type: 'string',
        }),
        defineField({
          name: 'deliveryAddress',
          title: 'Delivery Address',
          type: 'object',
          fields: [
            defineField({
              name: 'street',
              type: 'string',
              title: 'Street Address',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'suburb',
              type: 'string',
              title: 'Suburb',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'city',
              type: 'string',
              title: 'City',
              initialValue: 'Johannesburg',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'postalCode',
              type: 'string',
              title: 'Postal Code',
              validation: Rule => Rule.required(),
            }),
          ],
          hidden: ({ parent }) => parent?.method?.type !== 'delivery',
        }),
        defineField({
          name: 'collectionPoint',
          title: 'Collection Point',
          type: 'reference',
          to: [{ type: 'shippingMethod' }],
          options: {
            filter: '_type == "shippingMethod" && type == "collection"',
          },
          hidden: ({ parent }) => parent?.method?.type !== 'collection',
        }),
      ],
    }),
    defineField({
      name: 'totals',
      title: 'Order Totals',
      type: 'object',
      fields: [
        defineField({
          name: 'subtotal',
          title: 'Subtotal (ZAR)',
          type: 'number',
          validation: Rule => Rule.required().min(0),
        }),
        defineField({
          name: 'shipping',
          title: 'Shipping (ZAR)',
          type: 'number',
          initialValue: 0,
        }),
        defineField({
          name: 'discount',
          title: 'Discount (ZAR)',
          type: 'number',
          initialValue: 0,
        }),
        defineField({
          name: 'tax',
          title: 'Tax (ZAR)',
          type: 'number',
          initialValue: 0,
        }),
        defineField({
          name: 'total',
          title: 'Total (ZAR)',
          type: 'number',
          validation: Rule => Rule.required().min(0),
        }),
      ],
    }),
    defineField({
      name: 'notes',
      title: 'Order Notes',
      type: 'text',
      rows: 3,
      description: 'Internal notes about this order',
    }),
    defineField({
      name: 'customerNotes',
      title: 'Customer Notes',
      type: 'text',
      rows: 2,
      description: 'Notes from the customer',
    }),
  ],
  preview: {
    select: {
      orderNumber: 'orderNumber',
      customerName: 'customer.name',
      status: 'status',
      total: 'totals.total',
      itemCount: 'items.length',
    },
    prepare({ orderNumber, customerName, status, total, itemCount }) {
      const statusLabels = {
        pending: '🟡 Pending',
        processing: '🔵 Processing',
        ready_for_collection: '🟠 Ready for Collection',
        out_for_delivery: '🚚 Out for Delivery',
        delivered: '✅ Delivered',
        collected: '✅ Collected',
        cancelled: '❌ Cancelled',
        refunded: '🔄 Refunded',
      };

      return {
        title: `#${orderNumber}`,
        subtitle: `${customerName || 'Guest'} • ${itemCount} item${itemCount !== 1 ? 's' : ''} • ZAR ${total?.toFixed(2)}`,
        description: statusLabels[status as keyof typeof statusLabels] || status,
      };
    },
  },
  orderings: [
    {
      title: 'Newest First',
      name: 'dateDesc',
      by: [{ field: '_createdAt', direction: 'desc' }],
    },
    {
      title: 'Oldest First',
      name: 'dateAsc',
      by: [{ field: '_createdAt', direction: 'asc' }],
    },
  ],
});
