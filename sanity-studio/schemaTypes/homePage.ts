// sanity/schemaTypes/homePage.ts

import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'homePage',
  title: 'Página de Inicio',
  type: 'document',
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Título del Header',
      type: 'string',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Título Cuerpo de pagina',
      type: 'string',
    }),
    defineField({
      name: 'heroDescription',
      title: 'Descripción Pagina',
      type: 'text',
    }),
    defineField({
      name: 'heroImage',
      title: 'Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
  ],
})