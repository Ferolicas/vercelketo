import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'category',
  title: 'Categoría',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre',
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
      rows: 3,
    }),
    defineField({
      name: 'emoji',
      title: 'Emoji',
      type: 'string',
      initialValue: '🥑',
    }),
    defineField({
      name: 'color',
      title: 'Color',
      type: 'string',
      options: {
        list: [
          {title: 'Verde', value: 'green'},
          {title: 'Azul', value: 'blue'},
          {title: 'Rojo', value: 'red'},
          {title: 'Amarillo', value: 'yellow'},
          {title: 'Morado', value: 'purple'},
        ],
      },
      initialValue: 'green',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'description',
    },
  },
})