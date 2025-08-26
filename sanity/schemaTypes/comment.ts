import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'comment',
  title: 'Comentario',
  type: 'document',
  fields: [
    defineField({
      name: 'recipe',
      title: 'Receta',
      type: 'reference',
      to: {type: 'recipe'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'authorName',
      title: 'Nombre del autor',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'authorEmail',
      title: 'Email del autor',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'content',
      title: 'Comentario',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'rating',
      title: 'Valoración',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).max(5),
      options: {
        list: [
          {title: '⭐ 1 estrella', value: 1},
          {title: '⭐⭐ 2 estrellas', value: 2},
          {title: '⭐⭐⭐ 3 estrellas', value: 3},
          {title: '⭐⭐⭐⭐ 4 estrellas', value: 4},
          {title: '⭐⭐⭐⭐⭐ 5 estrellas', value: 5},
        ]
      }
    }),
    defineField({
      name: 'approved',
      title: 'Aprobado',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'createdAt',
      title: 'Fecha de creación',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
  ],
  orderings: [
    {
      title: 'Más recientes',
      name: 'createdAtDesc',
      by: [
        {field: 'createdAt', direction: 'desc'}
      ]
    }
  ],
  preview: {
    select: {
      title: 'authorName',
      subtitle: 'content',
      rating: 'rating',
      approved: 'approved'
    },
    prepare(selection) {
      const {title, subtitle, rating, approved} = selection
      const stars = '⭐'.repeat(rating)
      const status = approved ? '✅' : '⏳'
      return {
        title: `${title} ${stars}`,
        subtitle: `${status} ${subtitle?.substring(0, 60)}...`
      }
    }
  },
})