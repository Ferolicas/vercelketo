import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/lib/sanity'

// POST - Procesar acciones de moderación
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, itemId, type } = body

    if (!action || !itemId || !type) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos' },
        { status: 400 }
      )
    }

    // Mapear tipos a sus respectivos tipos de documento
    const documentTypes = {
      'post': 'forumPost',
      'reply': 'forumReply',
      'comment': null // Se determinará basado en el contexto
    }

    // Determinar el tipo de documento
    let documentType: string
    let documentId: string = itemId

    // Primero intentar determinar el tipo de documento
    const possibleTypes = ['forumPost', 'forumReply', 'recipeComment', 'blogComment']
    let foundType = null
    
    for (const type of possibleTypes) {
      try {
        const exists = await writeClient.fetch(`*[_type == $type && _id == $id][0]`, { type, id: itemId })
        if (exists) {
          documentType = type
          foundType = type
          break
        }
      } catch (error) {
        console.error(`Error checking ${type}:`, error)
      }
    }

    if (!foundType) {
      return NextResponse.json(
        { error: 'Contenido no encontrado' },
        { status: 404 }
      )
    }

    // Realizar la acción correspondiente
    switch (action) {
      case 'approve':
        await writeClient
          .patch(itemId)
          .set({ approved: true, moderatedAt: new Date().toISOString() })
          .commit()
        break

      case 'reject':
        await writeClient
          .patch(itemId)
          .set({ approved: false, moderatedAt: new Date().toISOString() })
          .commit()
        break

      case 'delete':
        // Soft delete - marcar como eliminado en lugar de borrar
        await writeClient
          .patch(itemId)
          .set({ 
            isDeleted: true, 
            deletedAt: new Date().toISOString(),
            content: '[Contenido eliminado por moderación]'
          })
          .commit()
        break

      case 'edit':
        // Para edición, necesitaremos el nuevo contenido
        // Esto se manejará en un endpoint separado o con parámetros adicionales
        return NextResponse.json(
          { error: 'La edición requiere contenido adicional' },
          { status: 400 }
        )

      default:
        return NextResponse.json(
          { error: 'Acción no válida' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      message: `Contenido ${action === 'approve' ? 'aprobado' : action === 'reject' ? 'rechazado' : 'eliminado'} exitosamente`,
      action,
      itemId
    })

  } catch (error) {
    console.error('Error processing moderation action:', error)
    return NextResponse.json(
      { error: 'Error al procesar la acción de moderación' },
      { status: 500 }
    )
  }
}