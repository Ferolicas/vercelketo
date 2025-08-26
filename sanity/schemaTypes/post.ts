import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'post',
  title: 'Receta',
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
      name: 'ingredients',
      title: 'Ingredientes',
      type: 'text',
    }),
    defineField({
      name: 'instructions',
      title: 'Instrucciones',
      type: 'text',
    }),
    defineField({
      name: 'category',
      title: 'Categoría',
      type: 'reference',
      to: {type: 'category'},
    }),
    defineField({
      name: 'image',
      title: 'Imagen principal',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'cookingTime',
      title: 'Tiempo de preparación (minutos)',
      type: 'number',
    }),
    defineField({
      name: 'servings',
      title: 'Porciones',
      type: 'number',
    }),
    defineField({
      name: 'difficulty',
      title: 'Dificultad',
      type: 'string',
      options: {
        list: [
          {title: 'Fácil', value: 'facil'},
          {title: 'Intermedio', value: 'intermedio'},
          {title: 'Avanzado', value: 'avanzado'},
        ],
      },
    }),
    defineField({
      name: 'featured',
      title: 'Destacada',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Fecha de publicación',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'author',
      title: 'Autor',
      type: 'string',
      initialValue: 'Planeta Keto',
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Título',
      type: 'string',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Descripción',
      type: 'text',
      rows: 2,
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
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author',
      media: 'image',
    },
  },
})