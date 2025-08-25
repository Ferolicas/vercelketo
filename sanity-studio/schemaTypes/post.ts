// schemas/post.ts

import {defineField, defineType} from 'sanity'
// 1. IMPORTA TU NUEVO COMPONENTE
import { TagsInput } from '../components/TagsInput' // Asegúrate que la ruta sea correcta

export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titulo',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Enlace',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'author',
      title: 'Autor',
      type: 'reference',
      to: {type: 'author'},
    }),
    defineField({
      name: 'mainImage',
      title: 'Imagen del plato',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'category',
      title: 'Categoria',
      type: 'reference',
      to: { type: 'category' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Fecha de publicación',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
   defineField({
  name: 'ingredients', // Puedes usar el nombre que quieras
  title: 'Ingredientes',
  type: 'text', // <-- Esto crea un único campo de texto grande
  description: 'Pega aquí la lista completa de ingredientes.',
  rows: 15, // Opcional: ajusta la altura del campo de texto
}),
    defineField({
      name: 'body',
      title: 'Instrucciones de preparación',
      type: 'blockContent',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'URL del Vídeo de YouTube',
      type: 'url',
      validation: Rule => Rule.uri({
        scheme: ['http', 'https']
      })
    }),
    defineField({
      name: 'level',
      title: 'Nivel de Dificultad',
      type: 'string',
      options: {
        list: [
          {title: 'Principiante', value: 'principiante'},
          {title: 'Intermedio', value: 'intermedio'},
          {title: 'Avanzado', value: 'avanzado'},
        ],
        layout: 'radio'
      }
    }),
    defineField({
      name: 'preparationTime',
      title: 'Tiempo de Preparación',
      description: 'Ej: 30 minutos, 1 hora 15 minutos',
      type: 'string',
    }),
    defineField({
      name: 'rating',
      title: 'Calificación',
      type: 'number',
      validation: Rule => Rule.min(1).max(5)
    }),
    defineField({
      name: 'servings',
      title: 'Porciones',
      type: 'number',
      description: 'Número de porciones que rinde la receta',
      validation: Rule => Rule.min(1)
    }),
    defineField({
      name: 'calories',
      title: 'Calorías por porción',
      type: 'number',
      description: 'Calorías aproximadas por porción'
    }),
    defineField({
      name: 'macros',
      title: 'Macronutrientes',
      type: 'object',
      fields: [
        {
          name: 'carbs',
          title: 'Carbohidratos (g)',
          type: 'number'
        },
        {
          name: 'protein',
          title: 'Proteínas (g)',
          type: 'number'
        },
        {
          name: 'fat',
          title: 'Grasas (g)',
          type: 'number'
        },
        {
          name: 'fiber',
          title: 'Fibra (g)',
          type: 'number'
        }
      ]
    }),
    // 2. CAMPO DE ETIQUETAS CORREGIDO
    defineField({
      name: 'tags',
      title: 'Etiquetas',
      type: 'array',
      of: [
        {
          type: 'string',
          title: 'Etiqueta'
        }
      ],
      components: {
        input: TagsInput
      }
    }),
    defineField({
      name: 'chefNotes',
      title: 'Notas del Chef',
      type: 'text',
      description: 'Consejos adicionales o notas importantes sobre la receta'
    })
  ],

  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
      category: 'category.title'
    },
    prepare(selection) {
      const {author, category} = selection
      return {
        ...selection, 
        subtitle: `${author ? `por ${author}` : ''}${author && category ? ' • ' : ''}${category || ''}`
      }
    },
  },
})