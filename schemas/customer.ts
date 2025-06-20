import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'customer',
  title: 'Customer',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
    }),
    defineField({
      name: 'billingAddress',
      title: 'Billing Address',
      type: 'object',
      fields: [
        defineField({
          name: 'street',
          type: 'string',
          title: 'Street',
        }),
        defineField({
          name: 'city',
          type: 'string',
          title: 'City',
        }),
        defineField({
          name: 'state',
          type: 'string',
          title: 'State/Province',
        }),
        defineField({
          name: 'postalCode',
          type: 'string',
          title: 'ZIP/Postal Code',
        }),
        defineField({
          name: 'country',
          type: 'string',
          title: 'Country',
        }),
      ],
    }),
    defineField({
      name: 'shippingAddress',
      title: 'Shipping Address',
      type: 'object',
      fields: [
        defineField({
          name: 'street',
          type: 'string',
          title: 'Street',
        }),
        defineField({
          name: 'city',
          type: 'string',
          title: 'City',
        }),
        defineField({
          name: 'state',
          type: 'string',
          title: 'State/Province',
        }),
        defineField({
          name: 'postalCode',
          type: 'string',
          title: 'ZIP/Postal Code',
        }),
        defineField({
          name: 'country',
          type: 'string',
          title: 'Country',
        }),
      ],
    }),
    defineField({
      name: 'additionalAddresses',
      title: 'Additional Addresses',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'nickname',
              type: 'string',
              title: 'Nickname (e.g., Work, Home)',
            }),
            defineField({
              name: 'street',
              type: 'string',
              title: 'Street',
            }),
            defineField({
              name: 'city',
              type: 'string',
              title: 'City',
            }),
            defineField({
              name: 'state',
              type: 'string',
              title: 'State/Province',
            }),
            defineField({
              name: 'postalCode',
              type: 'string',
              title: 'ZIP/Postal Code',
            }),
            defineField({
              name: 'country',
              type: 'string',
              title: 'Country',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'orders',
      title: 'Order History',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'order'}]}],
      readOnly: true,
    }),
    defineField({
      name: 'wishlist',
      title: 'Wishlist',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'product'}]}],
    }),
    defineField({
      name: 'loyaltyPoints',
      title: 'Loyalty Points',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'notes',
      title: 'Customer Notes',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'isActive',
      title: 'Active Customer',
      type: 'boolean',
      description: 'Is this an active customer?',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'email',
    },
  },
})
