import { Metadata } from 'next';
import { generateSEOMetadata } from '@/components/SEOHead';
import SchemaMarkup, { FAQSchema } from '@/components/SchemaMarkup';
import Link from 'next/link';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Recetas Keto Fáciles y Rápidas 2025 ⭐ +500 GRATIS en 15 Minutos',
  description: '🍽️ RECETAS KETO RÁPIDAS ✅ Listas en 15 minutos ✅ +500 recetas fáciles ✅ Para principiantes ✅ Videos paso a paso ✅ Ingredientes simples ✅ Resultados garantizados ✅ TODO GRATIS',
  keywords: 'recetas keto fáciles, recetas keto rápidas, recetas cetogénicas fáciles, recetas keto 15 minutos, recetas keto principiantes, comida keto fácil, desayuno keto rápido, cena keto fácil, almuerzo keto rápido, recetas keto simples, recetas low carb fáciles, cocina keto principiantes, menu keto sencillo, recetas keto sin complicaciones, comidas keto express, recetas keto paso a paso',
  url: '/recetas-keto-faciles-rapidas-2025',
  type: 'article',
  publishedTime: new Date().toISOString(),
  modifiedTime: new Date().toISOString(),
  category: 'Recetas Keto',
  image: '/recetas-keto-faciles-2025.jpg'
});

const faqData = [
  {
    question: "¿Cuáles son las recetas keto más fáciles para principiantes?",
    answer: "Las recetas keto más fáciles para principiantes son: 1) Huevos revueltos con aguacate (5 min), 2) Ensalada con pollo y aceite oliva (10 min), 3) Salmón con verduras al vapor (15 min), 4) Tortilla de queso (8 min), 5) Batido de aguacate y coco (3 min). Todas requieren menos de 5 ingredientes y técnicas básicas de cocina."
  },
  {
    question: "¿Cómo hacer recetas keto en menos de 15 minutos?",
    answer: "Para hacer recetas keto rápidas: 1) Prepara ingredientes los domingos (meal prep), 2) Ten siempre huevos, aguacate y aceite oliva, 3) Usa técnicas simples (salteado, plancha, vapor), 4) Combina proteína + grasa + verdura verde, 5) Cocina en lotes grandes. El 85% de nuestras recetas están listas en 10-15 minutos máximo."
  },
  {
    question: "¿Qué ingredientes básicos necesito para recetas keto fáciles?",
    answer: "DESPENSA KETO BÁSICA: Proteínas (huevos, pollo, salmón, carne), Grasas (aceite oliva, mantequilla, aguacate), Verduras (espinacas, brócoli, coliflor), Lácteos (queso, crema), Condimentos (sal, pimienta, hierbas). Con estos 15 ingredientes puedes hacer +100 combinaciones diferentes."
  },
  {
    question: "¿Las recetas keto son complicadas de hacer?",
    answer: "NO, las recetas keto son muy simples. El 90% requieren técnicas básicas: freír, hervir, hornear o mezclar. No necesitas ser chef. La clave está en la combinación correcta: 70% grasas + 25% proteínas + 5% carbohidratos. Nuestras recetas tienen máximo 6 ingredientes y pasos muy claros."
  },
  {
    question: "¿Puedo hacer meal prep con recetas keto fáciles?",
    answer: "SÍ, el meal prep keto es perfectísimo. Recetas ideales: 1) Pollo al horno con verduras (dura 4 días), 2) Huevos duros y aguacate, 3) Ensaladas con proteína, 4) Sopas keto, 5) Bolitas de carne con queso. Dedica 2 horas el domingo y tendrás comidas para toda la semana."
  }
];

export default function RecetasKetoFacilesRapidas2025() {
  return (
    <>
      <SchemaMarkup 
        type="article" 
        data={{
          title: "Recetas Keto Fáciles y Rápidas 2025 - +500 GRATIS en 15 Minutos",
          description: "La colección más completa de recetas keto fáciles y rápidas. Más de 500 recetas listas en 15 minutos, perfectas para principiantes.",
          image: "https://planetaketo.es/recetas-keto-faciles-2025.jpg",
          datePublished: new Date().toISOString(),
          dateModified: new Date().toISOString(),
          url: "https://planetaketo.es/recetas-keto-faciles-rapidas-2025",
          category: "Recetas Keto",
          keywords: ["recetas keto fáciles", "recetas rápidas", "keto principiantes", "15 minutos"]
        }}
      />
      <FAQSchema faqs={faqData} />

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 text-white py-20">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-6xl mx-auto px-4 text-center">
            <div className="inline-flex items-center bg-yellow-400 text-yellow-900 px-6 py-3 rounded-full font-bold text-lg mb-6">
              🔥 +500 RECETAS NUEVAS 2025 🔥
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              🍽️ RECETAS KETO<br />
              <span className="text-yellow-300">FÁCILES Y RÁPIDAS</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto">
              <strong>Listas en 15 minutos o menos</strong> ⚡ Sin complicaciones ⚡ 
              Perfectas para principiantes ⚡ Ingredientes simples
            </p>

            <div className="grid md:grid-cols-4 gap-4 mb-10">
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm">Recetas Fáciles</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">15 min</div>
                <div className="text-sm">Máximo de Cocina</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">5</div>
                <div className="text-sm">Ingredientes Máximo</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">100%</div>
                <div className="text-sm">Gratis</div>
              </div>
            </div>

            <div className="bg-white/15 rounded-2xl p-8 backdrop-blur-sm max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-4 text-yellow-300">
                🎯 ACCESO INMEDIATO GRATIS
              </h2>
              <ul className="text-left mb-6 space-y-2">
                <li>✅ 500+ recetas en 15 minutos máximo</li>
                <li>✅ Videos paso a paso HD</li>
                <li>✅ Lista de compras automática</li>
                <li>✅ Calculadora de macros incluida</li>
                <li>✅ Meal prep para toda la semana</li>
              </ul>
              <Link 
                href="/recetas" 
                className="inline-block bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                🚀 VER TODAS LAS RECETAS AHORA
              </Link>
            </div>
          </div>
        </section>

        <main className="max-w-6xl mx-auto px-4 py-12">
          {/* Recetas por tiempo de preparación */}
          <section className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              ⏱️ Recetas Keto por Tiempo de Preparación
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-6">
                <h3 className="text-xl font-bold text-green-800 mb-4">⚡ 5 MINUTOS O MENOS</h3>
                <div className="space-y-4">
                  <div className="border-b border-green-200 pb-3">
                    <h4 className="font-semibold text-green-700">🥑 Aguacate con Huevo</h4>
                    <p className="text-sm text-green-600">Aguacate + huevo duro + sal + pimienta</p>
                    <div className="text-xs text-gray-500 mt-1">3g carbohidratos netos</div>
                  </div>
                  
                  <div className="border-b border-green-200 pb-3">
                    <h4 className="font-semibold text-green-700">🧀 Rollitos de Queso y Jamón</h4>
                    <p className="text-sm text-green-600">Queso crema + jamón + pepino</p>
                    <div className="text-xs text-gray-500 mt-1">2g carbohidratos netos</div>
                  </div>

                  <div className="border-b border-green-200 pb-3">
                    <h4 className="font-semibold text-green-700">🥤 Batido Verde Express</h4>
                    <p className="text-sm text-green-600">Espinacas + aguacate + leche coco</p>
                    <div className="text-xs text-gray-500 mt-1">4g carbohidratos netos</div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-green-700">🥩 Carpaccio Rápido</h4>
                    <p className="text-sm text-green-600">Carne cruda + aceite oliva + limón</p>
                    <div className="text-xs text-gray-500 mt-1">1g carbohidratos netos</div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-6">
                <h3 className="text-xl font-bold text-yellow-800 mb-4">🔥 10 MINUTOS</h3>
                <div className="space-y-4">
                  <div className="border-b border-yellow-200 pb-3">
                    <h4 className="font-semibold text-yellow-700">🍳 Tortilla de Queso</h4>
                    <p className="text-sm text-yellow-600">3 huevos + queso rallado + mantequilla</p>
                    <div className="text-xs text-gray-500 mt-1">2g carbohidratos netos</div>
                  </div>
                  
                  <div className="border-b border-yellow-200 pb-3">
                    <h4 className="font-semibold text-yellow-700">🥗 Ensalada César Express</h4>
                    <p className="text-sm text-yellow-600">Lechuga + pollo + parmesano + aderezo</p>
                    <div className="text-xs text-gray-500 mt-1">5g carbohidratos netos</div>
                  </div>

                  <div className="border-b border-yellow-200 pb-3">
                    <h4 className="font-semibold text-yellow-700">🐟 Salmón a la Plancha</h4>
                    <p className="text-sm text-yellow-600">Filete salmón + mantequilla + hierbas</p>
                    <div className="text-xs text-gray-500 mt-1">0g carbohidratos netos</div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-yellow-700">🍄 Champiñones Salteados</h4>
                    <p className="text-sm text-yellow-600">Champiñones + ajo + aceite oliva</p>
                    <div className="text-xs text-gray-500 mt-1">3g carbohidratos netos</div>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-6">
                <h3 className="text-xl font-bold text-orange-800 mb-4">🥘 15 MINUTOS</h3>
                <div className="space-y-4">
                  <div className="border-b border-orange-200 pb-3">
                    <h4 className="font-semibold text-orange-700">🍖 Carne con Verduras</h4>
                    <p className="text-sm text-orange-600">Bistec + brócoli + aceite coco</p>
                    <div className="text-xs text-gray-500 mt-1">6g carbohidratos netos</div>
                  </div>
                  
                  <div className="border-b border-orange-200 pb-3">
                    <h4 className="font-semibold text-orange-700">🧄 Pollo al Ajo</h4>
                    <p className="text-sm text-orange-600">Pechuga + ajo + mantequilla + limón</p>
                    <div className="text-xs text-gray-500 mt-1">3g carbohidratos netos</div>
                  </div>

                  <div className="border-b border-orange-200 pb-3">
                    <h4 className="font-semibold text-orange-700">🍲 Sopa Cremosa Express</h4>
                    <p className="text-sm text-orange-600">Coliflor + crema + queso + caldo</p>
                    <div className="text-xs text-gray-500 mt-1">4g carbohidratos netos</div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-orange-700">🥙 Wrap de Lechuga</h4>
                    <p className="text-sm text-orange-600">Hojas lechuga + atún + mayo + aguacate</p>
                    <div className="text-xs text-gray-500 mt-1">4g carbohidratos netos</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Recetas por momento del día */}
          <section className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              🌅 Recetas Keto Fáciles por Momento del Día
            </h2>

            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <h3 className="text-2xl font-bold text-blue-800 mb-6 flex items-center">
                  ☀️ DESAYUNOS KETO (5-10 minutos)
                </h3>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-bold text-blue-700 mb-2">🥓 Huevos con Tocino</h4>
                    <p className="text-sm text-blue-600 mb-2">2 huevos + 3 tiras tocino + mantequilla</p>
                    <div className="text-xs text-gray-500">⏱️ 8 min | 1g carbos | 28g grasas</div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-bold text-blue-700 mb-2">☕ Café Keto Cremoso</h4>
                    <p className="text-sm text-blue-600 mb-2">Café + mantequilla + aceite MCT</p>
                    <div className="text-xs text-gray-500">⏱️ 3 min | 0g carbos | 24g grasas</div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-bold text-blue-700 mb-2">🧀 Revuelto de Queso</h4>
                    <p className="text-sm text-blue-600 mb-2">3 huevos + queso crema + cebollín</p>
                    <div className="text-xs text-gray-500">⏱️ 6 min | 2g carbos | 26g grasas</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <h3 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                  🌞 ALMUERZOS KETO (10-15 minutos)
                </h3>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-bold text-green-700 mb-2">🥗 Bowl de Atún</h4>
                    <p className="text-sm text-green-600 mb-2">Atún + aguacate + huevo + aceitunas</p>
                    <div className="text-xs text-gray-500">⏱️ 5 min | 4g carbos | 22g grasas</div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-bold text-green-700 mb-2">🍖 Bistec Express</h4>
                    <p className="text-sm text-green-600 mb-2">Filete + ensalada + vinagreta keto</p>
                    <div className="text-xs text-gray-500">⏱️ 12 min | 5g carbos | 30g grasas</div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-bold text-green-700 mb-2">🍤 Camarones Salteados</h4>
                    <p className="text-sm text-green-600 mb-2">Camarones + ajo + mantequilla + limón</p>
                    <div className="text-xs text-gray-500">⏱️ 8 min | 3g carbos | 18g grasas</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <h3 className="text-2xl font-bold text-purple-800 mb-6 flex items-center">
                  🌙 CENAS KETO (10-15 minutos)
                </h3>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h4 className="font-bold text-purple-700 mb-2">🐟 Salmón con Espárragos</h4>
                    <p className="text-sm text-purple-600 mb-2">Salmón + espárragos + aceite oliva</p>
                    <div className="text-xs text-gray-500">⏱️ 15 min | 4g carbos | 25g grasas</div>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4">
                    <h4 className="font-bold text-purple-700 mb-2">🥩 Carne con Coliflor</h4>
                    <p className="text-sm text-purple-600 mb-2">Carne molida + coliflor + queso</p>
                    <div className="text-xs text-gray-500">⏱️ 12 min | 6g carbos | 28g grasas</div>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4">
                    <h4 className="font-bold text-purple-700 mb-2">🍲 Sopa Cremosa Rápida</h4>
                    <p className="text-sm text-purple-600 mb-2">Brócoli + crema + caldo + especias</p>
                    <div className="text-xs text-gray-500">⏱️ 10 min | 5g carbos | 20g grasas</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Consejos para cocinar rápido */}
          <section className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              💡 Secretos para Cocinar Keto Súper Rápido
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-blue-800 mb-4">🛒 PREPARACIÓN PREVIA</h3>
                <ul className="space-y-3 text-blue-700">
                  <li className="flex items-start">
                    <span className="bg-blue-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</span>
                    <div>
                      <strong>Meal prep domingos:</strong> Corta verduras, cocina proteínas en lotes, prepara aderezos
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</span>
                    <div>
                      <strong>Ten básicos siempre:</strong> Huevos, aguacate, queso, aceite oliva, mantequilla
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</span>
                    <div>
                      <strong>Congela porciones:</strong> Carnes, pescados y verduras pre-cortadas
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">4</span>
                    <div>
                      <strong>Lista de compras fija:</strong> Mismos ingredientes base cada semana
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-green-800 mb-4">⚡ TÉCNICAS RÁPIDAS</h3>
                <ul className="space-y-3 text-green-700">
                  <li className="flex items-start">
                    <span className="bg-green-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</span>
                    <div>
                      <strong>Una sartén = una comida:</strong> Proteína + grasa + verdura todo junto
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</span>
                    <div>
                      <strong>Microondas para verduras:</strong> Brócoli, coliflor listos en 3 minutos
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</span>
                    <div>
                      <strong>Huevos = proteína rápida:</strong> Revueltos, duros, tortilla en minutos
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">4</span>
                    <div>
                      <strong>Ensaladas armadas:</strong> Base + proteína + grasa = comida completa
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 bg-yellow-50 border border-yellow-300 rounded-xl p-6">
              <h3 className="text-xl font-bold text-yellow-800 mb-4">🏆 FÓRMULA MÁGICA: COMIDA KETO EN 5 MINUTOS</h3>
              <div className="bg-white rounded-lg p-6">
                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-3xl mb-2">🥩</div>
                    <h4 className="font-bold text-gray-800 mb-2">PROTEÍNA</h4>
                    <p className="text-sm text-gray-600">Huevos, atún, pollo cocido, queso, jamón</p>
                  </div>
                  <div>
                    <div className="text-3xl mb-2">🥑</div>
                    <h4 className="font-bold text-gray-800 mb-2">GRASA</h4>
                    <p className="text-sm text-gray-600">Aguacate, aceite oliva, mantequilla, frutos secos</p>
                  </div>
                  <div>
                    <div className="text-3xl mb-2">🥬</div>
                    <h4 className="font-bold text-gray-800 mb-2">VERDURA</h4>
                    <p className="text-sm text-gray-600">Espinacas, lechuga, pepino, tomate</p>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <p className="text-lg font-semibold text-gray-800">
                    <span className="text-red-500">1 Proteína</span> + <span className="text-green-500">1 Grasa</span> + <span className="text-blue-500">1 Verdura</span> = 
                    <span className="text-yellow-600 ml-2">COMIDA KETO PERFECTA</span>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              ❓ Preguntas Frecuentes: Recetas Keto Fáciles
            </h2>
            
            <div className="space-y-6">
              {faqData.map((faq, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Final */}
          <section className="text-center">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-2xl p-8">
              <h2 className="text-3xl font-bold mb-4">
                🍽️ ¿Listo para Cocinar Keto Fácil y Rápido?
              </h2>
              <p className="text-xl mb-6">
                Accede GRATIS a nuestras <strong>500+ recetas</strong> listas en 15 minutos
              </p>
              <div className="max-w-md mx-auto bg-white/10 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-3">🎁 INCLUYE GRATIS:</h3>
                <ul className="text-left space-y-2 mb-4">
                  <li>✅ Videos paso a paso HD</li>
                  <li>✅ Lista compras automática</li>
                  <li>✅ Calculadora macros</li>
                  <li>✅ Meal prep semanal</li>
                  <li>✅ Comunidad de apoyo</li>
                </ul>
              </div>
              <Link 
                href="/recetas" 
                className="inline-block bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                VER TODAS LAS RECETAS AHORA
              </Link>
              <p className="text-sm mt-4 opacity-90">
                ⏰ Acceso inmediato - Sin registros complicados
              </p>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}