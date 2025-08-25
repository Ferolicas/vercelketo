// schemas/comment.ts
import { defineField, defineType } from 'sanity'
import { CommentIcon } from '@sanity/icons'

export default defineType({
  name: 'comment',
  title: 'Comentarios',
  type: 'document',
  icon: CommentIcon,
  fields: [
    defineField({
      name: 'content',
      title: 'Contenido del comentario',
      type: 'text',
      validation: Rule => Rule.required().min(4).max(1000),
      description: 'El contenido del comentario debe tener entre 4 y 1000 caracteres'
    }),
    defineField({
      name: 'author',
      title: 'Autor',
      type: 'object',
      validation: Rule => Rule.required(),
      fields: [
        {
          name: 'name',
          title: 'Nombre',
          type: 'string',
          validation: Rule => Rule.required().min(2).max(50),
          description: 'Nombre del autor (2-50 caracteres)'
        },
        {
          name: 'email',
          title: 'Email',
          type: 'string',
          validation: Rule => Rule.required().email(),
          description: 'Email válido del autor'
        }
      ]
    }),
    defineField({
      name: 'authorId',
      title: 'ID del Autor',
      type: 'string',
      description: 'ID único generado automáticamente para identificar al autor',
      validation: Rule => Rule.required(),
      readOnly: true
    }),
    defineField({
      name: 'post',
      title: 'Post',
      type: 'reference',
      to: [{ type: 'post' }],
      validation: Rule => Rule.required(),
      description: 'Post al que pertenece este comentario'
    }),
    defineField({
      name: 'rating',
      title: 'Calificación',
      type: 'number',
      validation: Rule => Rule.min(1).max(5),
      description: 'Valor entre 1 y 5 estrellas' // Descripción ajustada
      // 'hidden' eliminado, ahora siempre visible
    }),
    defineField({
      name: 'approved',
      title: 'Aprobado',
      type: 'boolean',
      initialValue: true,
      description: 'Solo comentarios aprobados se muestran públicamente'
    }),
    defineField({
      name: 'isEdited',
      title: 'Editado',
      type: 'boolean',
      initialValue: false,
      description: 'Indica si el comentario ha sido editado por el usuario'
    }),
    defineField({
      name: 'isDeleted',
      title: 'Eliminado',
      type: 'boolean',
      initialValue: false,
      description: 'Eliminación suave - el comentario se oculta pero se mantiene en la base de datos'
    }),
    defineField({
      name: 'adminReply',
      title: 'Respuesta del Administrador',
      type: 'text',
      description: 'Respuesta oficial del equipo/administrador',
      validation: Rule => Rule.max(500)
    }),
    defineField({
      name: 'adminReplyPublished',
      title: 'Respuesta Admin Publicada',
      type: 'boolean',
      initialValue: true,
      description: 'Controla si la respuesta del admin es visible públicamente',
      // 'hidden' eliminado, ahora siempre visible
    }),
    defineField({
      name: 'adminReplyDate',
      title: 'Fecha Respuesta Admin',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      description: 'Fecha automática cuando se publica la respuesta del admin',
      // 'hidden' eliminado, ahora siempre visible
    })
  ],
  preview: {
    select: {
      title: 'author.name',
      subtitle: 'content',
      media: 'post.mainImage',
      rating: 'rating',
      approved: 'approved',
      isDeleted: 'isDeleted',
      // 'parentComment' eliminado del select
    },
    prepare(selection) {
      const { title, subtitle, rating, approved, isDeleted } = selection // 'parentComment' eliminado de la desestructuración
      
      let statusIcon = '';
      if (isDeleted) statusIcon = '🗑️';
      else if (!approved) statusIcon = '⏳';
      // 'else if (parentComment) statusIcon = '↳';' eliminado
      else statusIcon = '💬'; // Ahora todos los comentarios no eliminados y aprobados son '💬'
      
      const ratingText = rating ? ` (${rating}⭐)` : '';
      // 'const replyText = parentComment ? ' (Respuesta)' : '';' eliminado
      
      return {
        title: `${statusIcon} ${title}${ratingText}`, // 'replyText' eliminado
        subtitle: subtitle?.slice(0, 80) + (subtitle?.length > 80 ? '...' : ''),
        media: selection.media
      }
    }
  },
  orderings: [
    {
      title: 'Más recientes',
      name: 'createdAtDesc',
      by: [{ field: '_createdAt', direction: 'desc' }]
    },
    {
      title: 'Más antiguos',
      name: 'createdAtAsc',
      by: [{ field: '_createdAt', direction: 'asc' }]
    },
    {
      title: 'Mejor calificados',
      name: 'ratingDesc',
      by: [{ field: 'rating', direction: 'desc' }]
    },
    {
      title: 'Pendientes de aprobación',
      name: 'pendingApproval',
      by: [
        { field: 'approved', direction: 'asc' },
        { field: '_createdAt', direction: 'desc' }
      ]
    }
  ],
  initialValue: {
    approved: true,
    isEdited: false,
    isDeleted: false,
    adminReplyPublished: false
  }
})