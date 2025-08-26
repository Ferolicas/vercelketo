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
      rows: 6,
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
      name: 'category',
      title: 'Categoría',
      type: 'string',
      options: {
        list: [
          {title: '💬 General', value: 'general'},
          {title: '🍽️ Recetas', value: 'recetas'},
          {title: '💪 Ejercicio', value: 'ejercicio'},
          {title: '📈 Progreso', value: 'progreso'},
          {title: '❓ Preguntas', value: 'preguntas'},
          {title: '🛒 Productos', value: 'productos'},
        ]
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pinned',
      title: 'Fijado',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'locked',
      title: 'Bloqueado',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'approved',
      title: 'Aprobado',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'views',
      title: 'Visualizaciones',
      type: 'number',
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: 'replies',
      title: 'Respuestas',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {name: 'authorName', type: 'string', title: 'Autor'},
          {name: 'authorEmail', type: 'string', title: 'Email'},
          {name: 'content', type: 'text', title: 'Contenido'},
          {name: 'createdAt', type: 'datetime', title: 'Fecha', initialValue: () => new Date().toISOString()},
          {name: 'approved', type: 'boolean', title: 'Aprobado', initialValue: false}
        ]
      }]
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
      title: 'Fijados primero',
      name: 'pinnedFirst',
      by: [
        {field: 'pinned', direction: 'desc'},
        {field: 'createdAt', direction: 'desc'}
      ]
    },
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
      title: 'title',
      subtitle: 'authorName',
      category: 'category',
      pinned: 'pinned',
      approved: 'approved',
      replies: 'replies'
    },
    prepare(selection) {
      const {title, subtitle, category, pinned, approved, replies} = selection
      const pinnedIcon = pinned ? '📌 ' : ''
      const status = approved ? '✅' : '⏳'
      const replyCount = replies?.length || 0
      const categoryEmojis: { [key: string]: string } = {
        general: '💬',
        recetas: '🍽️',
        ejercicio: '💪',
        progreso: '📈',
        preguntas: '❓',
        productos: '🛒'
      };
      const categoryEmoji = categoryEmojis[category] || '💬'
      
      return {
        title: `${pinnedIcon}${status} ${title}`,
        subtitle: `${categoryEmoji} por ${subtitle} • ${replyCount} respuestas`
      }
    }
  },
})