import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'address',
  title: 'Address',
  type: 'object',
  fields: [
    defineField({
      name: 'type',
      title: 'Address Type',
      type: 'string',
      options: {
        list: [
          {title: 'Home', value: 'home'},
          {title: 'Work', value: 'work'},
          {title: 'Other', value: 'other'},
        ],
        layout: 'radio',
      },
      initialValue: 'home',
    }),
    defineField({
      name: 'firstName',
      title: 'First Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'lastName',
      title: 'Last Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'company',
      title: 'Company',
      type: 'string',
    }),
    defineField({
      name: 'street',
      title: 'Street Address',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'apartment',
      title: 'Apartment, suite, etc.',
      type: 'string',
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'state',
      title: 'State/Province',
      type: 'string',
    }),
    defineField({
      name: 'postalCode',
      title: 'Postal Code',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
    }),
    defineField({
      name: 'isDefault',
      title: 'Set as default address',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'street',
      subtitle: 'city',
      type: 'type',
    },
    prepare(selection) {
      const {title, subtitle, type} = selection
      const typeMap = {
        home: '🏠 Home',
        work: '💼 Work',
        other: '📍 Other',
      }
      return {
        title: title,
        subtitle: `${subtitle} • ${typeMap[type as keyof typeof typeMap] || type}`,
      }
    },
  },
})
