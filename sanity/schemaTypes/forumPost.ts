import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'forumPost',
  title: 'Publicación del Foro',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (Rule) => Rule.required().max(200),
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
      rows: 6,
      validation: (Rule) => Rule.required().min(10).max(5000),
    }),
    defineField({
      name: 'authorName',
      title: 'Nombre del autor',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
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
      name: 'category',
      title: 'Categoría',
      type: 'string',
      options: {
        list: [
          {title: '🌱 Principiantes', value: 'principiantes'},
          {title: '🎉 Testimonios', value: 'testimonios'},
          {title: '👩‍🍳 Recetas', value: 'recetas'},
          {title: '❓ Dudas', value: 'dudas'},
          {title: '💪 Ejercicio', value: 'ejercicio'},
          {title: '🛒 Productos', value: 'productos'},
        ]
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Etiquetas',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'isPinned',
      title: 'Fijado',
      type: 'boolean',
      initialValue: false,
      description: 'Publicaciones fijadas aparecen al inicio',
    }),
    defineField({
      name: 'isLocked',
      title: 'Bloqueado',
      type: 'boolean',
      initialValue: false,
      description: 'Las publicaciones bloqueadas no permiten respuestas',
    }),
    defineField({
      name: 'approved',
      title: 'Aprobado',
      type: 'boolean',
      initialValue: true,
      description: 'Los posts se aprueban automáticamente',
    }),
    defineField({
      name: 'isEdited',
      title: 'Editado',
      type: 'boolean',
      initialValue: false,
      description: 'Marca si el post ha sido editado',
    }),
    defineField({
      name: 'isDeleted',
      title: 'Eliminado',
      type: 'boolean',
      initialValue: false,
      description: 'Marca si el post ha sido eliminado (soft delete)',
    }),
    defineField({
      name: 'views',
      title: 'Visualizaciones',
      type: 'number',
      initialValue: 0,
      description: 'Contador de vistas del post',
    }),
    defineField({
      name: 'likes',
      title: 'Me gusta',
      type: 'number',
      initialValue: 0,
      description: 'Contador de likes del post',
    }),
    defineField({
      name: 'replyCount',
      title: 'Número de respuestas',
      type: 'number',
      initialValue: 0,
      description: 'Contador automático de respuestas',
    }),
    defineField({
      name: 'lastActivityAt',
      title: 'Última actividad',
      type: 'datetime',
      description: 'Fecha de la última respuesta o actualización',
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
      title: 'Fijados primero',
      name: 'pinnedFirst',
      by: [
        {field: 'isPinned', direction: 'desc'},
        {field: 'lastActivityAt', direction: 'desc'},
        {field: 'createdAt', direction: 'desc'}
      ]
    },
    {
      title: 'Más recientes',
      name: 'createdAtDesc',
      by: [
        {field: 'createdAt', direction: 'desc'}
      ]
    },
    {
      title: 'Más activos',
      name: 'mostActive',
      by: [
        {field: 'replyCount', direction: 'desc'},
        {field: 'lastActivityAt', direction: 'desc'}
      ]
    },
    {
      title: 'Más vistos',
      name: 'mostViewed',
      by: [
        {field: 'views', direction: 'desc'}
      ]
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'authorName',
      category: 'category',
      isPinned: 'isPinned',
      approved: 'approved',
      isDeleted: 'isDeleted',
      replyCount: 'replyCount',
      views: 'views'
    },
    prepare(selection) {
      const {title, subtitle, category, isPinned, approved, isDeleted, replyCount, views} = selection
      const pinnedIcon = isPinned ? '📌 ' : ''
      const status = isDeleted ? '🗑️' : (approved ? '✅' : '⏳')
      const categoryEmojis: { [key: string]: string } = {
        principiantes: '🌱',
        testimonios: '🎉',
        recetas: '👩‍🍳',
        dudas: '❓',
        ejercicio: '💪',
        productos: '🛒'
      };
      const categoryEmoji = categoryEmojis[category] || '💬'
      
      return {
        title: `${pinnedIcon}${status} ${title}`,
        subtitle: `${categoryEmoji} por ${subtitle} • ${replyCount || 0} respuestas • ${views || 0} vistas`
      }
    }
  },
})