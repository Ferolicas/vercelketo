import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'forumPost',
  title: 'Post del Foro',
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
      name: 'content',
      title: 'Contenido',
      type: 'text',
    }),
    defineField({
      name: 'author',
      title: 'Autor',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email del autor',
      type: 'email',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Fecha de publicación',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'approved',
      title: 'Aprobado',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author',
    },
  },
})