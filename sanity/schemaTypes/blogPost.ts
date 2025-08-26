import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'blogPost',
  title: 'Artículo del Blog',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Resumen',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'content',
      title: 'Contenido',
      type: 'text',
    }),
    defineField({
      name: 'image',
      title: 'Imagen principal',
      type: 'image',
    }),
    defineField({
      name: 'author',
      title: 'Autor',
      type: 'string',
      initialValue: 'Planeta Keto',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Fecha de publicación',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
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
      title: 'title',
      author: 'author',
      media: 'image',
    },
  },
})