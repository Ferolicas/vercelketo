import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'affiliateList',
  title: 'Lista de Afiliados',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      rows: 3,
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
      name: 'image',
      title: 'Imagen Principal',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'items',
      title: 'Productos',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'affiliateItem',
          title: 'Producto Afiliado',
          fields: [
            defineField({
              name: 'title',
              title: 'Título del Producto',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Descripción',
              type: 'text',
              rows: 2,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'image',
              title: 'Imagen del Producto',
              type: 'image',
              options: {
                hotspot: true,
              },
            }),
            defineField({
              name: 'link',
              title: 'Enlace de Afiliado',
              type: 'url',
              validation: (Rule) => Rule.required().uri({
                allowRelative: false,
                scheme: ['http', 'https'],
              }),
            }),
            defineField({
              name: 'price',
              title: 'Precio',
              type: 'number',
            }),
            defineField({
              name: 'currency',
              title: 'Moneda',
              type: 'string',
              options: {
                list: [
                  { title: 'USD', value: 'USD' },
                  { title: 'EUR', value: 'EUR' },
                  { title: 'COP', value: 'COP' },
                ],
              },
              initialValue: 'USD',
            }),
            defineField({
              name: 'rating',
              title: 'Calificación',
              type: 'number',
              validation: (Rule) => Rule.min(0).max(5),
            }),
            defineField({
              name: 'category',
              title: 'Categoría',
              type: 'string',
            }),
          ],
          preview: {
            select: {
              title: 'title',
              description: 'description',
              media: 'image',
            },
            prepare({ title, description, media }) {
              return {
                title,
                subtitle: description,
                media,
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(1).required(),
    }),
    defineField({
      name: 'featured',
      title: 'Destacado',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'createdAt',
      title: 'Fecha de Creación',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Última Actualización',
      type: 'datetime',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      description: 'description',
      media: 'image',
      featured: 'featured',
      itemCount: 'items',
    },
    prepare({ title, description, media, featured, itemCount }) {
      return {
        title,
        subtitle: `${description || ''} (${itemCount?.length || 0} productos) ${featured ? '⭐ Destacado' : ''}`,
        media,
      }
    },
  },
})