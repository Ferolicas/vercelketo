import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'comment',
  title: 'Comentario',
  type: 'document',
  fields: [
    defineField({
      name: 'postSlug',
      title: 'Slug del Post',
      type: 'string',
      description: 'Slug de la receta o post al que pertenece el comentario',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'postTitle',
      title: 'Título del Post',
      type: 'string',
      description: 'Título de la receta o post para referencia',
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
      name: 'authorId',
      title: 'ID del autor',
      type: 'string',
      description: 'ID único del autor para permitir edición/eliminación',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Comentario',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().min(4),
    }),
    defineField({
      name: 'rating',
      title: 'Valoración',
      type: 'number',
      validation: (Rule) => Rule.min(1).max(5),
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
      name: 'parentComment',
      title: 'Comentario padre',
      type: 'reference',
      to: {type: 'comment'},
      description: 'Referencia al comentario al que responde (para respuestas)',
    }),
    defineField({
      name: 'approved',
      title: 'Aprobado',
      type: 'boolean',
      initialValue: true,
      description: 'Los comentarios se aprueban automáticamente',
    }),
    defineField({
      name: 'isEdited',
      title: 'Editado',
      type: 'boolean',
      initialValue: false,
      description: 'Marca si el comentario ha sido editado',
    }),
    defineField({
      name: 'isDeleted',
      title: 'Eliminado',
      type: 'boolean',
      initialValue: false,
      description: 'Marca si el comentario ha sido eliminado (soft delete)',
    }),
    defineField({
      name: 'adminReply',
      title: 'Respuesta del admin',
      type: 'text',
      description: 'Respuesta oficial de Planeta Keto',
    }),
    defineField({
      name: 'adminReplyPublished',
      title: 'Respuesta del admin publicada',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'adminReplyDate',
      title: 'Fecha respuesta admin',
      type: 'datetime',
    }),
    defineField({
      name: 'createdAt',
      title: 'Fecha de creación',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Fecha de actualización',
      type: 'datetime',
    }),
  ],
  orderings: [
    {
      title: 'Más recientes',
      name: 'createdAtDesc',
      by: [
        {field: 'createdAt', direction: 'desc'}
      ]
    },
    {
      title: 'Por post',
      name: 'byPost',
      by: [
        {field: 'postSlug', direction: 'asc'},
        {field: 'createdAt', direction: 'desc'}
      ]
    }
  ],
  preview: {
    select: {
      title: 'authorName',
      subtitle: 'content',
      rating: 'rating',
      approved: 'approved',
      isDeleted: 'isDeleted',
      postTitle: 'postTitle'
    },
    prepare(selection) {
      const {title, subtitle, rating, approved, isDeleted, postTitle} = selection
      const stars = rating ? '⭐'.repeat(rating) : ''
      const status = isDeleted ? '🗑️' : (approved ? '✅' : '⏳')
      return {
        title: `${title} ${stars} → ${postTitle}`,
        subtitle: `${status} ${subtitle?.substring(0, 60)}...`
      }
    }
  },
})