import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'recipe',
  title: 'Receta',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre de la receta',
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
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'ingredients',
      title: 'Ingredientes',
      type: 'array',
      of: [{type: 'string'}],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'preparation',
      title: 'Preparación',
      type: 'text',
      rows: 6,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'URL de YouTube',
      type: 'url',
      validation: (Rule) => 
        Rule.uri({
          allowRelative: false,
          scheme: ['https']
        }).custom((url) => {
          if (!url) return true // Campo opcional
          if (url.includes('youtube.com') || url.includes('youtu.be')) {
            return true
          }
          return 'Debe ser una URL válida de YouTube'
        })
    }),
    defineField({
      name: 'preparationTime',
      title: 'Tiempo de preparación (minutos)',
      type: 'number',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'servings',
      title: 'Porciones',
      type: 'number',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Miniatura',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Categoría',
      type: 'reference',
      to: {type: 'category'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'averageRating',
      title: 'Valoración promedio',
      type: 'number',
      readOnly: true,
      initialValue: 0,
    }),
    defineField({
      name: 'totalRatings',
      title: 'Total de valoraciones',
      type: 'number',
      readOnly: true,
      initialValue: 0,
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
    },
    {
      title: 'Mejor valoradas',
      name: 'ratingDesc',
      by: [
        {field: 'averageRating', direction: 'desc'}
      ]
    },
    {
      title: 'Alfabético',
      name: 'nameAsc',
      by: [
        {field: 'name', direction: 'asc'}
      ]
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category.name',
      media: 'thumbnail',
      rating: 'averageRating',
      time: 'preparationTime'
    },
    prepare(selection) {
      const {title, subtitle, media, rating, time} = selection
      return {
        title,
        subtitle: `${subtitle} • ${time}min • ⭐ ${rating?.toFixed(1) || '0.0'}`,
        media
      }
    }
  },
})