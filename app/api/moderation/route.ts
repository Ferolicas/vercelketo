import { NextRequest, NextResponse } from 'next/server'
import { client, writeClient } from '@/lib/sanity'

// GET - Obtener contenido pendiente de moderación
export async function GET() {
  try {
    // Get all pending forum posts and replies
    const [pendingPosts, pendingReplies] = await Promise.all([
      client.fetch(`
        *[_type == "forumPost" && approved != true && isDeleted != true] | order(_createdAt desc) {
          _id,
          title,
          content,
          authorName,
          authorEmail,
          category,
          _createdAt,
          "type": "post"
        }
      `),
      client.fetch(`
        *[_type == "forumReply" && approved != true && isDeleted != true] | order(_createdAt desc) {
          _id,
          content,
          authorName,
          authorEmail,
          _createdAt,
          "forumPost": forumPost->{
            title,
            slug
          },
          "type": "reply"
        }
      `)
    ]);

    const allPending = [...pendingPosts, ...pendingReplies];

    return NextResponse.json({ 
      pending: allPending,
      total: allPending.length
    });
  } catch (error) {
    console.error('Error fetching pending moderation:', error);
    return NextResponse.json(
      { error: 'Error al obtener contenido pendiente' },
      { status: 500 }
    );
  }
}

// POST - Aprobar o rechazar contenido
export async function POST(request: NextRequest) {
  try {
    const { action, itemId, type } = await request.json();

    if (!action || !itemId || !type) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos' },
        { status: 400 }
      );
    }

    if (action === 'approve') {
      // Aprobar el contenido
      await writeClient
        .patch(itemId)
        .set({ 
          approved: true,
          moderatedAt: new Date().toISOString()
        })
        .commit();
        
      return NextResponse.json({
        message: `${type === 'post' ? 'Publicación' : 'Respuesta'} aprobada exitosamente`
      });
    } else if (action === 'reject') {
      // Rechazar el contenido (soft delete)
      await writeClient
        .patch(itemId)
        .set({ 
          isDeleted: true,
          moderatedAt: new Date().toISOString(),
          moderationReason: 'Rechazado por moderador'
        })
        .commit();
        
      return NextResponse.json({
        message: `${type === 'post' ? 'Publicación' : 'Respuesta'} rechazada exitosamente`
      });
    } else {
      return NextResponse.json(
        { error: 'Acción inválida' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error in moderation action:', error);
    return NextResponse.json(
      { error: 'Error al procesar la moderación' },
      { status: 500 }
    );
  }
}