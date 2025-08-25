import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title', // El slug se generará a partir del título
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(), // Hacemos que sea obligatorio
    }),
    defineField({
      name: 'categoryImage',
      title: 'Imagen para la Tarjeta de Categoría',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
    name: 'order',
    title: 'Orden',
    type: 'number',
    description: 'Número para ordenar las categorías manualmente',
    validation: Rule => Rule.required().min(0),
    }),
  ],
})
