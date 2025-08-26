import { Suspense } from 'react';
import { client } from '@/lib/sanity';
import type { Recipe, Category } from '@/types/sanity';
import { Metadata } from 'next';
import DietaCetogenicaContent from '@/components/DietaCetogenicaContent';

export const metadata: Metadata = {
  title: "Dieta Cetogénica: Guía Científica Completa para Principiantes 2024",
  description: "🧬 Todo sobre la dieta cetogénica: beneficios científicos, estudios, tipos de keto, efectos secundarios y cómo empezar correctamente. Basado en evidencia.",
  keywords: "dieta cetogenica, ketogenic diet, cetogénica científica, keto ciencia, estudios cetogénicos, tipos de keto, cetosis científica, dieta cetogénica beneficios, keto investigación",
  openGraph: {
    title: "Dieta Cetogénica: La Guía Científica Más Completa",
    description: "🧬 Basado en +200 estudios científicos. Descubre los fundamentos, beneficios y aplicación correcta de la dieta cetogénica.",
    type: "website",
    url: "https://planetaketo.es/dieta-cetogenica",
    images: [
      {
        url: "/og-dieta-cetogenica.jpg",
        width: 1200,
        height: 630,
        alt: "Dieta Cetogénica Científica - Planeta Keto",
      }
    ],
  },
  alternates: {
    canonical: "/dieta-cetogenica",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function DietaCetogenicaPage() {
  try {
    const [scientificRecipes, categories, advancedRecipes, therapeuticRecipes] = await Promise.all([
      client.fetch<Recipe[]>(`
        *[_type == "recipe" && averageRating >= 4.0] | order(averageRating desc)[0..12] {
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
      client.fetch<Category[]>(`
        *[_type == "category"] | order(title asc) {
          _id,
          title,
          slug,
          description,
          "postCount": count(*[_type == "recipe" && references(^._id)])
        }
      `),
      client.fetch<Recipe[]>(`
        *[_type == "recipe"] | order(averageRating desc)[0..8] {
          _id,
          name,
          slug,
          thumbnail,
          averageRating,
          category->{
            name,
            slug
          }
        }
      `),
      client.fetch<Recipe[]>(`
        *[_type == "recipe"] | order(averageRating desc)[0..6] {
          _id,
          name,
          slug,
          thumbnail,
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
          <DietaCetogenicaContent 
            scientificRecipes={scientificRecipes}
            categories={categories}
            advancedRecipes={advancedRecipes}
            therapeuticRecipes={therapeuticRecipes}
          />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error('Error loading dieta cetogenica page:', error);
    
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              🧬 Dieta Cetogénica
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              La guía científica más completa sobre la alimentación cetogénica
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 mb-8">
              <h2 className="text-white text-2xl font-bold mb-4">📊 Respaldado por Ciencia</h2>
              <div className="grid md:grid-cols-3 gap-4 text-blue-100">
                <div className="text-center">
                  <div className="text-3xl font-bold">200+</div>
                  <div className="text-sm">Estudios científicos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">90 años</div>
                  <div className="text-sm">De investigación</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">70%</div>
                  <div className="text-sm">Más efectivo</div>
                </div>
              </div>
            </div>

            <h2>¿Qué es la Dieta Cetogénica Realmente?</h2>
            <p>
              La dieta cetogénica es un protocolo nutricional terapéutico desarrollado 
              en 1921 por el Dr. Russell Wilder en Mayo Clinic para tratar epilepsia 
              refractaria en niños. Se basa en inducir cetosis nutricional mediante 
              una drástica reducción de carbohidratos.
            </p>

            <h3>Fundamentos Bioquímicos de la Cetosis</h3>
            <p>
              Cuando los carbohidratos se limitan a menos de 50g/día (preferiblemente &lt;20g), 
              el hígado convierte ácidos grasos en cuerpos cetónicos: acetoacetato, 
              β-hidroxibutirato y acetona. Estos actúan como combustible alternativo 
              para cerebro, corazón y músculos.
            </p>

            <h2>Tipos de Dieta Cetogénica</h2>
            
            <div className="bg-green-50 border-l-4 border-green-400 p-6">
              <h3 className="text-green-800 font-semibold mb-3">🎯 SKD - Standard Ketogenic Diet</h3>
              <ul className="text-green-700">
                <li><strong>Macros:</strong> 70-75% grasa, 20-25% proteína, 5-10% carbohidratos</li>
                <li><strong>Carbohidratos:</strong> &lt;20g netos por día</li>
                <li><strong>Uso:</strong> Pérdida de peso, salud general</li>
              </ul>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mt-4">
              <h3 className="text-blue-800 font-semibold mb-3">💪 TKD - Targeted Ketogenic Diet</h3>
              <ul className="text-blue-700">
                <li><strong>Concepto:</strong> 15-30g carbohidratos alrededor del ejercicio</li>
                <li><strong>Timing:</strong> 30 min antes y después del entrenamiento</li>
                <li><strong>Uso:</strong> Atletas que entrenan intensamente</li>
              </ul>
            </div>

            <div className="bg-purple-50 border-l-4 border-purple-400 p-6 mt-4">
              <h3 className="text-purple-800 font-semibold mb-3">🔄 CKD - Cyclical Ketogenic Diet</h3>
              <ul className="text-purple-700">
                <li><strong>Patrón:</strong> 5-6 días keto + 1-2 días alto en carbohidratos</li>
                <li><strong>Recarga:</strong> 450-600g carbohidratos en días de recarga</li>
                <li><strong>Uso:</strong> Culturistas y atletas de elite</li>
              </ul>
            </div>

            <h2>Beneficios Científicamente Probados</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">📈 Pérdida de Peso</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 2.2x más pérdida de peso vs. dietas bajas en grasa</li>
                  <li>• Reducción significativa de grasa visceral</li>
                  <li>• Preservación de masa muscular magra</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">🧠 Función Neurológica</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Reducción 50% crisis epilépticas</li>
                  <li>• Mejora cognitiva y claridad mental</li>
                  <li>• Neuroprotección contra Alzheimer</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">💓 Salud Cardiovascular</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Aumento HDL ("colesterol bueno")</li>
                  <li>• Reducción triglicéridos hasta 50%</li>
                  <li>• Mejora presión arterial</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">🩺 Salud Metabólica</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Reversión de diabetes tipo 2</li>
                  <li>• Mejor sensibilidad a insulina</li>
                  <li>• Reducción inflamación sistémica</li>
                </ul>
              </div>
            </div>

            <h2>Implementación Científica Correcta</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-yellow-800 font-semibold mb-4">⚠️ Protocolo de Adaptación</h3>
              <ol className="text-yellow-700 space-y-2">
                <li><strong>Semana 1-2:</strong> Keto flu, adaptación enzimática</li>
                <li><strong>Semana 3-4:</strong> Mejora performance, estabilización</li>
                <li><strong>Semana 4-8:</strong> Keto-adaptación completa</li>
                <li><strong>Mes 2+:</strong> Optimización metabólica máxima</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }
}