import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'coupon',
  title: 'Coupon/Discount Code',
  type: 'document',
  fields: [
    defineField({
      name: 'code',
      title: 'Coupon Code',
      type: 'string',
      description: 'The code customers will enter (e.g., SAVE20, WELCOME10)',
      validation: Rule => Rule.required().uppercase(),
    }),
    defineField({
      name: 'title',
      title: 'Coupon Title',
      type: 'string',
      description: 'Display name for the coupon (e.g., "20% Off All iPhones")',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      description: 'Brief description of what this coupon offers',
    }),
    defineField({
      name: 'discountType',
      title: 'Discount Type',
      type: 'string',
      options: {
        list: [
          { title: 'Percentage Off', value: 'percentage' },
          { title: 'Fixed Amount Off', value: 'fixed' },
          { title: 'Free Shipping', value: 'free_shipping' },
        ],
        layout: 'radio',
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'discountValue',
      title: 'Discount Value',
      type: 'number',
      description: 'Percentage (e.g., 20 for 20%) or fixed amount in ZAR',
      validation: Rule => Rule.required().min(0),
      hidden: ({ parent }) => parent?.discountType === 'free_shipping',
    }),
    defineField({
      name: 'minimumOrderAmount',
      title: 'Minimum Order Amount (ZAR)',
      type: 'number',
      description: 'Minimum order value required to use this coupon',
      initialValue: 0,
    }),
    defineField({
      name: 'maximumDiscount',
      title: 'Maximum Discount (ZAR)',
      type: 'number',
      description: 'Maximum discount amount (for percentage coupons)',
      hidden: ({ parent }) => parent?.discountType !== 'percentage',
    }),
    defineField({
      name: 'applicableProducts',
      title: 'Applicable Products',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'product' }],
        },
      ],
      description: 'Leave empty to apply to all products',
    }),
    defineField({
      name: 'applicableCategories',
      title: 'Applicable Categories',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'category' }],
        },
      ],
      description: 'Leave empty to apply to all categories',
    }),
    defineField({
      name: 'excludedProducts',
      title: 'Excluded Products',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'product' }],
        },
      ],
      description: 'Products that cannot use this coupon',
    }),
    defineField({
      name: 'usageLimit',
      title: 'Usage Limit',
      type: 'number',
      description: 'Total number of times this coupon can be used (0 = unlimited)',
      initialValue: 0,
    }),
    defineField({
      name: 'usageCount',
      title: 'Times Used',
      type: 'number',
      description: 'Number of times this coupon has been used',
      readOnly: true,
      initialValue: 0,
    }),
    defineField({
      name: 'perCustomerLimit',
      title: 'Per Customer Limit',
      type: 'number',
      description: 'How many times each customer can use this coupon (0 = unlimited)',
      initialValue: 1,
    }),
    defineField({
      name: 'validFrom',
      title: 'Valid From',
      type: 'datetime',
      description: 'When this coupon becomes active',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'validUntil',
      title: 'Valid Until',
      type: 'datetime',
      description: 'When this coupon expires',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Enable/disable this coupon',
      initialValue: true,
    }),
    defineField({
      name: 'isPublic',
      title: 'Public Coupon',
      type: 'boolean',
      description: 'Show this coupon on the website for customers to find',
      initialValue: false,
    }),
    defineField({
      name: 'customerGroups',
      title: 'Customer Groups',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'New Customers', value: 'new_customers' },
          { title: 'Returning Customers', value: 'returning_customers' },
          { title: 'VIP Customers', value: 'vip_customers' },
        ],
      },
      description: 'Leave empty to apply to all customer groups',
    }),
    defineField({
      name: 'firstTimeOnly',
      title: 'First Time Customers Only',
      type: 'boolean',
      description: 'Only allow customers who have never placed an order',
      initialValue: false,
    }),
    defineField({
      name: 'combineWithOtherOffers',
      title: 'Can Combine with Other Offers',
      type: 'boolean',
      description: 'Allow this coupon to be used with other discounts',
      initialValue: false,
    }),
    defineField({
      name: 'notes',
      title: 'Internal Notes',
      type: 'text',
      rows: 3,
      description: 'Internal notes about this coupon (not visible to customers)',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      code: 'code',
      discountType: 'discountType',
      discountValue: 'discountValue',
      isActive: 'isActive',
      validUntil: 'validUntil',
      usageCount: 'usageCount',
      usageLimit: 'usageLimit',
    },
    prepare({ title, code, discountType, discountValue, isActive, validUntil, usageCount, usageLimit }) {
      const discountText = discountType === 'percentage' 
        ? `${discountValue}% off`
        : discountType === 'fixed'
        ? `R${discountValue} off`
        : 'Free shipping';
      
      const usageText = usageLimit > 0 
        ? `${usageCount}/${usageLimit} used`
        : `${usageCount} used`;
      
      const isExpired = validUntil && new Date(validUntil) < new Date();
      
      return {
        title: `${code} - ${title}`,
        subtitle: `${discountText} • ${usageText} • ${isActive && !isExpired ? 'Active' : 'Inactive'}`,
        media: isActive && !isExpired ? '✅' : '❌',
      };
    },
  },
  orderings: [
    {
      title: 'Code (A-Z)',
      name: 'codeAsc',
      by: [{ field: 'code', direction: 'asc' }],
    },
    {
      title: 'Most Used',
      name: 'usageDesc',
      by: [{ field: 'usageCount', direction: 'desc' }],
    },
    {
      title: 'Newest First',
      name: 'createdDesc',
      by: [{ field: '_createdAt', direction: 'desc' }],
    },
  ],
}); 