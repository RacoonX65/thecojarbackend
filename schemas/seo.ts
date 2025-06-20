import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'Title used for search engines and browsers. Recommended length: 50-60 characters',
      validation: (Rule) =>
        Rule.max(60).warning('Longer titles may be truncated by search engines'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description: 'Description for search engines. Recommended length: 50-160 characters',
      validation: (Rule) =>
        Rule.max(160).warning(
          'Longer descriptions may be truncated by search engines',
        ),
    }),
    defineField({
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
      description: 'Add keywords that describe your content',
    }),
    defineField({
      name: 'metaImage',
      title: 'Social Sharing Image',
      type: 'image',
      description:
        'Recommended size: 1200x630px. This image will be used when sharing on social media.',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines',
      type: 'boolean',
      description: 'Prevent this page from appearing in search results',
      initialValue: false,
    }),
  ],
})
