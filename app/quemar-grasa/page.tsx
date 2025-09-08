import { Suspense } from 'react';
import { client } from '@/lib/sanity';
import type { Recipe } from '@/types/sanity';
import { Metadata } from 'next';
import QuemarGrasaContent from '@/components/QuemarGrasaContent';

export const metadata: Metadata = {
  title: "Cómo Quemar Grasa Abdominal con Dieta Keto: Método Comprobado 2024",
  description: "🔥 Aprende a quemar grasa abdominal y visceral con keto. Técnicas avanzadas, ayuno intermitente y recetas termogénicas para máxima quema de grasa.",
  keywords: "quemar grasa, quemar grasa abdominal, perder grasa corporal, grasa visceral, keto quemar grasa, acelerar metabolismo, termogénicos naturales, ayuno intermitente, cetosis quemar grasa",
  openGraph: {
    title: "Quemar Grasa con Keto: Resultados Visibles en 2 Semanas",
    description: "🔥 Método científicamente probado para quemar grasa corporal. Combina keto + ayuno intermitente para máximos resultados.",
    type: "website",
    url: "https://planetaketo.es/quemar-grasa",
    images: [
      {
        url: "/og-quemar-grasa.jpg",
        width: 1200,
        height: 630,
        alt: "Quemar Grasa con Keto - Planeta Keto",
      }
    ],
  },
  alternates: {
    canonical: "/quemar-grasa",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function QuemarGrasaPage() {
  try {
    const [fatBurningRecipes, thermogenicRecipes, fastingRecipes] = await Promise.all([
      client.fetch<Recipe[]>(`
        *[_type == "recipe" && (
          name match "*grasa*" ||
          description match "*quemar*"
        )] | order(averageRating desc)[0..12] {
          _id,
          name,
          slug,
          thumbnail,
          description,
          preparationTime,
          averageRating,
          category->{
            name,
            slug
          }
        }
      `),
      client.fetch<Recipe[]>(`
        *[_type == "recipe" && (
          ingredients match "*cayena*" ||
          ingredients match "*jengibre*" ||
          ingredients match "*canela*" ||
          ingredients match "*coco*"
        )] | order(averageRating desc)[0..8] {
          _id,
          name,
          slug,
          thumbnail,
          ingredients,
          averageRating,
          category->{
            name,
            slug
          }
        }
      `),
      client.fetch<Recipe[]>(`
        *[_type == "recipe" && (
          name match "*ayuno*" ||
          description match "*ayuno*"
        )] | order(averageRating desc)[0..6] {
          _id,
          name,
          slug,
          thumbnail,
          preparationTime,
          averageRating
        }
      `)
    ]);

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30">
        {/* Header Section */}
        <div className="relative bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 py-12 overflow-hidden">
          {/* Background decorative layers */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-700/20 via-transparent to-emerald-700/20"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent)] opacity-50"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.1),transparent)] opacity-30"></div>
          
          {/* Floating elements */}
          <div className="absolute top-10 left-10 w-4 h-4 bg-white/20 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-6 h-6 bg-white/15 rounded-full animate-bounce delay-300"></div>
          <div className="absolute bottom-10 left-1/4 w-3 h-3 bg-white/25 rounded-full animate-ping delay-700"></div>
          <div className="absolute top-20 right-1/3 w-5 h-5 bg-white/10 rounded-full animate-pulse delay-500"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
              <span className="text-4xl">🔥</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              Quemar Grasa con Keto
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow">
              Convierte tu cuerpo en una máquina quema-grasa las 24 horas
            </p>
          </div>
        </div>

        <Suspense fallback={
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
          </div>
        }>
          <QuemarGrasaContent 
            fatBurningRecipes={fatBurningRecipes}
            thermogenicRecipes={thermogenicRecipes}
            fastingRecipes={fastingRecipes}
          />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error('Error loading quemar grasa page:', error);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30">
        {/* Header Section */}
        <div className="relative bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 py-12 overflow-hidden">
          {/* Background decorative layers */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-700/20 via-transparent to-emerald-700/20"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent)] opacity-50"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.1),transparent)] opacity-30"></div>
          
          {/* Floating elements */}
          <div className="absolute top-10 left-10 w-4 h-4 bg-white/20 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-6 h-6 bg-white/15 rounded-full animate-bounce delay-300"></div>
          <div className="absolute bottom-10 left-1/4 w-3 h-3 bg-white/25 rounded-full animate-ping delay-700"></div>
          <div className="absolute top-20 right-1/3 w-5 h-5 bg-white/10 rounded-full animate-pulse delay-500"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
              <span className="text-4xl">🔥</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              Quemar Grasa con Keto
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow">
              Convierte tu cuerpo en una máquina quema-grasa las 24 horas
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="prose prose-lg max-w-none">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl p-8 mb-8">
              <h2 className="text-white text-2xl font-bold mb-4">🎯 Protocolo Quema-Grasa Avanzado</h2>
              <div className="grid md:grid-cols-3 gap-4 text-orange-100">
                <div className="text-center">
                  <div className="text-3xl font-bold">24/7</div>
                  <div className="text-sm">Quema grasa continua</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">70%</div>
                  <div className="text-sm">Más eficiente</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">14 días</div>
                  <div className="text-sm">Primeros resultados</div>
                </div>
              </div>
            </div>

            <h2>La Ciencia Detrás de la Quema de Grasa Keto</h2>
            <p>
              En cetosis, tu cuerpo produce cetonas que actúan como un combustible 
              súper eficiente. Este proceso aumenta la lipólisis (descomposición de grasa) 
              hasta un 70% más que las dietas tradicionales.
            </p>

            <h3>¿Por Qué Keto Quema Más Grasa?</h3>
            <ul>
              <li><strong>Estado cetogénico:</strong> Grasa como combustible principal</li>
              <li><strong>Menor insulina:</strong> Facilita la liberación de grasa almacenada</li>
              <li><strong>Efecto térmico:</strong> Las proteínas queman más calorías al digerirse</li>
              <li><strong>Preserva músculo:</strong> Quemas grasa, no masa muscular</li>
              <li><strong>Suprime apetito:</strong> Menos calorías consumidas naturalmente</li>
            </ul>

            <h2>Estrategias Avanzadas para Quemar Grasa</h2>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
              <h3 className="text-yellow-800 font-semibold mb-3">🕐 Ayuno Intermitente + Keto</h3>
              <p className="text-yellow-700">
                Combinar keto con ayuno 16:8 puede aumentar la quema de grasa hasta un 50%. 
                Durante el ayuno, tus niveles de cetonas se disparan.
              </p>
            </div>

            <div className="bg-green-50 border-l-4 border-green-400 p-6 mt-4">
              <h3 className="text-green-800 font-semibold mb-3">🌶️ Alimentos Termogénicos</h3>
              <ul className="text-green-700">
                <li>Aceite MCT: Aumenta metabolismo 5-10%</li>
                <li>Cayena: Efecto termogénico inmediato</li>
                <li>Té verde: Catequinas que movilizan grasa</li>
                <li>Jengibre: Mejora la sensibilidad a insulina</li>
              </ul>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mt-4">
              <h3 className="text-blue-800 font-semibold mb-3">⚡ Ejercicio en Ayunas</h3>
              <p className="text-blue-700">
                20-30 minutos de cardio suave en ayunas multiplica la oxidación 
                de grasa. En cetosis, tu cuerpo accede fácilmente a las reservas.
              </p>
            </div>

            <h2>Macros Optimizados para Quemar Grasa</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">75%</div>
                  <div className="text-sm text-gray-600">Grasas saludables</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">20%</div>
                  <div className="text-sm text-gray-600">Proteína magra</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">5%</div>
                  <div className="text-sm text-gray-600">Carbohidratos netos</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}