import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity';
import type { ApiResponse, Category } from '@/types/sanity';

// GET - Obtener todas las categorías
export async function GET(request: NextRequest) {
  try {
    const categories = await client.fetch<Category[]>(`
      *[_type == "category" && defined(slug.current)] | order(name asc) {
        _id,
        name,
        slug,
        description,
        icon
      }
    `);

    return NextResponse.json<ApiResponse<Category[]>>({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json<ApiResponse<Category[]>>(
      {
        success: false,
        error: 'Error al obtener las categorías'
      },
      { status: 500 }
    );
  }
}