import { NextRequest, NextResponse } from 'next/server';
import { writeClient, client } from '@/lib/sanity';

// GET - Obtener todas las recetas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category');

    let query = `*[_type == "recipe"] | order(createdAt desc) {
      _id,
      name,
      slug,
      description,
      preparationTime,
      servings,
      thumbnail,
      category->{
        _id,
        name,
        slug,
        icon
      },
      averageRating,
      totalRatings,
      createdAt
    }`;

    if (categoryId) {
      query = `*[_type == "recipe" && category._ref == "${categoryId}"] | order(createdAt desc) {
        _id,
        name,
        slug,
        description,
        preparationTime,
        servings,
        thumbnail,
        category->{
          _id,
          name,
          slug,
          icon
        },
        averageRating,
        totalRatings,
        createdAt
      }`;
    }

    const recipes = await client.fetch(query);

    return NextResponse.json({
      success: true,
      data: recipes
    });

  } catch (error) {
    console.error('Error fetching recipes:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener las recetas'
      },
      { status: 500 }
    );
  }
}

// POST - Crear nueva receta
export async function POST(request: NextRequest) {
  console.log('🚀 Recipe POST API called');
  
  try {
    const formData = await request.formData();
    console.log('📝 FormData received with keys:', Array.from(formData.keys()));
    
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const ingredients = formData.get('ingredients') as string;
    const preparation = formData.get('preparation') as string;
    const youtubeUrl = formData.get('youtubeUrl') as string || undefined;
    const preparationTime = parseInt(formData.get('preparationTime') as string);
    const servings = parseInt(formData.get('servings') as string);
    const categoryId = formData.get('categoryId') as string;
    const thumbnailFile = formData.get('thumbnail') as File;

    // Validaciones básicas
    if (!name || !description || !ingredients || !preparation || !preparationTime || !servings || !categoryId || !thumbnailFile) {
      return NextResponse.json(
        {
          success: false,
          error: 'Todos los campos son requeridos'
        },
        { status: 400 }
      );
    }

    // Subir imagen a Sanity
    const imageAsset = await writeClient.assets.upload('image', thumbnailFile, {
      filename: thumbnailFile.name
    });

    // Crear slug único
    const baseSlug = name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    let slug = baseSlug;
    let counter = 1;
    
    // Verificar que el slug sea único
    while (true) {
      const existingRecipe = await client.fetch(
        '*[_type == "recipe" && slug.current == $slug][0]',
        { slug }
      );
      
      if (!existingRecipe) break;
      
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Crear el documento de receta
    const recipeDoc = {
      _type: 'recipe',
      name,
      slug: {
        _type: 'slug',
        current: slug
      },
      description,
      ingredients,
      preparation,
      youtubeUrl,
      preparationTime,
      servings,
      thumbnail: {
        _type: 'image',
        asset: {
          _ref: imageAsset._id,
          _type: 'reference'
        }
      },
      category: {
        _ref: categoryId,
        _type: 'reference'
      },
      averageRating: 0,
      totalRatings: 0,
      createdAt: new Date().toISOString()
    };

    console.log('📄 Creating recipe document:', JSON.stringify({...recipeDoc, thumbnail: '[File]'}, null, 2));

    const result = await writeClient.create(recipeDoc);
    
    console.log('✅ Recipe created successfully:', result._id);

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('❌ Error creating recipe:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return NextResponse.json(
      {
        success: false,
        error: `Error al crear la receta: ${error instanceof Error ? error.message : 'Error desconocido'}`
      },
      { status: 500 }
    );
  }
}