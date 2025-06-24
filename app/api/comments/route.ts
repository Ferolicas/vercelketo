import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity';

// GET: Obtener comentarios de un post
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const postSlug = searchParams.get('postSlug');

  if (!postSlug) {
    return NextResponse.json({ error: 'Post slug is required' }, { status: 400 });
  }

  try {
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

    // Solo devolver comentarios aprobados
    const approvedComments = comments.filter((comment: any) => comment.approved !== false);

    return NextResponse.json({ comments: approvedComments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

// POST: Crear nuevo comentario
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postSlug, name, email, comment, rating } = body;

    // Validaciones básicas
    if (!postSlug || !name || !email || !comment) {
      return NextResponse.json({ 
        error: 'Todos los campos son obligatorios' 
      }, { status: 400 });
    }

    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json({ 
        error: 'La calificación debe estar entre 1 y 5' 
      }, { status: 400 });
    }

    // Validar email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        error: 'Email inválido' 
      }, { status: 400 });
    }

    // Obtener referencia al post
    const post = await client.fetch(`
      *[_type == "post" && slug.current == $postSlug][0] {
        _id
      }
    `, { postSlug });

    if (!post) {
      return NextResponse.json({ 
        error: 'Post no encontrado' 
      }, { status: 404 });
    }

    // Crear el comentario en Sanity
    const newComment = await client.create({
      _type: 'comment',
      name,
      email,
      comment,
      rating: rating || null,
      post: {
        _type: 'reference',
        _ref: post._id
      },
      approved: true, // Auto-aprobar por ahora, puedes cambiar esto
      _createdAt: new Date().toISOString()
    });

    return NextResponse.json({ 
      success: true, 
      comment: newComment,
      message: 'Comentario enviado exitosamente'
    });

  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 });
  }
}