import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity';

// GET - Obtener todas las categorías
export async function GET(request: NextRequest) {
  try {
    const categories = await client.fetch<any[]>(`
      *[_type == "category"] | order(name asc) {
        _id,
        name,
        slug,
        description,
        icon
      }
    `);

    return NextResponse.json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener las categorías'
      },
      { status: 500 }
    );
  }
}