import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'product',
  title: 'Producto',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
    }),
    defineField({
      name: 'price',
      title: 'Precio',
      type: 'number',
    }),
    defineField({
      name: 'currency',
      title: 'Moneda',
      type: 'string',
      initialValue: 'EUR',
    }),
    defineField({
      name: 'image',
      title: 'Imagen',
      type: 'image',
    }),
    defineField({
      name: 'amazonUrl',
      title: 'URL de Amazon',
      type: 'url',
    }),
    defineField({
      name: 'featured',
      title: 'Destacado',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'price',
      media: 'image',
    },
  },
})