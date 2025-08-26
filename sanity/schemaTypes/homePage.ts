import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'homePage',
  title: 'Página Principal',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      initialValue: 'Página Principal',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Título del Hero',
      type: 'string',
    }),
    defineField({
      name: 'heroDescription',
      title: 'Descripción del Hero',
      type: 'text',
    }),
    defineField({
      name: 'featuredRecipes',
      title: 'Recetas Destacadas',
      type: 'array',
      of: [{type: 'reference', to: {type: 'post'}}],
    }),
    defineField({
      name: 'stats',
      title: 'Estadísticas',
      type: 'object',
      fields: [
        {name: 'totalRecipes', title: 'Total Recetas', type: 'number'},
        {name: 'happyUsers', title: 'Usuarios Felices', type: 'number'},
        {name: 'avgRating', title: 'Rating Promedio', type: 'number'},
      ],
    }),
    // Campos adicionales encontrados en la página principal existente
    defineField({
      name: 'heroImage',
      title: 'Imagen del Hero',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'siteTitle',
      title: 'Título del Sitio',
      type: 'string',
    }),
  ],
})