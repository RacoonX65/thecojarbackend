import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'reviewComment',
  title: 'Review Comment',
  type: 'document',
  fields: [
    defineField({
      name: 'review',
      title: 'Review',
      type: 'reference',
      to: [{type: 'review'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'customer',
      title: 'Commenter',
      type: 'reference',
      to: [{type: 'customer'}],
      description: 'Customer who left the comment',
    }),
    defineField({
      name: 'guestName',
      title: 'Guest Name',
      type: 'string',
      description: 'Only required if comment is from a guest',
    }),
    defineField({
      name: 'comment',
      title: 'Comment',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isAdmin',
      title: 'Is Admin Comment',
      type: 'boolean',
      description: 'Is this comment from an admin?',
      initialValue: false,
    }),
    defineField({
      name: 'isHelpful',
      title: 'Marked as Helpful',
      type: 'boolean',
      description: 'Was this comment marked as helpful?',
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
      description: 'Approve this comment to make it visible on the site',
      initialValue: true,
    }),
    defineField({
      name: 'reportedCount',
      title: 'Reported Count',
      type: 'number',
      description: 'Number of times this comment was reported',
      readOnly: true,
      initialValue: 0,
    }),
    defineField({
      name: 'reports',
      title: 'Reports',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'reason',
              title: 'Reason',
              type: 'string',
              options: {
                list: [
                  {title: 'Spam', value: 'spam'},
                  {title: 'Inappropriate', value: 'inappropriate'},
                  {title: 'Offensive', value: 'offensive'},
                  {title: 'Other', value: 'other'},
                ],
              },
            },
            {
              name: 'details',
              title: 'Details',
              type: 'text',
              rows: 2,
            },
            {
              name: 'reportedAt',
              title: 'Reported At',
              type: 'datetime',
              readOnly: true,
            },
            {
              name: 'reportedBy',
              title: 'Reported By',
              type: 'reference',
              to: [{type: 'customer'}],
            },
          ],
        },
      ],
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      comment: 'comment',
      review: 'review.title',
      customer: 'customer.name',
      guestName: 'guestName',
      isApproved: 'isApproved',
    },
    prepare(selection) {
      const {comment, review, customer, guestName, isApproved} = selection
      const name = customer || guestName || 'Anonymous'
      const commentPreview = comment?.substring(0, 50) + (comment?.length > 50 ? '...' : '')
      
      return {
        title: `Comment on "${review}"`,
        subtitle: `${name}: ${commentPreview} ${!isApproved ? '(Pending Approval)' : ''}`,
      }
    },
  },
})
