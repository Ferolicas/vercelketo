import { NextRequest, NextResponse } from 'next/server';
import { writeClient, client } from '@/lib/sanity';
import type { ApiResponse } from '@/types/sanity';

// GET - Obtener comentarios por receta
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const recipeId = searchParams.get('recipeId');

    if (!recipeId) {
      return NextResponse.json<ApiResponse<any>>(
        {
          success: false,
          error: 'ID de receta es requerido'
        },
        { status: 400 }
      );
    }

    const comments = await client.fetch(`
      *[_type == "comment" && recipe._ref == $recipeId && approved == true] | order(createdAt desc) {
        _id,
        authorName,
        content,
        rating,
        createdAt
      }
    `, { recipeId });

    return NextResponse.json<ApiResponse<any>>({
      success: true,
      data: comments
    });

  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json<ApiResponse<any>>(
      {
        success: false,
        error: 'Error al obtener los comentarios'
      },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo comentario
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recipeId, authorName, authorEmail, content, rating } = body;

    // Validaciones
    if (!recipeId || !authorName || !authorEmail || !content || !rating) {
      return NextResponse.json<ApiResponse<any>>(
        {
          success: false,
          error: 'Todos los campos son requeridos'
        },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json<ApiResponse<any>>(
        {
          success: false,
          error: 'La calificación debe estar entre 1 y 5'
        },
        { status: 400 }
      );
    }

    // Crear comentario
    const commentDoc = {
      _type: 'comment',
      recipe: {
        _ref: recipeId,
        _type: 'reference'
      },
      authorName,
      authorEmail,
      content,
      rating,
      approved: true, // Auto-aprobar por ahora, se puede cambiar luego
      createdAt: new Date().toISOString()
    };

    const result = await writeClient.create(commentDoc);

    // Actualizar promedio de calificación de la receta
    await updateRecipeRating(recipeId);

    return NextResponse.json<ApiResponse<any>>({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json<ApiResponse<any>>(
      {
        success: false,
        error: 'Error al crear el comentario'
      },
      { status: 500 }
    );
  }
}

// Función auxiliar para actualizar el rating promedio de una receta
async function updateRecipeRating(recipeId: string) {
  try {
    // Obtener todos los comentarios aprobados de la receta
    const comments = await client.fetch(`
      *[_type == "comment" && recipe._ref == $recipeId && approved == true] {
        rating
      }
    `, { recipeId });

    if (comments.length === 0) return;

    // Calcular promedio
    const totalRating = comments.reduce((sum: number, comment: any) => sum + comment.rating, 0);
    const averageRating = totalRating / comments.length;

    // Actualizar la receta
    await writeClient
      .patch(recipeId)
      .set({
        averageRating: Math.round(averageRating * 10) / 10, // Redondear a 1 decimal
        totalRatings: comments.length
      })
      .commit();

  } catch (error) {
    console.error('Error updating recipe rating:', error);
  }
}