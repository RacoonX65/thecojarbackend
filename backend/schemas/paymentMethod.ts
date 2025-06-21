import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'paymentMethod',
  title: 'Payment Method',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Payment Method Name',
      type: 'string',
      validation: Rule => Rule.required(),
      options: {
        list: [
          { title: 'PayFast', value: 'payfast' },
          { title: 'EFT', value: 'eft' },
          { title: 'Cash on Delivery', value: 'cod' },
        ],
        layout: 'radio',
        direction: 'horizontal'
      }
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Enable/disable this payment method',
      initialValue: true,
    }),
    defineField({
      name: 'description',
      title: 'Customer Description',
      type: 'text',
      description: 'This will be shown to customers at checkout',
    }),
    defineField({
      name: 'instructions',
      title: 'Payment Instructions',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Detailed instructions for customers (e.g., EFT banking details)',
      hidden: ({ parent }) => parent?.name !== 'eft',
    }),
    defineField({
      name: 'codFee',
      title: 'Cash on Delivery Fee (ZAR)',
      type: 'number',
      description: 'Additional fee for cash on delivery orders',
      hidden: ({ parent }) => parent?.name !== 'cod',
    }),
    defineField({
      name: 'minOrderAmount',
      title: 'Minimum Order Amount (ZAR)',
      type: 'number',
      description: 'Minimum order amount for this payment method (0 for no minimum)',
      initialValue: 0,
    }),
    defineField({
      name: 'availableForDelivery',
      title: 'Available for Delivery',
      type: 'boolean',
      description: 'Can be used for delivery orders',
      initialValue: true,
    }),
    defineField({
      name: 'availableForCollection',
      title: 'Available for Collection',
      type: 'boolean',
      description: 'Can be used for collection orders',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'description',
      active: 'isActive',
    },
    prepare({ title, subtitle, active }) {
      return {
        title: title ? title.charAt(0).toUpperCase() + title.slice(1) : 'No title',
        subtitle: active ? 'Active' : 'Inactive',
        media: active ? '✓' : '✗',
      };
    },
  },
});
