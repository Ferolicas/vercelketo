import { NextRequest, NextResponse } from 'next/server';
import { client, writeClient } from '@/lib/sanity';

// GET: Obtener comentarios de un post
export async function GET(request: NextRequest) {
  console.log('🔍 GET /api/comments - Iniciando...');
  
  const { searchParams } = new URL(request.url);
  const postSlug = searchParams.get('postSlug');

  console.log('📝 Post slug recibido:', postSlug);

  if (!postSlug) {
    console.log('❌ Error: Post slug no proporcionado');
    return NextResponse.json({ error: 'Post slug is required' }, { status: 400 });
  }

  try {
    console.log('🔍 Buscando comentarios para:', postSlug);
    
    const comments = await client.fetch(`
      *[_type == "comment" && post->slug.current == $postSlug && !(_id in path("drafts.**"))] | order(_createdAt desc) {
        _id,
        _createdAt,
        name,
        email,
        comment,
        rating,
        approved
      }
    `, { postSlug });

    console.log('✅ Comentarios encontrados:', comments.length);

    // Solo devolver comentarios aprobados
    const approvedComments = comments.filter((comment: any) => comment.approved !== false);
    
    console.log('✅ Comentarios aprobados:', approvedComments.length);

    return NextResponse.json({ comments: approvedComments });
  } catch (error) {
    console.error('❌ Error fetching comments:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch comments',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST: Crear nuevo comentario
export async function POST(request: NextRequest) {
  console.log('📝 POST /api/comments - Iniciando...');
  
  try {
    const body = await request.json();
    console.log('📦 Body recibido:', body);
    
    const { postSlug, name, email, comment, rating } = body;

    // Validaciones básicas
    if (!postSlug || !name || !email || !comment) {
      console.log('❌ Validación fallida - campos faltantes:', { postSlug: !!postSlug, name: !!name, email: !!email, comment: !!comment });
      return NextResponse.json({ 
        error: 'Todos los campos son obligatorios',
        missing: {
          postSlug: !postSlug,
          name: !name,
          email: !email,
          comment: !comment
        }
      }, { status: 400 });
    }

    if (rating && (rating < 1 || rating > 5)) {
      console.log('❌ Rating inválido:', rating);
      return NextResponse.json({ 
        error: 'La calificación debe estar entre 1 y 5' 
      }, { status: 400 });
    }

    // Validar email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Email inválido:', email);
      return NextResponse.json({ 
        error: 'Email inválido' 
      }, { status: 400 });
    }

    console.log('🔍 Buscando post con slug:', postSlug);

    // Verificar que el cliente de escritura esté configurado
    if (!writeClient) {
      console.log('❌ Cliente de escritura de Sanity no configurado');
      return NextResponse.json({ 
        error: 'Error de configuración del servidor' 
      }, { status: 500 });
    }

    // Verificar que el token esté presente
    if (!process.env.SANITY_API_TOKEN) {
      console.log('❌ Token de Sanity no configurado');
      return NextResponse.json({ 
        error: 'Token de autenticación faltante' 
      }, { status: 500 });
    }

    // Obtener referencia al post
    const post = await client.fetch(`
      *[_type == "post" && slug.current == $postSlug][0] {
        _id,
        title
      }
    `, { postSlug });

    console.log('📄 Post encontrado:', post);

    if (!post) {
      console.log('❌ Post no encontrado para slug:', postSlug);
      return NextResponse.json({ 
        error: 'Post no encontrado' 
      }, { status: 404 });
    }

    console.log('💾 Creando comentario en Sanity...');

    // Crear el comentario en Sanity usando el cliente de escritura
    const commentData = {
      _type: 'comment',
      name: name.trim(),
      email: email.trim(),
      comment: comment.trim(),
      rating: rating || null,
      post: {
        _type: 'reference',
        _ref: post._id
      },
      approved: true, // Auto-aprobar por ahora
    };

    console.log('📦 Datos del comentario a crear:', commentData);

    const newComment = await writeClient.create(commentData);

    console.log('✅ Comentario creado exitosamente:', newComment._id);

    return NextResponse.json({ 
      success: true, 
      comment: newComment,
      message: 'Comentario enviado exitosamente'
    });

  } catch (error) {
    console.error('❌ Error completo:', error);
    console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'No stack available');
    
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}