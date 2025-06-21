import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'shippingMethod',
  title: 'Shipping Method',
  type: 'document',
  fields: [
    defineField({
      name: 'provider',
      title: 'Shipping Provider',
      type: 'string',
      options: {
        list: [
          { title: 'Paxi', value: 'paxi' },
          { title: 'Courier Guy', value: 'courier_guy' },
          { title: 'Cash on Delivery', value: 'cod' },
        ],
        layout: 'radio',
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Method Name',
      type: 'string',
      description: 'e.g., Paxi to Paxi Point, Courier Guy Standard, COD - Johannesburg Only',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'This will be shown to customers at checkout',
    }),
    defineField({
      name: 'price',
      title: 'Price (ZAR)',
      type: 'number',
      description: 'Delivery fee in ZAR',
      initialValue: 0,
    }),
    defineField({
      name: 'freeThreshold',
      title: 'Free Shipping Threshold (ZAR)',
      type: 'number',
      description: 'Order amount needed for free shipping (0 for no free shipping)',
      initialValue: 0,
    }),
    defineField({
      name: 'estimatedDelivery',
      title: 'Estimated Delivery Time',
      type: 'string',
      description: 'e.g., 2-3 business days',
      initialValue: '3-5 business days',
    }),
    defineField({
      name: 'serviceType',
      title: 'Service Type',
      type: 'string',
      description: 'Type of service (for Courier Guy: On Demand, Same Day, Overnight, etc.)',
      hidden: ({ parent }) => parent?.provider !== 'courier_guy',
    }),
    defineField({
      name: 'paxiPoint',
      title: 'Paxi Point Details',
      type: 'object',
      fields: [
        defineField({
          name: 'name',
          title: 'Point Name',
          type: 'string',
        }),
        defineField({
          name: 'address',
          title: 'Address',
          type: 'text',
        }),
        defineField({
          name: 'businessHours',
          title: 'Business Hours',
          type: 'string',
          initialValue: 'Mon-Fri 9am-5pm, Sat 9am-1pm',
        }),
      ],
      hidden: ({ parent }) => parent?.provider !== 'paxi',
    }),
    defineField({
      name: 'cashOnDeliveryAreas',
      title: 'Cash on Delivery Areas',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Johannesburg areas where COD is available',
      options: {
        layout: 'tags',
      },
      hidden: ({ parent }) => parent?.provider !== 'cod',
    }),
    defineField({
      name: 'codFee',
      title: 'Cash on Delivery Fee (ZAR)',
      type: 'number',
      description: 'Additional fee for cash on delivery orders',
      initialValue: 0,
      hidden: ({ parent }) => parent?.provider !== 'cod',
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Enable/disable this shipping method',
      initialValue: true,
    }),
    defineField({
      name: 'minOrderAmount',
      title: 'Minimum Order Amount (ZAR)',
      type: 'number',
      description: 'Minimum order amount for this shipping method',
      initialValue: 0,
    }),
    defineField({
      name: 'maxWeight',
      title: 'Maximum Weight (kg)',
      type: 'number',
      description: 'Maximum weight in kg for this shipping method',
      initialValue: 30,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      provider: 'provider',
      price: 'price',
      active: 'isActive',
    },
    prepare({ title, provider, price, active }) {
      const providerIcons = {
        paxi: '📦',
        courier_guy: '🚚',
        cod: '💵',
      };
      
      return {
        title: title || 'Untitled',
        subtitle: `${providerIcons[provider as keyof typeof providerIcons] || '📦'} ${provider?.replace('_', ' ').toUpperCase() || ''} • ${price === 0 ? 'Free' : `ZAR ${price}`} ${!active ? '• Inactive' : ''}`,
        media: active ? '✓' : '✗',
      };
    },
  },
});
