import { NextRequest, NextResponse } from 'next/server';
import { client, writeClient } from '@/lib/sanity';

// Headers CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// OPTIONS para CORS
export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

// Función auxiliar para validar email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email.trim().toLowerCase());
}

// Función auxiliar para sanitizar contenido
function sanitizeContent(content: string): string {
  return content.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
}

// GET: Obtener comentarios de un post con jerarquía
export async function GET(request: NextRequest) {
  console.log('🔍 GET /api/comments - Iniciando...');
  
  try {
    const { searchParams } = new URL(request.url);
    const postSlug = searchParams.get('postSlug');

    console.log('📝 Post slug recibido:', postSlug);

    if (!postSlug || typeof postSlug !== 'string' || postSlug.trim() === '') {
      console.log('❌ Error: Post slug no válido');
      return NextResponse.json(
        { error: 'Post slug válido es requerido' }, 
        { status: 400, headers: corsHeaders }
      );
    }

    console.log('🔍 Buscando comentarios para:', postSlug);
    
    // Query mejorada con manejo de errores
    const comments = await client.fetch(`
      *[_type == "comment" && post->slug.current == $postSlug && !(_id in path("drafts.**"))] | order(_createdAt desc) {
        _id,
        _createdAt,
        _updatedAt,
        content,
        author {
          name,
          email
        },
        authorId,
        rating,
        approved,
        isEdited,
        isDeleted,
        parentComment,
        adminReply,
        adminReplyPublished,
        adminReplyDate
      }
    `, { postSlug: postSlug.trim() });

    console.log('✅ Comentarios encontrados:', comments?.length || 0);

    // Filtrar comentarios válidos
    const visibleComments = (comments || []).filter((comment: any) => {
      return comment && 
             comment.approved !== false && 
             comment.isDeleted !== true &&
             comment.author &&
             comment.author.name &&
             comment.content;
    });
    
    console.log('✅ Comentarios visibles:', visibleComments.length);

    return NextResponse.json(
      { comments: visibleComments }, 
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error('❌ Error fetching comments:', error);
    return NextResponse.json({ 
      error: 'Error al obtener comentarios',
      details: process.env.NODE_ENV === 'development' ? 
        (error instanceof Error ? error.message : 'Error desconocido') : 
        'Error interno'
    }, { 
      status: 500, 
      headers: corsHeaders 
    });
  }
}

// POST: Crear nuevo comentario
export async function POST(request: NextRequest) {
  console.log('📝 POST /api/comments - Iniciando...');
  
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.log('❌ Error parsing JSON:', parseError);
      return NextResponse.json(
        { error: 'JSON inválido en el cuerpo de la petición' },
        { status: 400, headers: corsHeaders }
      );
    }

    console.log('📦 Body recibido:', { ...body, email: body.email ? '[HIDDEN]' : undefined });
    
    const { postSlug, name, email, content, rating, authorId, parentComment } = body;

    // Validaciones mejoradas
    const validationErrors = [];
    
    if (!postSlug || typeof postSlug !== 'string' || postSlug.trim() === '') {
      validationErrors.push('postSlug es requerido');
    }
    if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 50) {
      validationErrors.push('Nombre debe tener entre 2 y 50 caracteres');
    }
    if (!email || typeof email !== 'string' || !isValidEmail(email)) {
      validationErrors.push('Email válido es requerido');
    }
    if (!content || typeof content !== 'string' || content.trim().length < 10 || content.trim().length > 1000) {
      validationErrors.push('Comentario debe tener entre 10 y 1000 caracteres');
    }
    if (!authorId || typeof authorId !== 'string' || authorId.trim() === '') {
      validationErrors.push('AuthorId es requerido');
    }

    // Validar rating solo para comentarios principales
    if (!parentComment && rating !== null && rating !== undefined) {
      if (typeof rating !== 'number' || rating < 1 || rating > 5) {
        validationErrors.push('La calificación debe estar entre 1 y 5');
      }
    }

    if (validationErrors.length > 0) {
      console.log('❌ Errores de validación:', validationErrors);
      return NextResponse.json(
        { error: 'Errores de validación', details: validationErrors },
        { status: 400, headers: corsHeaders }
      );
    }

    // Verificar configuración de Sanity
    if (!writeClient) {
      console.log('❌ WriteClient no configurado');
      return NextResponse.json(
        { error: 'Error de configuración del servidor' },
        { status: 500, headers: corsHeaders }
      );
    }

    console.log('🔍 Buscando post con slug:', postSlug);

    // Obtener referencia al post
    const post = await client.fetch(`
      *[_type == "post" && slug.current == $postSlug][0] {
        _id,
        title
      }
    `, { postSlug: postSlug.trim() });

    console.log('📄 Post encontrado:', post ? 'Sí' : 'No');

    if (!post || !post._id) {
      console.log('❌ Post no encontrado para slug:', postSlug);
      return NextResponse.json(
        { error: 'Post no encontrado' },
        { status: 404, headers: corsHeaders }
      );
    }

    // Si es una respuesta, verificar que el comentario padre exists
    if (parentComment) {
      if (typeof parentComment !== 'string') {
        return NextResponse.json(
          { error: 'parentComment debe ser un string válido' },
          { status: 400, headers: corsHeaders }
        );
      }

      const parentCommentExists = await client.fetch(`
        *[_type == "comment" && _id == $parentComment && approved == true && isDeleted != true][0] {
          _id
        }
      `, { parentComment });

      if (!parentCommentExists) {
        return NextResponse.json(
          { error: 'Comentario padre no encontrado o no está disponible' },
          { status: 404, headers: corsHeaders }
        );
      }
    }

    console.log('💾 Creando comentario en Sanity...');

    // Preparar datos del comentario
    const sanitizedContent = sanitizeContent(content);
    const sanitizedName = name.trim();
    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedAuthorId = authorId.trim();

    const commentData: any = {
      _type: 'comment',
      content: sanitizedContent,
      author: {
        name: sanitizedName,
        email: sanitizedEmail
      },
      authorId: sanitizedAuthorId,
      post: {
        _type: 'reference',
        _ref: post._id
      },
      approved: true,
      isEdited: false,
      isDeleted: false
    };

    // Agregar rating solo para comentarios principales
    if (!parentComment && rating && typeof rating === 'number') {
      commentData.rating = Math.round(rating);
    }

    // Agregar referencia al comentario padre si existe
    if (parentComment) {
      commentData.parentComment = {
        _type: 'reference',
        _ref: parentComment
      };
    }

    console.log('📦 Creando comentario con datos validados');

    const newComment = await writeClient.create(commentData);

    console.log('✅ Comentario creado exitosamente:', newComment._id);

    return NextResponse.json({ 
      success: true, 
      comment: {
        _id: newComment._id,
        _createdAt: newComment._createdAt,
        content: newComment.content,
        author: newComment.author,
        rating: newComment.rating || null
      },
      message: parentComment ? 'Respuesta enviada exitosamente' : 'Comentario enviado exitosamente'
    }, { 
      status: 201, 
      headers: corsHeaders 
    });

  } catch (error) {
    console.error('❌ Error completo:', error);
    
    if (error instanceof Error) {
      console.error('❌ Error message:', error.message);
      console.error('❌ Stack trace:', error.stack);
    }
    
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? 
        (error instanceof Error ? error.message : 'Error desconocido') : 
        'Error interno',
      timestamp: new Date().toISOString()
    }, { 
      status: 500, 
      headers: corsHeaders 
    });
  }
}

// PUT: Editar comentario existente
export async function PUT(request: NextRequest) {
  console.log('✏️ PUT /api/comments - Iniciando...');
  
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: 'JSON inválido en el cuerpo de la petición' },
        { status: 400, headers: corsHeaders }
      );
    }

    const { commentId, authorId, content, name, email, rating } = body;

    // Validaciones
    const validationErrors = [];
    
    if (!commentId || typeof commentId !== 'string') {
      validationErrors.push('ID del comentario es requerido');
    }
    if (!authorId || typeof authorId !== 'string') {
      validationErrors.push('AuthorId es requerido');
    }
    if (!content || typeof content !== 'string' || content.trim().length < 10 || content.trim().length > 1000) {
      validationErrors.push('Contenido debe tener entre 10 y 1000 caracteres');
    }
    if (name && (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 50)) {
      validationErrors.push('Nombre debe tener entre 2 y 50 caracteres');
    }
    if (email && (typeof email !== 'string' || !isValidEmail(email))) {
      validationErrors.push('Email debe ser válido');
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Errores de validación', details: validationErrors },
        { status: 400, headers: corsHeaders }
      );
    }

    console.log('🔍 Buscando comentario:', commentId);

    // Verificar que el comentario existe y pertenece al usuario
    const existingComment = await client.fetch(`
      *[_type == "comment" && _id == $commentId && authorId == $authorId && isDeleted != true][0] {
        _id,
        content,
        author,
        rating,
        parentComment
      }
    `, { commentId, authorId });

    if (!existingComment) {
      return NextResponse.json(
        { error: 'Comentario no encontrado o no tienes permisos para editarlo' },
        { status: 404, headers: corsHeaders }
      );
    }

    console.log('💾 Actualizando comentario...');

    // Preparar datos de actualización
    const updateData: any = {
      content: sanitizeContent(content),
      isEdited: true
    };

    if (name && name.trim()) {
      updateData['author.name'] = name.trim();
    }
    if (email && email.trim()) {
      updateData['author.email'] = email.trim().toLowerCase();
    }
    if (rating && typeof rating === 'number' && !existingComment.parentComment) {
      updateData.rating = Math.round(rating);
    }

    const updatedComment = await writeClient
      .patch(commentId)
      .set(updateData)
      .commit();

    console.log('✅ Comentario actualizado:', updatedComment._id);

    return NextResponse.json({ 
      success: true, 
      comment: {
        _id: updatedComment._id,
        content: updatedComment.content,
        author: updatedComment.author,
        isEdited: updatedComment.isEdited
      },
      message: 'Comentario actualizado exitosamente'
    }, { 
      status: 200, 
      headers: corsHeaders 
    });

  } catch (error) {
    console.error('❌ Error actualizando comentario:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? 
        (error instanceof Error ? error.message : 'Error desconocido') : 
        'Error interno'
    }, { 
      status: 500, 
      headers: corsHeaders 
    });
  }
}

// DELETE: Eliminar comentario (soft delete)
export async function DELETE(request: NextRequest) {
  console.log('🗑️ DELETE /api/comments - Iniciando...');
  
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: 'JSON inválido en el cuerpo de la petición' },
        { status: 400, headers: corsHeaders }
      );
    }

    const { commentId, authorId } = body;

    // Validaciones
    if (!commentId || typeof commentId !== 'string') {
      return NextResponse.json(
        { error: 'ID del comentario es requerido' },
        { status: 400, headers: corsHeaders }
      );
    }
    if (!authorId || typeof authorId !== 'string') {
      return NextResponse.json(
        { error: 'AuthorId es requerido' },
        { status: 400, headers: corsHeaders }
      );
    }

    console.log('🔍 Buscando comentario:', commentId);

    // Verificar que el comentario existe y pertenece al usuario
    const existingComment = await client.fetch(`
      *[_type == "comment" && _id == $commentId && authorId == $authorId && isDeleted != true][0] {
        _id
      }
    `, { commentId, authorId });

    if (!existingComment) {
      return NextResponse.json(
        { error: 'Comentario no encontrado o no tienes permisos para eliminarlo' },
        { status: 404, headers: corsHeaders }
      );
    }

    console.log('💾 Marcando comentario como eliminado...');

    // Soft delete
    const deletedComment = await writeClient
      .patch(commentId)
      .set({
        isDeleted: true,
        content: '[Comentario eliminado por el usuario]'
      })
      .commit();

    console.log('✅ Comentario eliminado:', deletedComment._id);

    return NextResponse.json({ 
      success: true,
      message: 'Comentario eliminado exitosamente'
    }, { 
      status: 200, 
      headers: corsHeaders 
    });

  } catch (error) {
    console.error('❌ Error eliminando comentario:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? 
        (error instanceof Error ? error.message : 'Error desconocido') : 
        'Error interno'
    }, { 
      status: 500, 
      headers: corsHeaders 
    });
  }
}