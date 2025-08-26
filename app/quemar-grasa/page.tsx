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
      <div className="min-h-screen bg-white pt-20">
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
      <div className="min-h-screen bg-white pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              🔥 Quemar Grasa con Keto
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Convierte tu cuerpo en una máquina quema-grasa las 24 horas
            </p>
          </div>

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