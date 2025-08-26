import { Suspense } from 'react';
import { client } from '@/lib/sanity';
import type { Post } from '@/types/sanity';
import { Metadata } from 'next';
import DietaBajaCarbohidratosContent from '@/components/DietaBajaCarbohidratosContent';

export const metadata: Metadata = {
  title: "Dieta Baja en Carbohidratos: Guía Completa Low-Carb 2024",
  description: "🥬 Todo sobre dietas bajas en carbohidratos: tipos, beneficios, alimentos permitidos y recetas. Desde low-carb hasta keto extremo. Guía paso a paso.",
  keywords: "dieta baja carbohidratos, low carb, dieta sin carbohidratos, alimentos bajos carbohidratos, menu bajo carbohidratos, recetas low carb, dieta hipocarbónica, carbohidratos netos",
  openGraph: {
    title: "Dieta Baja en Carbohidratos: De Low-Carb a Keto",
    description: "🥬 Guía completa de dietas bajas en carbohidratos. Aprende los diferentes niveles, beneficios y cómo implementarlas correctamente.",
    type: "website",
    url: "https://planetaketo.es/dieta-baja-carbohidratos",
    images: [
      {
        url: "/og-baja-carbohidratos.jpg",
        width: 1200,
        height: 630,
        alt: "Dieta Baja en Carbohidratos - Planeta Keto",
      }
    ],
  },
  alternates: {
    canonical: "/dieta-baja-carbohidratos",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function DietaBajaCarbohidratosPage() {
  try {
    const [lowCarbRecipes, moderateRecipes, ultraLowRecipes] = await Promise.all([
      client.fetch<Post[]>(`
        *[_type == "post" && macros.carbs <= 15] | order(rating desc)[0..12] {
          _id,
          title,
          slug,
          mainImage,
          excerpt,
          preparationTime,
          level,
          rating,
          calories,
          macros,
          category->{
            title,
            slug
          }
        }
      `),
      client.fetch<Post[]>(`
        *[_type == "post" && macros.carbs > 15 && macros.carbs <= 30] | order(rating desc)[0..8] {
          _id,
          title,
          slug,
          mainImage,
          macros,
          rating,
          category->{
            title,
            slug
          }
        }
      `),
      client.fetch<Post[]>(`
        *[_type == "post" && macros.carbs <= 5] | order(rating desc)[0..6] {
          _id,
          title,
          slug,
          mainImage,
          macros,
          rating
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
          <DietaBajaCarbohidratosContent 
            lowCarbRecipes={lowCarbRecipes}
            moderateRecipes={moderateRecipes}
            ultraLowRecipes={ultraLowRecipes}
          />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error('Error loading dieta baja carbohidratos page:', error);
    
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              🥬 Dieta Baja en Carbohidratos
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Tu guía completa para dominar las dietas low-carb
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-2xl p-8 mb-8">
              <h2 className="text-white text-2xl font-bold mb-4">📊 Niveles de Carbohidratos</h2>
              <div className="grid md:grid-cols-4 gap-4 text-green-100">
                <div className="text-center">
                  <div className="text-2xl font-bold">150-100g</div>
                  <div className="text-sm">Moderado</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">100-50g</div>
                  <div className="text-sm">Low-Carb</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">50-20g</div>
                  <div className="text-sm">Muy Bajo</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">&lt;20g</div>
                  <div className="text-sm">Cetogénico</div>
                </div>
              </div>
            </div>

            <h2>¿Qué Son las Dietas Bajas en Carbohidratos?</h2>
            <p>
              Las dietas bajas en carbohidratos limitan la ingesta de carbohidratos 
              (azúcares, almidones y fibra) favoreciendo proteínas, grasas saludables 
              y vegetales de hoja verde. Existen múltiples variantes según el nivel 
              de restricción.
            </p>

            <h2>Tipos de Dietas Low-Carb</h2>
            
            <div className="space-y-6">
              <div className="bg-blue-50 border-l-4 border-blue-400 p-6">
                <h3 className="text-blue-800 font-semibold mb-3">🥗 Moderada en Carbohidratos (100-150g)</h3>
                <ul className="text-blue-700">
                  <li><strong>Perfil:</strong> Para personas activas y deportistas</li>
                  <li><strong>Incluye:</strong> Frutas, tubérculos ocasionales, legumbres</li>
                  <li><strong>Beneficios:</strong> Sostenible a largo plazo, flexible</li>
                  <li><strong>Ideal para:</strong> Mantenimiento de peso, deportistas</li>
                </ul>
              </div>

              <div className="bg-green-50 border-l-4 border-green-400 p-6">
                <h3 className="text-green-800 font-semibold mb-3">🥒 Low-Carb Clásica (50-100g)</h3>
                <ul className="text-green-700">
                  <li><strong>Perfil:</strong> Pérdida de peso efectiva sin cetosis</li>
                  <li><strong>Incluye:</strong> Vegetales, frutas bajas en azúcar</li>
                  <li><strong>Beneficios:</strong> Control de hambre, pérdida sostenida</li>
                  <li><strong>Ideal para:</strong> Principiantes, diabéticos tipo 2</li>
                </ul>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-400 p-6">
                <h3 className="text-orange-800 font-semibold mb-3">🥩 Muy Baja en Carbohidratos (20-50g)</h3>
                <ul className="text-orange-700">
                  <li><strong>Perfil:</strong> Transición hacia cetosis</li>
                  <li><strong>Incluye:</strong> Solo vegetales de hoja y crucíferas</li>
                  <li><strong>Beneficios:</strong> Pérdida rápida, control metabólico</li>
                  <li><strong>Ideal para:</strong> Pérdida agresiva, pre-diabéticos</li>
                </ul>
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-400 p-6">
                <h3 className="text-purple-800 font-semibold mb-3">🧈 Cetogénica (&lt;20g)</h3>
                <ul className="text-purple-700">
                  <li><strong>Perfil:</strong> Cetosis nutricional completa</li>
                  <li><strong>Incluye:</strong> Mínimos carbohidratos, alta grasa</li>
                  <li><strong>Beneficios:</strong> Máxima quema grasa, claridad mental</li>
                  <li><strong>Ideal para:</strong> Obesidad, epilepsia, rendimiento</li>
                </ul>
              </div>
            </div>

            <h2>Beneficios de las Dietas Bajas en Carbohidratos</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">⚖️ Pérdida de Peso</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Reducción automática de calorías</li>
                  <li>• Mayor saciedad con proteínas y grasas</li>
                  <li>• Pérdida de agua inicial motivadora</li>
                  <li>• Preservación de masa muscular</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">🩸 Control Glucémico</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Menor necesidad de insulina</li>
                  <li>• Glucosa sanguínea estable</li>
                  <li>• Reducción de resistencia insulínica</li>
                  <li>• Prevención diabetes tipo 2</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">❤️ Salud Cardiovascular</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Aumento HDL colesterol</li>
                  <li>• Reducción triglicéridos</li>
                  <li>• Mejora perfil lipídico</li>
                  <li>• Menor inflamación</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">🧠 Función Mental</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Energía mental estable</li>
                  <li>• Mejor concentración</li>
                  <li>• Menos brain fog</li>
                  <li>• Humor más estable</li>
                </ul>
              </div>
            </div>

            <h2>Alimentos Permitidos por Nivel</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full mt-4 border-collapse bg-white rounded-lg shadow">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border p-3 text-left">Categoría</th>
                    <th className="border p-3 text-center">Moderado</th>
                    <th className="border p-3 text-center">Low-Carb</th>
                    <th className="border p-3 text-center">Muy Bajo</th>
                    <th className="border p-3 text-center">Keto</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-3 font-medium">Vegetales de hoja</td>
                    <td className="border p-3 text-center">✅</td>
                    <td className="border p-3 text-center">✅</td>
                    <td className="border p-3 text-center">✅</td>
                    <td className="border p-3 text-center">✅</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border p-3 font-medium">Crucíferas</td>
                    <td className="border p-3 text-center">✅</td>
                    <td className="border p-3 text-center">✅</td>
                    <td className="border p-3 text-center">✅</td>
                    <td className="border p-3 text-center">✅</td>
                  </tr>
                  <tr>
                    <td className="border p-3 font-medium">Aguacate</td>
                    <td className="border p-3 text-center">✅</td>
                    <td className="border p-3 text-center">✅</td>
                    <td className="border p-3 text-center">✅</td>
                    <td className="border p-3 text-center">✅</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border p-3 font-medium">Frutas bajas en azúcar</td>
                    <td className="border p-3 text-center">✅</td>
                    <td className="border p-3 text-center">✅</td>
                    <td className="border p-3 text-center">⚠️</td>
                    <td className="border p-3 text-center">❌</td>
                  </tr>
                  <tr>
                    <td className="border p-3 font-medium">Tubérculos</td>
                    <td className="border p-3 text-center">✅</td>
                    <td className="border p-3 text-center">⚠️</td>
                    <td className="border p-3 text-center">❌</td>
                    <td className="border p-3 text-center">❌</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border p-3 font-medium">Legumbres</td>
                    <td className="border p-3 text-center">✅</td>
                    <td className="border p-3 text-center">❌</td>
                    <td className="border p-3 text-center">❌</td>
                    <td className="border p-3 text-center">❌</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8">
              <h3 className="text-yellow-800 font-semibold mb-4">💡 Consejo de Implementación</h3>
              <p className="text-yellow-700">
                Comienza con el nivel moderado (100-150g) durante 2 semanas, luego 
                reduce gradualmente hasta encontrar tu nivel óptimo. Escucha a tu 
                cuerpo y ajusta según tu estilo de vida y objetivos.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}