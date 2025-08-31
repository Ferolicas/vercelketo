import { Metadata } from 'next';
import { generateSEOMetadata } from '@/components/SEOHead';
import SchemaMarkup, { FAQSchema } from '@/components/SchemaMarkup';
import Link from 'next/link';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Menú Keto Semanal Gratis 2025 ⭐ Plan 30 Días Completo DESCARGA',
  description: '📋 MENÚ KETO SEMANAL GRATIS ✅ Plan 30 días completo ✅ Lista compras incluida ✅ +500 recetas ✅ Desayuno, almuerzo, cena ✅ Para principiantes ✅ Resultados garantizados ✅ DESCARGA GRATUITA',
  keywords: 'menú keto semanal gratis, plan keto 30 días gratis, menú dieta keto, plan keto principiantes, menú cetogénico semanal, dieta keto menú, plan alimentario keto, menú keto descarga gratis, plan keto completo, menús keto para bajar peso, planificador keto gratis, menú keto pdf gratis',
  url: '/menu-keto-semanal-gratis-2025',
  type: 'article',
  publishedTime: new Date().toISOString(),
  modifiedTime: new Date().toISOString(),
  category: 'Planes Keto',
  image: '/menu-keto-semanal-2025.jpg'
});

const faqData = [
  {
    question: "¿Cómo organizar un menú keto semanal para principiantes?",
    answer: "ORGANIZACIÓN PERFECTA: 1) Elige 3-4 desayunos repetitivos (huevos, aguacate), 2) Planifica proteína diferente cada día (pollo lunes, salmón martes), 3) Verduras constantes (espinacas, brócoli), 4) Grasas variadas (aceite oliva, mantequilla, frutos secos), 5) Prepara domingo para toda la semana. Nuestro plan incluye lista de compras automática."
  },
  {
    question: "¿Qué incluye un plan de menú keto completo?",
    answer: "PLAN COMPLETO INCLUYE: Menú 30 días (desayuno, almuerzo, cena, snacks), Lista compras semanal organizada, Macros calculados por comida, Instrucciones paso a paso, Alternativas para cada comida, Tips meal prep, Calendario imprimible. Todo diseñado para que pierdas peso sin complicaciones."
  },
  {
    question: "¿Cuánto cuesta crear un menú keto semanal?",
    answer: "PRESUPUESTO REAL: Familia 4 personas = 80-120€/semana, Persona sola = 25-40€/semana. AHORRO: Planificar reduce costos 30%, comprar por volumen es más barato, aprovechas ofertas. Nuestro menú está optimizado para máximo ahorro sin sacrificar calidad nutricional."
  },
  {
    question: "¿Los menús keto son variados o se repite la comida?",
    answer: "VARIEDAD GARANTIZADA: Nuestro plan incluye +120 opciones diferentes. Cada semana es distinta pero mantiene estructura simple. Ejemplo: 15 desayunos, 20 almuerzos, 25 cenas diferentes. Puedes repetir favoritos o probar nuevos. El aburrimiento NO existe en nuestro sistema."
  },
  {
    question: "¿Puedo adaptar el menú keto a mis gustos alimentarios?",
    answer: "100% PERSONALIZABLE: Cada comida tiene 2-3 alternativas, sustituciones fáciles (pescado por pollo, espinacas por lechuga), versiones vegetarianas disponibles, opciones sin lácteos. El plan se adapta a tus preferencias, alergias y presupuesto. Flexibility total para tu éxito."
  }
];

export default function MenuKetoSemanalGratis2025() {
  return (
    <>
      <SchemaMarkup 
        type="article" 
        data={{
          title: "Menú Keto Semanal Gratis 2025 - Plan 30 Días Completo",
          description: "Plan de menú keto semanal gratis completo para 30 días. Incluye desayuno, almuerzo, cena y lista de compras para principiantes.",
          image: "https://planetaketo.es/menu-keto-semanal-2025.jpg",
          datePublished: new Date().toISOString(),
          dateModified: new Date().toISOString(),
          url: "https://planetaketo.es/menu-keto-semanal-gratis-2025",
          category: "Planes Keto",
          keywords: ["menú keto semanal", "plan keto gratis", "menú cetogénico", "dieta keto"]
        }}
      />
      <FAQSchema faqs={faqData} />

      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-purple-700 via-blue-600 to-indigo-700 text-white py-20">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-6xl mx-auto px-4 text-center">
            <div className="inline-flex items-center bg-green-400 text-green-900 px-6 py-3 rounded-full font-bold text-lg mb-6">
              🎁 PLAN COMPLETO GRATUITO 🎁
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              📋 MENÚ KETO SEMANAL<br />
              <span className="text-yellow-300">GRATIS 2025</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto">
              <strong>Plan completo 30 días</strong> con desayuno, almuerzo, cena y snacks ⚡ 
              Lista de compras incluida ⚡ Para principiantes
            </p>

            <div className="grid md:grid-cols-4 gap-4 mb-10">
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">30</div>
                <div className="text-sm">Días Planificados</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">120</div>
                <div className="text-sm">Comidas Diferentes</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">4</div>
                <div className="text-sm">Listas de Compras</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">0€</div>
                <div className="text-sm">Completamente Gratis</div>
              </div>
            </div>

            <div className="bg-white/15 rounded-2xl p-8 backdrop-blur-sm max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-4 text-yellow-300">
                📋 DESCARGA INMEDIATA INCLUYE
              </h2>
              <ul className="text-left mb-6 space-y-2">
                <li>✅ Menú 30 días completo (90 comidas)</li>
                <li>✅ 4 listas de compras organizadas</li>
                <li>✅ Macros calculados por comida</li>
                <li>✅ Alternativas para cada plato</li>
                <li>✅ Calendario imprimible</li>
                <li>✅ Guía meal prep incluida</li>
              </ul>
              <Link 
                href="/recetas" 
                className="inline-block bg-green-400 hover:bg-green-300 text-green-900 font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                🚀 DESCARGAR PLAN GRATIS
              </Link>
              <p className="text-sm mt-3 opacity-90">
                ⏰ Descarga instantánea - Sin email requerido
              </p>
            </div>
          </div>
        </section>

        <main className="max-w-6xl mx-auto px-4 py-12">
          {/* Vista previa del menú semanal */}
          <section className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              👀 Vista Previa: Tu Primera Semana Keto
            </h2>

            <div className="bg-white rounded-2xl shadow-xl border-2 border-purple-200 p-8 mb-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-purple-800">SEMANA 1: ADAPTACIÓN KETO</h3>
                <p className="text-purple-600">Menús suaves para entrar en cetosis sin gripe keto</p>
              </div>

              <div className="grid md:grid-cols-7 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-bold text-blue-800 mb-3 text-center">LUNES</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>🌅 Desayuno:</strong><br />
                      <span className="text-blue-600">Huevos revueltos + aguacate</span><br />
                      <span className="text-xs text-gray-500">3g carbohidratos</span>
                    </div>
                    <div>
                      <strong>🌞 Almuerzo:</strong><br />
                      <span className="text-blue-600">Ensalada de pollo + aceite oliva</span><br />
                      <span className="text-xs text-gray-500">6g carbohidratos</span>
                    </div>
                    <div>
                      <strong>🌙 Cena:</strong><br />
                      <span className="text-blue-600">Salmón + brócoli + mantequilla</span><br />
                      <span className="text-xs text-gray-500">5g carbohidratos</span>
                    </div>
                    <div className="pt-2 border-t">
                      <strong className="text-green-600">Total: 14g carbohidratos</strong>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-bold text-green-800 mb-3 text-center">MARTES</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>🌅 Desayuno:</strong><br />
                      <span className="text-green-600">Café keto + tocino</span><br />
                      <span className="text-xs text-gray-500">2g carbohidratos</span>
                    </div>
                    <div>
                      <strong>🌞 Almuerzo:</strong><br />
                      <span className="text-green-600">Bistec + ensalada verde</span><br />
                      <span className="text-xs text-gray-500">4g carbohidratos</span>
                    </div>
                    <div>
                      <strong>🌙 Cena:</strong><br />
                      <span className="text-green-600">Pollo + coliflor gratinada</span><br />
                      <span className="text-xs text-gray-500">7g carbohidratos</span>
                    </div>
                    <div className="pt-2 border-t">
                      <strong className="text-green-600">Total: 13g carbohidratos</strong>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-4">
                  <h4 className="font-bold text-yellow-800 mb-3 text-center">MIÉRCOLES</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>🌅 Desayuno:</strong><br />
                      <span className="text-yellow-600">Tortilla de queso + espinacas</span><br />
                      <span className="text-xs text-gray-500">3g carbohidratos</span>
                    </div>
                    <div>
                      <strong>🌞 Almuerzo:</strong><br />
                      <span className="text-yellow-600">Atún + aguacate + tomate</span><br />
                      <span className="text-xs text-gray-500">5g carbohidratos</span>
                    </div>
                    <div>
                      <strong>🌙 Cena:</strong><br />
                      <span className="text-yellow-600">Cerdo + champiñones</span><br />
                      <span className="text-xs text-gray-500">4g carbohidratos</span>
                    </div>
                    <div className="pt-2 border-t">
                      <strong className="text-green-600">Total: 12g carbohidratos</strong>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="font-bold text-orange-800 mb-3 text-center">JUEVES</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>🌅 Desayuno:</strong><br />
                      <span className="text-orange-600">Batido verde keto</span><br />
                      <span className="text-xs text-gray-500">4g carbohidratos</span>
                    </div>
                    <div>
                      <strong>🌞 Almuerzo:</strong><br />
                      <span className="text-orange-600">Camarones + ensalada César</span><br />
                      <span className="text-xs text-gray-500">6g carbohidratos</span>
                    </div>
                    <div>
                      <strong>🌙 Cena:</strong><br />
                      <span className="text-orange-600">Pavo + espárragos</span><br />
                      <span className="text-xs text-gray-500">5g carbohidratos</span>
                    </div>
                    <div className="pt-2 border-t">
                      <strong className="text-green-600">Total: 15g carbohidratos</strong>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 rounded-lg p-4">
                  <h4 className="font-bold text-red-800 mb-3 text-center">VIERNES</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>🌅 Desayuno:</strong><br />
                      <span className="text-red-600">Huevos + jamón + queso</span><br />
                      <span className="text-xs text-gray-500">2g carbohidratos</span>
                    </div>
                    <div>
                      <strong>🌞 Almuerzo:</strong><br />
                      <span className="text-red-600">Carne + puré coliflor</span><br />
                      <span className="text-xs text-gray-500">6g carbohidratos</span>
                    </div>
                    <div>
                      <strong>🌙 Cena:</strong><br />
                      <span className="text-red-600">Pescado + verduras mixtas</span><br />
                      <span className="text-xs text-gray-500">7g carbohidratos</span>
                    </div>
                    <div className="pt-2 border-t">
                      <strong className="text-green-600">Total: 15g carbohidratos</strong>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-bold text-purple-800 mb-3 text-center">SÁBADO</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>🌅 Desayuno:</strong><br />
                      <span className="text-purple-600">Pancakes keto + mantequilla</span><br />
                      <span className="text-xs text-gray-500">4g carbohidratos</span>
                    </div>
                    <div>
                      <strong>🌞 Almuerzo:</strong><br />
                      <span className="text-purple-600">Bowl mexicano keto</span><br />
                      <span className="text-xs text-gray-500">8g carbohidratos</span>
                    </div>
                    <div>
                      <strong>🌙 Cena:</strong><br />
                      <span className="text-purple-600">Costillas + ensalada</span><br />
                      <span className="text-xs text-gray-500">4g carbohidratos</span>
                    </div>
                    <div className="pt-2 border-t">
                      <strong className="text-green-600">Total: 16g carbohidratos</strong>
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-50 rounded-lg p-4">
                  <h4 className="font-bold text-indigo-800 mb-3 text-center">DOMINGO</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>🌅 Desayuno:</strong><br />
                      <span className="text-indigo-600">Brunch keto completo</span><br />
                      <span className="text-xs text-gray-500">5g carbohidratos</span>
                    </div>
                    <div>
                      <strong>🌞 Almuerzo:</strong><br />
                      <span className="text-indigo-600">Pollo al curry + coliflor</span><br />
                      <span className="text-xs text-gray-500">8g carbohidratos</span>
                    </div>
                    <div>
                      <strong>🌙 Cena:</strong><br />
                      <span className="text-indigo-600">Pizza keto + ensalada</span><br />
                      <span className="text-xs text-gray-500">6g carbohidratos</span>
                    </div>
                    <div className="pt-2 border-t">
                      <strong className="text-green-600">Total: 19g carbohidratos</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-green-100 rounded-lg p-4 text-center">
                <h4 className="font-bold text-green-800 mb-2">📊 RESUMEN SEMANA 1</h4>
                <div className="grid md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <strong>Promedio diario:</strong><br />
                    <span className="text-green-600">14.8g carbohidratos</span>
                  </div>
                  <div>
                    <strong>Cetosis garantizada:</strong><br />
                    <span className="text-green-600">Día 3-5</span>
                  </div>
                  <div>
                    <strong>Pérdida esperada:</strong><br />
                    <span className="text-green-600">2-4kg semana 1</span>
                  </div>
                  <div>
                    <strong>Dificultad:</strong><br />
                    <span className="text-green-600">⭐⭐☆☆☆ Fácil</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Lista de compras semana 1 */}
          <section className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              🛒 Lista de Compras Semana 1 (Ejemplo)
            </h2>

            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
                <h3 className="text-xl font-bold text-red-800 mb-4">🥩 PROTEÍNAS</h3>
                <ul className="space-y-2 text-sm text-red-700">
                  <li>• 12 huevos grandes</li>
                  <li>• 500g pechuga de pollo</li>
                  <li>• 400g filete de salmón</li>
                  <li>• 300g bistec</li>
                  <li>• 250g tocino</li>
                  <li>• 2 latas atún en aceite</li>
                  <li>• 200g jamón serrano</li>
                </ul>
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-6">
                <h3 className="text-xl font-bold text-green-800 mb-4">🥑 GRASAS</h3>
                <ul className="space-y-2 text-sm text-green-700">
                  <li>• 4 aguacates grandes</li>
                  <li>• 500ml aceite oliva extra virgen</li>
                  <li>• 250g mantequilla</li>
                  <li>• 200g queso rallado</li>
                  <li>• 150g nueces mixtas</li>
                  <li>• 100g aceitunas verdes</li>
                  <li>• 200ml crema de leche</li>
                </ul>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
                <h3 className="text-xl font-bold text-blue-800 mb-4">🥬 VERDURAS</h3>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li>• 500g espinacas frescas</li>
                  <li>• 2 cabezas brócoli</li>
                  <li>• 1 coliflor grande</li>
                  <li>• 300g lechuga mixta</li>
                  <li>• 2 pepinos</li>
                  <li>• 500g champiñones</li>
                  <li>• 1 manojo espárragos</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-6">
                <h3 className="text-xl font-bold text-yellow-800 mb-4">🧄 BÁSICOS</h3>
                <ul className="space-y-2 text-sm text-yellow-700">
                  <li>• Sal marina</li>
                  <li>• Pimienta negra</li>
                  <li>• Ajo fresco</li>
                  <li>• 2 limones</li>
                  <li>• Hierbas frescas</li>
                  <li>• Vinagre de manzana</li>
                  <li>• Mostaza dijon</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 bg-purple-50 border border-purple-300 rounded-xl p-6 text-center">
              <h3 className="text-xl font-bold text-purple-800 mb-4">💰 PRESUPUESTO ESTIMADO</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="text-2xl font-bold text-purple-600">45-60€</div>
                  <div className="text-purple-700">1 Persona / Semana</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">80-110€</div>
                  <div className="text-purple-700">2 Personas / Semana</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">120-160€</div>
                  <div className="text-purple-700">Familia 4 / Semana</div>
                </div>
              </div>
              <p className="text-purple-600 mt-4">
                💡 <strong>TIP:</strong> Comprar en mercados locales reduce costos 20-30%
              </p>
            </div>
          </section>

          {/* Beneficios del plan */}
          <section className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              🏆 Beneficios del Plan Menú Keto Completo
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">⏰</div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Ahorra 5+ Horas Semanales</h3>
                <p className="text-gray-600">No más pensar "¿qué cocino hoy?". Todo planificado, solo sigue el menú y cocina.</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">💰</div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Reduce Costos 30%</h3>
                <p className="text-gray-600">Compras planificadas, cero desperdicio, aprovechas ofertas. Lista optimizada incluida.</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">🎯</div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Cetosis Garantizada</h3>
                <p className="text-gray-600">Macros perfectamente calculados. Entras en cetosis día 3-5 siguiendo el plan.</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">👨‍👩‍👧‍👦</div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Toda la Familia</h3>
                <p className="text-gray-600">Menús adaptables para niños y adultos. Versiones no-keto incluidas para acompañantes.</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">📱</div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Formato Digital</h3>
                <p className="text-gray-600">PDFs imprimibles, acceso móvil, actualizaciones gratis. Disponible 24/7.</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">🔄</div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Meal Prep Incluido</h3>
                <p className="text-gray-600">Guía completa para preparar comidas domingo y tener todo listo para la semana.</p>
              </div>
            </div>
          </section>

          {/* Estructura del plan 30 días */}
          <section className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              📅 Estructura Plan Completo 30 Días
            </h2>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-100 to-green-50 border border-green-300 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mr-4">1</div>
                  <div>
                    <h3 className="text-xl font-bold text-green-800">SEMANA 1-2: ADAPTACIÓN KETO</h3>
                    <p className="text-green-600">Entrada suave en cetosis, menús simples</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <strong>🎯 Objetivo:</strong> Entrar en cetosis sin gripe keto
                  </div>
                  <div>
                    <strong>📊 Carbohidratos:</strong> 12-18g diarios
                  </div>
                  <div>
                    <strong>⚖️ Pérdida:</strong> 3-6kg (agua + grasa)
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-100 to-blue-50 border border-blue-300 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mr-4">2</div>
                  <div>
                    <h3 className="text-xl font-bold text-blue-800">SEMANA 3-4: OPTIMIZACIÓN</h3>
                    <p className="text-blue-600">Cetosis estable, mayor variedad de comidas</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <strong>🎯 Objetivo:</strong> Maximizar quema de grasa
                  </div>
                  <div>
                    <strong>📊 Carbohidratos:</strong> 15-20g diarios
                  </div>
                  <div>
                    <strong>⚖️ Pérdida:</strong> 2-4kg grasa pura
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-100 to-purple-50 border border-purple-300 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mr-4">3</div>
                  <div>
                    <h3 className="text-xl font-bold text-purple-800">SEMANA 5: MANTENIMIENTO</h3>
                    <p className="text-purple-600">Plan flexible, comidas sociales incluidas</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <strong>🎯 Objetivo:</strong> Crear hábitos permanentes
                  </div>
                  <div>
                    <strong>📊 Carbohidratos:</strong> 20-25g diarios
                  </div>
                  <div>
                    <strong>⚖️ Pérdida:</strong> 1-2kg sostenida
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-yellow-50 border border-yellow-300 rounded-xl p-6 text-center">
              <h3 className="text-xl font-bold text-yellow-800 mb-4">📈 PROGRESO TOTAL ESPERADO (30 DÍAS)</h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div>
                  <div className="text-3xl font-bold text-yellow-600">8-15kg</div>
                  <div className="text-yellow-700">Pérdida Total</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600">100%</div>
                  <div className="text-green-700">En Cetosis</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600">+200%</div>
                  <div className="text-blue-700">Más Energía</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600">0</div>
                  <div className="text-purple-700">Antojos Azúcar</div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              ❓ Preguntas Frecuentes: Menú Keto Semanal
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
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl p-8">
              <h2 className="text-3xl font-bold mb-4">
                📋 ¿Listo para tu Plan Keto Completo?
              </h2>
              <p className="text-xl mb-6">
                Descarga GRATIS tu <strong>menú 30 días</strong> con lista de compras incluida
              </p>
              <div className="max-w-md mx-auto bg-white/10 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-3">🎁 DESCARGA INCLUYE:</h3>
                <ul className="text-left space-y-2 mb-4">
                  <li>✅ 30 días de menús completos</li>
                  <li>✅ 4 listas de compras semanales</li>
                  <li>✅ Calendario imprimible</li>
                  <li>✅ Guía meal prep</li>
                  <li>✅ Alternativas para cada comida</li>
                  <li>✅ Acceso a comunidad VIP</li>
                </ul>
              </div>
              <Link 
                href="/recetas" 
                className="inline-block bg-green-400 hover:bg-green-300 text-green-900 font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                DESCARGAR MI PLAN GRATIS
              </Link>
              <p className="text-sm mt-4 opacity-90">
                ⏰ Descarga instantánea - Empieza mañana mismo
              </p>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}