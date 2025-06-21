import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Site Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'logo',
      title: 'Site Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
    }),
    defineField({
      name: 'business',
      title: 'Business Information',
      type: 'object',
      fields: [
        defineField({
          name: 'name',
          title: 'Business Name',
          type: 'string',
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'phone',
          title: 'Phone Number',
          type: 'string',
        }),
        defineField({
          name: 'email',
          title: 'Email',
          type: 'email',
        }),
        defineField({
          name: 'address',
          title: 'Business Address',
          type: 'text',
          rows: 3,
        }),
        defineField({
          name: 'vatNumber',
          title: 'VAT Number',
          type: 'string',
        }),
        defineField({
          name: 'businessHours',
          title: 'Business Hours',
          type: 'text',
          rows: 2,
        }),
      ],
    }),
    defineField({
      name: 'social',
      title: 'Social Media',
      type: 'object',
      fields: [
        defineField({
          name: 'facebook',
          title: 'Facebook URL',
          type: 'url',
        }),
        defineField({
          name: 'instagram',
          title: 'Instagram URL',
          type: 'url',
        }),
        defineField({
          name: 'twitter',
          title: 'Twitter URL',
          type: 'url',
        }),
        defineField({
          name: 'whatsapp',
          title: 'WhatsApp Number',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'navigation',
      title: 'Navigation',
      type: 'object',
      fields: [
        defineField({
          name: 'mainMenu',
          title: 'Main Menu Items',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({
                  name: 'title',
                  title: 'Menu Title',
                  type: 'string',
                  validation: Rule => Rule.required(),
                }),
                defineField({
                  name: 'link',
                  title: 'Link',
                  type: 'string',
                  description: 'Internal link (e.g., /products) or external URL',
                }),
                defineField({
                  name: 'category',
                  title: 'Category',
                  type: 'reference',
                  to: [{ type: 'category' }],
                  description: 'Link to a category page',
                }),
                defineField({
                  name: 'collection',
                  title: 'Collection',
                  type: 'reference',
                  to: [{ type: 'collection' }],
                  description: 'Link to a collection page',
                }),
                defineField({
                  name: 'isExternal',
                  title: 'External Link',
                  type: 'boolean',
                  initialValue: false,
                }),
                defineField({
                  name: 'children',
                  title: 'Submenu Items',
                  type: 'array',
                  of: [
                    {
                      type: 'object',
                      fields: [
                        defineField({
                          name: 'title',
                          title: 'Submenu Title',
                          type: 'string',
                        }),
                        defineField({
                          name: 'link',
                          title: 'Link',
                          type: 'string',
                        }),
                        defineField({
                          name: 'category',
                          title: 'Category',
                          type: 'reference',
                          to: [{ type: 'category' }],
                        }),
                      ],
                    },
                  ],
                }),
              ],
            },
          ],
        }),
        defineField({
          name: 'footerLinks',
          title: 'Footer Links',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({
                  name: 'title',
                  title: 'Link Title',
                  type: 'string',
                }),
                defineField({
                  name: 'link',
                  title: 'Link',
                  type: 'string',
                }),
              ],
            },
          ],
        }),
      ],
    }),
    defineField({
      name: 'checkout',
      title: 'Checkout Settings',
      type: 'object',
      fields: [
        defineField({
          name: 'termsAndConditions',
          title: 'Terms & Conditions',
          type: 'array',
          of: [{ type: 'block' }],
        }),
        defineField({
          name: 'privacyPolicy',
          title: 'Privacy Policy',
          type: 'array',
          of: [{ type: 'block' }],
        }),
        defineField({
          name: 'returnPolicy',
          title: 'Return Policy',
          type: 'array',
          of: [{ type: 'block' }],
        }),
        defineField({
          name: 'shippingPolicy',
          title: 'Shipping Policy',
          type: 'array',
          of: [{ type: 'block' }],
        }),
        defineField({
          name: 'minimumOrderAmount',
          title: 'Minimum Order Amount (ZAR)',
          type: 'number',
          initialValue: 0,
        }),
        defineField({
          name: 'freeShippingThreshold',
          title: 'Free Shipping Threshold (ZAR)',
          type: 'number',
          initialValue: 0,
        }),
      ],
    }),
    defineField({
      name: 'seo',
      title: 'Default SEO',
      type: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      businessName: 'business.name',
    },
    prepare({ title, businessName }) {
      return {
        title: title || businessName || 'Site Settings',
        subtitle: 'Global site configuration',
      };
    },
  },
}); 