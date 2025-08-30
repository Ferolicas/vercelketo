import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'amazonList',
  title: 'Lista de Amazon',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título del producto',
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
      name: 'description',
      title: 'Descripción',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'amazonUrl',
      title: 'URL de Amazon',
      type: 'url',
      validation: (Rule) => Rule.required().uri({
        allowRelative: false,
        scheme: ['https']
      }),
    }),
    defineField({
      name: 'image',
      title: 'Imagen del producto',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Precio aproximado',
      type: 'string',
      description: 'Precio en formato texto, ej: $25.99',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Categoría',
      type: 'string',
      options: {
        list: [
          {title: 'Suplementos', value: 'suplementos'},
          {title: 'Aceites Saludables', value: 'aceites'},
          {title: 'Endulzantes', value: 'endulzantes'},
          {title: 'Snacks Keto', value: 'snacks'},
          {title: 'Cocina y Hogar', value: 'cocina'},
          {title: 'Libros y Guías', value: 'libros'},
          {title: 'Equipos Fitness', value: 'fitness'},
          {title: 'Otros', value: 'otros'},
        ]
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'rating',
      title: 'Calificación',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).max(5),
      description: 'Calificación de 1 a 5 estrellas',
    }),
    defineField({
      name: 'reviewsCount',
      title: 'Número de reseñas',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'benefits',
      title: 'Beneficios',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Lista de beneficios del producto',
    }),
    defineField({
      name: 'keyFeatures',
      title: 'Características clave',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Características principales del producto',
    }),
    defineField({
      name: 'featured',
      title: 'Destacado',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'isKeto',
      title: 'Producto Keto-friendly',
      type: 'boolean',
      initialValue: true,
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
      title: 'Mejor calificados',
      name: 'ratingDesc',
      by: [
        {field: 'rating', direction: 'desc'}
      ]
    },
    {
      title: 'Por categoría',
      name: 'categoryAsc',
      by: [
        {field: 'category', direction: 'asc'}
      ]
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'image',
      featured: 'featured',
      rating: 'rating'
    },
    prepare(selection) {
      const {title, subtitle, media, featured, rating} = selection
      const featuredIcon = featured ? '⭐ ' : ''
      const stars = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating))
      return {
        title: `${featuredIcon}${title}`,
        subtitle: `${subtitle} • ${stars} (${rating})`,
        media
      }
    }
  },
})