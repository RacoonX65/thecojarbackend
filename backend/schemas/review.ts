import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'review',
  title: 'Product Review',
  type: 'document',
  fields: [
    defineField({
      name: 'product',
      title: 'Product',
      type: 'reference',
      to: [{type: 'product'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'customer',
      title: 'Customer',
      type: 'reference',
      to: [{type: 'customer'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      options: {
        list: [
          {title: '1 Star', value: 1},
          {title: '2 Stars', value: 2},
          {title: '3 Stars', value: 3},
          {title: '4 Stars', value: 4},
          {title: '5 Stars', value: 5},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      validation: (Rule) =>
        Rule.required().min(1).max(5).error('Rating must be between 1 and 5'),
    }),
    defineField({
      name: 'title',
      title: 'Review Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'comment',
      title: 'Review Comment',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Review Images',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
    }),
    defineField({
      name: 'verifiedPurchase',
      title: 'Verified Purchase',
      type: 'boolean',
      description: 'Was this review from a verified purchase?',
      initialValue: false,
    }),
    defineField({
      name: 'helpfulCount',
      title: 'Helpful Count',
      type: 'number',
      readOnly: true,
      initialValue: 0,
    }),
    defineField({
      name: 'notHelpfulCount',
      title: 'Not Helpful Count',
      type: 'number',
      readOnly: true,
      initialValue: 0,
    }),
    defineField({
      name: 'isApproved',
      title: 'Approved',
      type: 'boolean',
      description: 'Approve this review to make it visible on the site',
      initialValue: false,
    }),
    defineField({
      name: 'adminResponse',
      title: 'Admin Response',
      type: 'object',
      fields: [
        {
          name: 'response',
          title: 'Response',
          type: 'text',
          rows: 3,
        },
        {
          name: 'respondedAt',
          title: 'Responded At',
          type: 'datetime',
          readOnly: true,
        },
        {
          name: 'adminUser',
          title: 'Admin User',
          type: 'string',
          readOnly: true,
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      product: 'product.title',
      rating: 'rating',
      customer: 'customer.name',
    },
    prepare(selection) {
      const {title, product, rating, customer} = selection
      return {
        title: title,
        subtitle: `${product} - ${rating}★ by ${customer}`,
      }
    },
  },
})
