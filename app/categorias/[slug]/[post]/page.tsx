// app/categorias/[slug]/[post]/page.tsx (Server Component - SIN "use client")

import { Metadata } from 'next'
import Link from 'next/link'
import { client, queries } from '@/lib/sanity'
import type { Post } from '@/types/sanity'
import { Clock, ChefHat, ArrowLeft } from 'lucide-react'
import { Suspense } from 'react'
import PostContent from './PostContent'

// Función para convertir Portable Text a texto plano
function portableTextToPlainText(blocks: any[]): string {
  if (!blocks || !Array.isArray(blocks)) return ''
  
  return blocks
    .map((block) => {
      if (block._type !== 'block' || !block.children) {
        return ''
      }
      return block.children.map((child: any) => child.text).join('')
    })
    .join('\n\n')
}

export default async function PostPage({ params }: { params: { slug: string, post: string } }) {
  console.log('📄 PÁGINA DE RECETA CARGANDO:', params.post)
  
  const post: Post = await client.fetch(queries.postBySlug, { 
    slug: params.post
  })

  if (!post) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Receta no encontrada</h1>
          <Link href="/">
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-full transition-colors">
              Volver al inicio
            </button>
          </Link>
        </div>
      </div>
    )
  }

  // Función mejorada para procesar el body
  const processPostBody = (body: any): string => {
    // Si no hay body, retorna string vacío
    if (!body) return ''
    
    // Si ya es string, lo retorna tal cual
    if (typeof body === 'string') return body
    
    // Si es array (Portable Text), lo convierte a texto plano
    if (Array.isArray(body)) return portableTextToPlainText(body)
    
    // Si es objeto pero no array, intenta extraer texto
    if (typeof body === 'object') {
      // Si tiene una propiedad que indica que es Portable Text
      if (body._type === 'block' || (body.children && Array.isArray(body.children))) {
        return portableTextToPlainText([body])
      }
    }
    
    // Como último recurso, intenta convertir a string
    return String(body) || ''
  }

  // Preparar datos para el componente cliente
  const postData = {
    title: post.title,
    author: post.author,
    preparationTime: post.preparationTime || 'No especificado',
    level: post.level || 'No especificado',
    youtubeUrl: post.youtubeUrl,
    ingredients: post.ingredients || [],
    body: processPostBody(post.body),
    slug: post.slug.current
  }

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Botón de regreso */}
      <div className="container mx-auto px-4 pt-6">
        <Link 
          href={`/categorias/${params.slug}`}
          className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Volver a la categoría</span>
        </Link>
      </div>

      {/* Contenido principal */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Título de la receta */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
            {postData.title}
          </h1>

          {/* Información básica (Server-side) */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div className="mb-4 md:mb-0">
              {postData.author && (
                <p className="text-lg text-gray-600">
                  Por: <span className="font-semibold text-gray-800">{postData.author.name}</span>
                </p>
              )}
            </div>
          </div>

          {/* Duración y dificultad */}
          <div className="flex flex-wrap gap-6 mb-8 p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center space-x-2">
              <Clock size={20} className="text-emerald-600" />
              <span className="font-medium text-gray-700">Duración:</span>
              <span className="text-gray-600">{postData.preparationTime}</span>
            </div>
            <div className="flex items-center space-x-2">
              <ChefHat size={20} className="text-emerald-600" />
              <span className="font-medium text-gray-700">Dificultad:</span>
              <span className="text-gray-600 capitalize">{postData.level}</span>
            </div>
          </div>

          {/* Componente cliente con toda la interactividad */}
          <PostContent postData={postData} />

        </div>
      </main>
    </div>
  )
}

// Generar rutas estáticas
export async function generateStaticParams() {
  const posts: Post[] = await client.fetch(`
    *[_type == "post"] {
      slug,
      category->{
        slug
      }
    }
  `)
  
  return posts.map((post) => ({
    slug: post.category?.slug?.current || 'sin-categoria',
    post: post.slug.current,
  }))
}

// Configurar revalidación para ISR
export const revalidate = 60