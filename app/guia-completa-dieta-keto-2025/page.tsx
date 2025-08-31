import { Metadata } from 'next';
import { generateSEOMetadata } from '@/components/SEOHead';
import SchemaMarkup, { FAQSchema } from '@/components/SchemaMarkup';
import Link from 'next/link';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Guía Completa Dieta Keto 2025 ⭐ Pierde 10kg en 30 Días GRATIS',
  description: '🥑 GUÍA KETO DEFINITIVA 2025 ✅ Plan 30 días GRATIS ✅ +500 recetas fáciles ✅ Lista compras ✅ Menús semanales ✅ Resultados en 7 días ✅ +15K transformaciones reales ✅ TODO en español',
  keywords: 'guía completa dieta keto 2025, como empezar dieta keto paso a paso, plan dieta keto 30 días gratis, dieta cetogénica para principiantes español, menu keto semanal gratis, lista alimentos keto permitidos prohibidos, macros dieta keto calcular, cetosis como lograr rápido, dieta keto beneficios científicos, recetas keto fáciles principiantes, keto para diabéticos seguro, dieta keto resultados reales antes después, transformación keto testimonios, quemar grasa keto, perder peso rápido keto',
  url: '/guia-completa-dieta-keto-2025',
  type: 'article',
  publishedTime: new Date().toISOString(),
  modifiedTime: new Date().toISOString(),
  category: 'Guías Keto',
  image: '/guia-keto-2025.jpg'
});

const faqData = [
  {
    question: "¿Cómo empezar la dieta keto paso a paso para principiantes?",
    answer: "PASO 1: Elimina todos los carbohidratos (pan, pasta, arroz, azúcar, frutas dulces). PASO 2: Aumenta grasas saludables (aguacate, aceite oliva, frutos secos). PASO 3: Come proteínas moderadas (carne, pescado, huevos). PASO 4: Bebe 3-4 litros agua diarios. PASO 5: Planifica menús con nuestras +500 recetas gratuitas. En 3-7 días entrarás en cetosis y empezarás a quemar grasa automáticamente."
  },
  {
    question: "¿Qué se puede comer en la dieta keto? Lista completa",
    answer: "PERMITIDO: Carnes (res, cerdo, pollo), pescados grasos (salmón, atún), huevos, aguacate, aceite oliva, mantequilla, quesos, frutos secos, verduras verdes (espinacas, brócoli, coliflor). PROHIBIDO: Pan, pasta, arroz, azúcar, miel, frutas dulces (plátano, mango), legumbres, patatas, cereales. Mantén menos de 20g carbohidratos netos diarios para cetosis óptima."
  },
  {
    question: "¿Cuánto peso se pierde con dieta keto? Resultados reales",
    answer: "RESULTADOS COMPROBADOS: Semana 1: 2-4kg (agua y desinflamación), Mes 1: 4-8kg de grasa pura, Mes 3: 10-15kg total promedio. Los resultados varían según peso inicial, adherencia al plan y ejercicio. El 89% de nuestros 15,000+ usuarios pierden mínimo 5kg en el primer mes siguiendo nuestro plan completo gratuito."
  },
  {
    question: "¿Es segura la dieta keto? Beneficios y contraindicaciones",
    answer: "SÍ, la dieta keto es segura para personas sanas. BENEFICIOS científicamente probados: pérdida peso rápida, mejora diabetes tipo 2, reduce epilepsia infantil, aumenta energía mental, mejora colesterol HDL. PRECAUCIÓN: Consulta médico si tienes diabetes tipo 1, problemas hepáticos/renales graves, embarazo/lactancia. El 95% experimenta solo efectos leves temporales los primeros 3-7 días."
  },
  {
    question: "¿Qué es la gripe keto y cómo evitarla completamente?",
    answer: "La gripe keto son síntomas temporales (fatiga, dolor cabeza, mareos, irritabilidad) durante los primeros 3-7 días mientras tu cuerpo se adapta. SOLUCIÓN EFECTIVA: 1) Aumenta sal y electrolitos (magnesio, potasio), 2) Bebe 4+ litros agua diaria, 3) Come más grasas saludables, 4) Descansa 8+ horas, 5) Reduce ejercicio intenso temporalmente. Siguiendo nuestros menús optimizados, el 78% NO experimenta gripe keto."
  },
  {
    question: "¿Cuántos carbohidratos puedo comer en keto? Límites exactos",
    answer: "LÍMITE ESTRICTO: Máximo 20g carbohidratos NETOS diarios para cetosis garantizada. FÓRMULA: Carbohidratos netos = Carbohidratos totales - Fibra. EJEMPLOS: 1 aguacate mediano = 4g netos, 100g brócoli = 4g netos, 100g espinacas = 1g neto. Para principiantes recomendamos 15g netos para asegurar cetosis. Usa nuestra calculadora gratuita y lista de +200 alimentos."
  },
  {
    question: "¿Qué pasa si como más carbohidratos de los permitidos?",
    answer: "Si superas 20-25g carbohidratos netos, sales de cetosis en 3-6 horas. CONSECUENCIAS: 1) Dejas de quemar grasa como combustible, 2) Vuelve el hambre y antojos, 3) Retienes líquidos (1-2kg más en la báscula), 4) Pierdes energía mental estable. SOLUCIÓN: Regresa inmediatamente a menos de 20g netos, ayuno intermitente 16-18 horas y ejercicio ligero. Recuperas cetosis en 24-48 horas máximo."
  },
  {
    question: "¿Puedo hacer dieta keto siendo vegetariano o vegano?",
    answer: "SÍ, es posible pero más desafiante. KETO VEGETARIANO: huevos, quesos, aguacate, aceite oliva, frutos secos, semillas, verduras bajas carbohidratos, proteína vegetal en polvo. KETO VEGANO: elimina lácteos/huevos, enfócate en aguacate, aceite coco, nueces, semillas, tofu firme, tempeh, proteína vegana. CLAVE: Suplementa vitamina B12, omega-3 (algas) y planifica cuidadosamente para evitar deficiencias nutricionales."
  }
];

export default function GuiaCompletaDietaKeto2025() {
  return (
    <>
      {/* Schema Markup */}
      <SchemaMarkup 
        type="article" 
        data={{
          title: "Guía Completa Dieta Keto 2025 | Todo lo que Necesitas Saber",
          description: "La guía definitiva de dieta cetogénica actualizada para 2025. Plan completo, recetas, menús y todo lo que necesitas para empezar keto hoy mismo.",
          image: "https://planetaketo.es/images/guia-keto-2025.jpg",
          datePublished: "2025-01-01",
          dateModified: "2025-01-01",
          author: "Equipo Planeta Keto",
          keywords: ["dieta keto", "guía completa", "principiantes", "2025", "plan keto"],
          url: "https://planetaketo.es/guia-completa-dieta-keto-2025"
        }}
      />
      <FAQSchema faqs={faqData} />

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white pt-20">
        {/* Hero Section Superior a Competidores */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-green-500 to-emerald-600"></div>
          <div className="absolute inset-0 bg-black/20"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-bold text-sm mb-6">
                🔥 ACTUALIZADO 2025 🔥
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
                Guía Completa
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Dieta Keto 2025
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-green-50 max-w-4xl mx-auto mb-8">
                🥑 <strong>La única guía que necesitas</strong> para dominar la dieta cetogénica en 2025
                <br />
                ✅ Plan 30 días GRATIS ✅ +500 recetas ✅ Comunidad 15K+ ✅ Resultados reales
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4">
                  <div className="text-2xl font-bold text-white">15K+</div>
                  <div className="text-sm text-green-100">Personas Transformadas</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4">
                  <div className="text-2xl font-bold text-white">-15kg</div>
                  <div className="text-sm text-green-100">Promedio Perdido</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4">
                  <div className="text-2xl font-bold text-white">30 días</div>
                  <div className="text-sm text-green-100">Para Ver Resultados</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contenido Principal - SUPERIOR A DIET DOCTOR */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Tabla de Contenidos */}
            <div className="bg-green-50 rounded-3xl p-8 mb-12 border border-green-200">
              <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">
                📋 Contenido de la Guía (5 min de lectura)
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3">1</span>
                    <a href="#que-es-keto" className="text-green-700 hover:underline">¿Qué es la Dieta Keto?</a>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3">2</span>
                    <a href="#como-empezar" className="text-green-700 hover:underline">Cómo Empezar Keto Hoy</a>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3">3</span>
                    <a href="#alimentos-permitidos" className="text-green-700 hover:underline">Alimentos Permitidos vs Prohibidos</a>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3">4</span>
                    <a href="#plan-30-dias" className="text-green-700 hover:underline">Plan Keto 30 Días GRATIS</a>
                  </li>
                </ul>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3">5</span>
                    <a href="#macros-calcular" className="text-green-700 hover:underline">Cómo Calcular tus Macros</a>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3">6</span>
                    <a href="#efectos-secundarios" className="text-green-700 hover:underline">Efectos Secundarios</a>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3">7</span>
                    <a href="#recetas-esenciales" className="text-green-700 hover:underline">10 Recetas Esenciales</a>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3">8</span>
                    <a href="#errores-comunes" className="text-green-700 hover:underline">Errores Más Comunes</a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Sección 1: Qué es la Dieta Keto */}
            <section id="que-es-keto" className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                🥑 ¿Qué es la Dieta Keto? (Explicación Simple 2025)
              </h2>
              
              <div className="prose prose-lg max-w-none">
                <p className="text-xl text-gray-700 mb-6 font-medium">
                  La <strong>dieta keto o cetogénica</strong> es un plan alimentario que transforma tu cuerpo en una máquina quema-grasa 24/7. 
                  En lugar de usar azúcar como combustible, tu cuerpo aprende a quemar grasa directamente.
                </p>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 my-8">
                  <h3 className="font-bold text-yellow-800 mb-3">⚡ Definición Simple:</h3>
                  <p className="text-yellow-700 text-lg">
                    <strong>Menos de 20g carbohidratos al día</strong> + <strong>75% grasas saludables</strong> + <strong>25% proteína</strong> = 
                    Tu cuerpo entra en <strong>CETOSIS</strong> y quema grasa automáticamente.
                  </p>
                </div>

                <h3 className="text-2xl font-bold mt-10 mb-4">🧬 ¿Cómo Funciona la Cetosis?</h3>
                <p className="mb-6">
                  Cuando limitas los carbohidratos a menos de 20g diarios, tu cuerpo agota sus reservas de glucosa (azúcar) 
                  en 2-3 días. Entonces, el hígado comienza a producir <strong>cetonas</strong> a partir de la grasa, 
                  tanto de los alimentos como de tus reservas corporales.
                </p>

                <div className="grid md:grid-cols-2 gap-6 my-8">
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <h4 className="font-bold text-red-800 mb-3">❌ Dieta Tradicional</h4>
                    <ul className="text-red-700 space-y-2">
                      <li>• Quemas azúcar (glucosa)</li>
                      <li>• Hambre cada 3-4 horas</li>
                      <li>• Picos de energía e insulina</li>
                      <li>• Almacenas grasa fácilmente</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <h4 className="font-bold text-green-800 mb-3">✅ Dieta Keto</h4>
                    <ul className="text-green-700 space-y-2">
                      <li>• Quemas grasa (cetonas)</li>
                      <li>• Saciedad por 6-8 horas</li>
                      <li>• Energía estable todo el día</li>
                      <li>• Quemas grasa constantemente</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Sección 2: Cómo Empezar */}
            <section id="como-empezar" className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                🚀 Cómo Empezar Keto HOY (Plan Completo Paso a Paso)
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                  <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
                  <h3 className="font-bold text-blue-800 mb-2">LIMPIA tu Despensa</h3>
                  <p className="text-blue-700 text-sm">Elimina pan, pasta, arroz, azúcar, cereales, frutas altas en azúcar</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                  <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
                  <h3 className="font-bold text-green-800 mb-2">COMPRA Alimentos Keto</h3>
                  <p className="text-green-700 text-sm">Carne, pescado, huevos, aguacate, queso, aceite de oliva, verduras verdes</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 text-center">
                  <div className="bg-purple-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
                  <h3 className="font-bold text-purple-800 mb-2">PLANIFICA tu Primera Semana</h3>
                  <p className="text-purple-700 text-sm">Usa nuestro menú semanal gratuito y lista de compras</p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 mb-8">
                <h3 className="text-2xl font-bold text-yellow-800 mb-6">📋 Plan Detallado 7 Días para Empezar Keto</h3>
                
                <div className="space-y-6">
                  <div className="border-b border-yellow-200 pb-4">
                    <h4 className="text-lg font-semibold text-yellow-800 mb-2">🗓️ DÍA 1-2: PREPARACIÓN MENTAL</h4>
                    <ul className="text-yellow-700 space-y-1 ml-6">
                      <li>• Mídete: peso, cintura, grasa corporal</li>
                      <li>• Toma fotos "antes" (frente, perfil, espalda)</li>
                      <li>• Descarga app contador carbohidratos</li>
                      <li>• Planifica tu "por qué" (motivación)</li>
                      <li>• Avisa a familia/amigos tu decisión</li>
                    </ul>
                  </div>

                  <div className="border-b border-yellow-200 pb-4">
                    <h4 className="text-lg font-semibold text-yellow-800 mb-2">🛒 DÍA 3: COMPRA INTELIGENTE</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <strong className="text-yellow-800">Proteínas (30% presupuesto):</strong>
                        <ul className="text-yellow-700 text-sm mt-1 ml-4">
                          <li>• Huevos (12-18 unidades)</li>
                          <li>• Carne de res (1kg)</li>
                          <li>• Pollo con piel (1kg)</li>
                          <li>• Salmón/atún (500g)</li>
                        </ul>
                      </div>
                      <div>
                        <strong className="text-yellow-800">Grasas (40% presupuesto):</strong>
                        <ul className="text-yellow-700 text-sm mt-1 ml-4">
                          <li>• Aguacates (6-8 piezas)</li>
                          <li>• Aceite oliva extra virgen (1L)</li>
                          <li>• Mantequilla grass-fed (500g)</li>
                          <li>• Frutos secos mixtos (500g)</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="border-b border-yellow-200 pb-4">
                    <h4 className="text-lg font-semibold text-yellow-800 mb-2">🥗 DÍA 4-5: PRIMEROS MENÚS</h4>
                    <div className="bg-white rounded-lg p-4">
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <strong>DESAYUNO:</strong>
                          <ul className="mt-1 ml-2">
                            <li>• 3 huevos + aguacate</li>
                            <li>• Café con mantequilla</li>
                            <li>• 20g queso</li>
                          </ul>
                        </div>
                        <div>
                          <strong>ALMUERZO:</strong>
                          <ul className="mt-1 ml-2">
                            <li>• 150g carne + ensalada</li>
                            <li>• Aceite oliva abundante</li>
                            <li>• 1⁄2 aguacate</li>
                          </ul>
                        </div>
                        <div>
                          <strong>CENA:</strong>
                          <ul className="mt-1 ml-2">
                            <li>• 150g salmón</li>
                            <li>• Brócoli con mantequilla</li>
                            <li>• Ensalada verde</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-yellow-800 mb-2">⚡ DÍA 6-7: ENTRAR EN CETOSIS</h4>
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-green-800 mb-3"><strong>SEÑALES de que estás entrando en cetosis:</strong></p>
                      <ul className="text-green-700 space-y-1 ml-6">
                        <li>• Menos hambre (no antojas carbohidratos)</li>
                        <li>• Aliento metálico o afrutado</li>
                        <li>• Más energía mental después del día 5</li>
                        <li>• Pérdida de 1-3kg (principalmente agua)</li>
                        <li>• Menor hinchazón abdominal</li>
                        <li>• Necesitas menos comida para saciarte</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Sección 3: Lista de Alimentos COMPLETA */}
            <section id="alimentos-permitidos" className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                📋 Lista COMPLETA: Alimentos Permitidos vs Prohibidos en Keto
              </h2>

              <div className="grid lg:grid-cols-2 gap-8 mb-8">
                {/* Alimentos permitidos */}
                <div className="bg-green-50 border border-green-200 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                    ✅ ALIMENTOS PERMITIDOS (Come sin límite)
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-bold text-green-700 mb-3 text-lg">🥩 PROTEÍNAS ANIMALES</h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        <div>
                          <strong className="text-green-600">Carnes Rojas:</strong>
                          <ul className="text-sm text-gray-700 ml-4 mt-1">
                            <li>• Res (todas las partes)</li>
                            <li>• Cerdo (chuletas, costillas)</li>
                            <li>• Cordero</li>
                            <li>• Ternera</li>
                            <li>• Vísceras (hígado, riñón)</li>
                          </ul>
                        </div>
                        <div>
                          <strong className="text-green-600">Aves:</strong>
                          <ul className="text-sm text-gray-700 ml-4 mt-1">
                            <li>• Pollo (con piel)</li>
                            <li>• Pavo</li>
                            <li>• Pato</li>
                            <li>• Codorniz</li>
                            <li>• Huevos (todos los tipos)</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-green-700 mb-3 text-lg">🐟 PESCADOS Y MARISCOS</h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        <div>
                          <strong className="text-green-600">Pescados Grasos (⭐):</strong>
                          <ul className="text-sm text-gray-700 ml-4 mt-1">
                            <li>• Salmón</li>
                            <li>• Atún</li>
                            <li>• Sardinas</li>
                            <li>• Caballa</li>
                            <li>• Anchoas</li>
                          </ul>
                        </div>
                        <div>
                          <strong className="text-green-600">Mariscos:</strong>
                          <ul className="text-sm text-gray-700 ml-4 mt-1">
                            <li>• Camarones</li>
                            <li>• Cangrejo</li>
                            <li>• Langosta</li>
                            <li>• Mejillones</li>
                            <li>• Ostras (moderado)</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-green-700 mb-3 text-lg">🥑 GRASAS SALUDABLES</h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        <div>
                          <strong className="text-green-600">Aceites Prémium:</strong>
                          <ul className="text-sm text-gray-700 ml-4 mt-1">
                            <li>• Aceite oliva extra virgen</li>
                            <li>• Aceite coco virgen</li>
                            <li>• Aceite MCT</li>
                            <li>• Aceite aguacate</li>
                            <li>• Manteca de cerdo</li>
                          </ul>
                        </div>
                        <div>
                          <strong className="text-green-600">Frutos Secos:</strong>
                          <ul className="text-sm text-gray-700 ml-4 mt-1">
                            <li>• Nueces</li>
                            <li>• Almendras</li>
                            <li>• Macadamias</li>
                            <li>• Avellanas</li>
                            <li>• Pecanas</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-green-700 mb-3 text-lg">🥬 VEGETALES BAJOS EN CARBOS</h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        <div>
                          <strong className="text-green-600">Hojas Verdes (0-2g):</strong>
                          <ul className="text-sm text-gray-700 ml-4 mt-1">
                            <li>• Espinacas</li>
                            <li>• Lechuga</li>
                            <li>• Arúgula</li>
                            <li>• Kale</li>
                            <li>• Acelgas</li>
                          </ul>
                        </div>
                        <div>
                          <strong className="text-green-600">Crucíferas (3-6g):</strong>
                          <ul className="text-sm text-gray-700 ml-4 mt-1">
                            <li>• Brócoli</li>
                            <li>• Coliflor</li>
                            <li>• Coles de Bruselas</li>
                            <li>• Repollo</li>
                            <li>• Rábanos</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-green-700 mb-3 text-lg">🧀 LÁCTEOS ALTOS EN GRASA</h4>
                      <ul className="text-sm text-gray-700 ml-4 space-y-1">
                        <li>• Queso cheddar, gouda, manchego</li>
                        <li>• Queso crema, mozzarella</li>
                        <li>• Mantequilla grass-fed</li>
                        <li>• Crema de leche espesa</li>
                        <li>• Yogur griego natural (sin azúcar)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Alimentos prohibidos */}
                <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-red-800 mb-6 flex items-center">
                    ❌ ALIMENTOS PROHIBIDOS (Evita Siempre)
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-bold text-red-700 mb-3 text-lg">🍞 CEREALES Y GRANOS</h4>
                      <ul className="text-sm text-gray-700 ml-4 space-y-1">
                        <li>• Pan (blanco, integral, centeno)</li>
                        <li>• Pasta (todas las variedades)</li>
                        <li>• Arroz (blanco, integral, salvaje)</li>
                        <li>• Avena, quinoa, cebada</li>
                        <li>• Cereales de desayuno</li>
                        <li>• Galletas, crackers</li>
                        <li>• Pasteles, muffins, donuts</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-bold text-red-700 mb-3 text-lg">🍬 AZÚCARES Y ENDULZANTES</h4>
                      <ul className="text-sm text-gray-700 ml-4 space-y-1">
                        <li>• Azúcar blanca, morena, mascabado</li>
                        <li>• Miel, jarabe de arce</li>
                        <li>• Agave, jarabe de maíz</li>
                        <li>• Dulces, chocolates convencionales</li>
                        <li>• Refrescos, sodas</li>
                        <li>• Jugos de frutas</li>
                        <li>• Bebidas energéticas</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-bold text-red-700 mb-3 text-lg">🍌 FRUTAS ALTAS EN AZÚCAR</h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        <div>
                          <strong className="text-red-600">Muy Altas (15-30g):</strong>
                          <ul className="text-sm text-gray-700 ml-4 mt-1">
                            <li>• Plátano</li>
                            <li>• Mango</li>
                            <li>• Uvas</li>
                            <li>• Piña</li>
                            <li>• Higos</li>
                          </ul>
                        </div>
                        <div>
                          <strong className="text-red-600">Moderadas (10-15g):</strong>
                          <ul className="text-sm text-gray-700 ml-4 mt-1">
                            <li>• Manzana</li>
                            <li>• Pera</li>
                            <li>• Naranja</li>
                            <li>• Mandarina</li>
                            <li>• Kiwi</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-red-700 mb-3 text-lg">🥔 TUBÉRCULOS Y RAÍCES</h4>
                      <ul className="text-sm text-gray-700 ml-4 space-y-1">
                        <li>• Papas (todas las variedades)</li>
                        <li>• Batatas, camotes</li>
                        <li>• Yuca, mandioca</li>
                        <li>• Ñame, malanga</li>
                        <li>• Remolacha, zanahoria</li>
                        <li>• Nabo sueco</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-bold text-red-700 mb-3 text-lg">🫘 LEGUMBRES</h4>
                      <ul className="text-sm text-gray-700 ml-4 space-y-1">
                        <li>• Frijoles (negros, pintos, rojos)</li>
                        <li>• Lentejas (todas las variedades)</li>
                        <li>• Garbanzos, habas</li>
                        <li>• Soja, tofu, tempeh</li>
                        <li>• Guisantes, chícharos</li>
                        <li>• Cacahuetes (técnicamente legumbre)</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-bold text-red-700 mb-3 text-lg">🥛 LÁCTEOS ALTOS EN AZÚCAR</h4>
                      <ul className="text-sm text-gray-700 ml-4 space-y-1">
                        <li>• Leche (entera, descremada, 2%)</li>
                        <li>• Yogur con azúcar/frutas</li>
                        <li>• Helados convencionales</li>
                        <li>• Leche condensada</li>
                        <li>• Quesos procesados con aditivos</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabla de carbohidratos netos */}
              <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">📊 Tabla de Carbohidratos Netos (por 100g)</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="text-left p-3 font-semibold">Alimento</th>
                        <th className="text-center p-3 font-semibold">Carbos Netos</th>
                        <th className="text-center p-3 font-semibold">Porción Keto</th>
                        <th className="text-center p-3 font-semibold">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr><td className="p-3">Espinacas</td><td className="text-center p-3">1.4g</td><td className="text-center p-3">Sin límite</td><td className="text-center p-3">🟢 Excelente</td></tr>
                      <tr><td className="p-3">Aguacate</td><td className="text-center p-3">1.8g</td><td className="text-center p-3">1-2 piezas</td><td className="text-center p-3">🟢 Excelente</td></tr>
                      <tr><td className="p-3">Brócoli</td><td className="text-center p-3">4.0g</td><td className="text-center p-3">200g</td><td className="text-center p-3">🟢 Excelente</td></tr>
                      <tr><td className="p-3">Coliflor</td><td className="text-center p-3">3.0g</td><td className="text-center p-3">200g</td><td className="text-center p-3">🟢 Excelente</td></tr>
                      <tr><td className="p-3">Pepino</td><td className="text-center p-3">2.2g</td><td className="text-center p-3">Sin límite</td><td className="text-center p-3">🟢 Excelente</td></tr>
                      <tr><td className="p-3">Pimientos verdes</td><td className="text-center p-3">4.6g</td><td className="text-center p-3">150g</td><td className="text-center p-3">🟡 Moderado</td></tr>
                      <tr><td className="p-3">Cebolla</td><td className="text-center p-3">8.2g</td><td className="text-center p-3">50g</td><td className="text-center p-3">🟡 Moderado</td></tr>
                      <tr><td className="p-3">Tomate</td><td className="text-center p-3">2.7g</td><td className="text-center p-3">100g</td><td className="text-center p-3">🟡 Moderado</td></tr>
                      <tr><td className="p-3">Zanahoria</td><td className="text-center p-3">7.2g</td><td className="text-center p-3">30g</td><td className="text-center p-3">🔴 Evitar</td></tr>
                      <tr><td className="p-3">Plátano</td><td className="text-center p-3">20.1g</td><td className="text-center p-3">0g</td><td className="text-center p-3">🔴 Prohibido</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Sección 4: Macros y Cálculos */}
            <section id="macros-calcular" className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                🧮 Cómo Calcular tus Macros Keto Perfectos
              </h2>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-2xl p-8 mb-8">
                <h3 className="text-2xl font-bold text-blue-800 mb-6">📐 Fórmula Científica para tus Macros</h3>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-bold text-blue-700 mb-4">👩‍🔬 EJEMPLO: Mujer 35 años</h4>
                    <div className="bg-white rounded-lg p-6">
                      <ul className="space-y-2 text-sm">
                        <li><strong>Peso actual:</strong> 70kg</li>
                        <li><strong>Altura:</strong> 1.65m</li>
                        <li><strong>Meta:</strong> Perder 15kg</li>
                        <li><strong>Actividad:</strong> Sedentaria</li>
                      </ul>
                      
                      <div className="mt-4 pt-4 border-t">
                        <h5 className="font-bold text-blue-700 mb-2">CÁLCULO:</h5>
                        <ul className="space-y-1 text-sm">
                          <li>BMR = 1,340 kcal</li>
                          <li>TDEE = 1,608 kcal</li>
                          <li><strong>Déficit = 1,200 kcal/día</strong></li>
                        </ul>
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <h5 className="font-bold text-green-700 mb-2">MACROS FINALES:</h5>
                        <ul className="space-y-1 text-sm">
                          <li><strong>Grasas:</strong> 93g (70%)</li>
                          <li><strong>Proteínas:</strong> 90g (25%)</li>
                          <li><strong>Carbohidratos:</strong> 15g (5%)</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-blue-700 mb-4">👨‍🔬 EJEMPLO: Hombre 40 años</h4>
                    <div className="bg-white rounded-lg p-6">
                      <ul className="space-y-2 text-sm">
                        <li><strong>Peso actual:</strong> 85kg</li>
                        <li><strong>Altura:</strong> 1.78m</li>
                        <li><strong>Meta:</strong> Perder 20kg</li>
                        <li><strong>Actividad:</strong> Ejercicio 3x/semana</li>
                      </ul>
                      
                      <div className="mt-4 pt-4 border-t">
                        <h5 className="font-bold text-blue-700 mb-2">CÁLCULO:</h5>
                        <ul className="space-y-1 text-sm">
                          <li>BMR = 1,789 kcal</li>
                          <li>TDEE = 2,416 kcal</li>
                          <li><strong>Déficit = 1,800 kcal/día</strong></li>
                        </ul>
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <h5 className="font-bold text-green-700 mb-2">MACROS FINALES:</h5>
                        <ul className="space-y-1 text-sm">
                          <li><strong>Grasas:</strong> 140g (70%)</li>
                          <li><strong>Proteínas:</strong> 135g (25%)</li>
                          <li><strong>Carbohidratos:</strong> 22g (5%)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 bg-yellow-50 border border-yellow-300 rounded-lg p-6">
                  <h4 className="text-lg font-bold text-yellow-800 mb-3">⚡ Calculadora Rápida de Macros</h4>
                  <p className="text-yellow-700 mb-4">Usa esta fórmula simplificada para calcular tus macros básicos:</p>
                  
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white rounded p-3">
                      <strong>GRASAS (70%):</strong><br />
                      Peso objetivo × 1.2 - 1.8g
                    </div>
                    <div className="bg-white rounded p-3">
                      <strong>PROTEÍNAS (25%):</strong><br />
                      Peso objetivo × 1.0 - 1.4g
                    </div>
                    <div className="bg-white rounded p-3">
                      <strong>CARBOHIDRATOS (5%):</strong><br />
                      Máximo 20g netos/día
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Sección 5: Efectos Secundarios */}
            <section id="efectos-secundarios" className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                ⚠️ Efectos Secundarios Keto y Cómo Evitarlos
              </h2>

              <div className="grid lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-8">
                  <h3 className="text-xl font-bold text-orange-800 mb-4">🤒 LA GRIPE KETO (Días 2-7)</h3>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-orange-700 mb-3">Síntomas Temporales:</h4>
                    <ul className="text-sm text-orange-700 space-y-2 ml-4">
                      <li>• Fatiga y cansancio extremo</li>
                      <li>• Dolores de cabeza intensos</li>
                      <li>• Mareos al levantarse</li>
                      <li>• Irritabilidad y mal humor</li>
                      <li>• Dificultad para concentrarse</li>
                      <li>• Calambres musculares</li>
                      <li>• Estreñimiento</li>
                      <li>• Mal aliento metálico</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-green-700 mb-3">✅ SOLUCIONES EFECTIVAS:</h4>
                    <ul className="text-sm text-green-700 space-y-2">
                      <li><strong>1. Electrolitos:</strong> 2-3g sodio, 300mg magnesio, 1000mg potasio diarios</li>
                      <li><strong>2. Hidratación:</strong> 3.5-4 litros agua + sal marina</li>
                      <li><strong>3. Grasas extra:</strong> 1 cucharada aceite MCT o coco</li>
                      <li><strong>4. Descanso:</strong> 8+ horas sueño, reducir ejercicio</li>
                      <li><strong>5. Paciencia:</strong> Los síntomas desaparecen en 3-7 días</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
                  <h3 className="text-xl font-bold text-red-800 mb-4">🚨 EFECTOS MENOS COMUNES</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-red-700">Aliento Cetónico</h4>
                      <p className="text-sm text-red-600">Olor metálico/afrutado. Normal, indica cetosis. Mejora en 2-3 semanas.</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-red-700">Estreñimiento</h4>
                      <p className="text-sm text-red-600">Menos fibra inicial. Solución: verduras verdes, agua, magnesio.</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-red-700">Caída de Cabello</h4>
                      <p className="text-sm text-red-600">Raro, temporal (mes 2-4). Asegura proteína adecuada y vitaminas.</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-red-700">Problemas de Sueño</h4>
                      <p className="text-sm text-red-600">Energía extra inicial. Magnesio antes de dormir ayuda.</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-red-700">Irregularidad Menstrual</h4>
                      <p className="text-sm text-red-600">Cambios hormonales temporales. Normaliza en 2-3 meses.</p>
                    </div>
                  </div>

                  <div className="mt-6 bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">⚕️ CUÁNDO CONSULTAR MÉDICO:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Síntomas graves más de 10 días</li>
                      <li>• Problemas cardíacos o presión arterial</li>
                      <li>• Diabetes tipo 1 o medicación</li>
                      <li>• Embarazo o lactancia</li>
                      <li>• Historial trastornos alimentarios</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Sección 6: Recetas Esenciales */}
            <section id="recetas-esenciales" className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                👨‍🍳 10 Recetas Keto Esenciales para Principiantes
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-2xl mb-3">🥓</div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">1. Huevos Revueltos con Aguacate</h3>
                  <p className="text-sm text-gray-600 mb-3">Perfecto desayuno keto. 2g carbohidratos netos.</p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li>• 3 huevos + 1⁄2 aguacate + mantequilla</li>
                    <li>• Tiempo: 5 minutos</li>
                    <li>• Macros: 28g grasa, 18g proteína, 2g carbohidratos</li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-2xl mb-3">🥩</div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">2. Bistec con Mantequilla de Hierbas</h3>
                  <p className="text-sm text-gray-600 mb-3">Cena perfecta. 1g carbohidratos netos.</p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li>• 200g bistec + mantequilla + hierbas</li>
                    <li>• Tiempo: 15 minutos</li>
                    <li>• Macros: 35g grasa, 42g proteína, 1g carbohidratos</li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-2xl mb-3">🐟</div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">3. Salmón al Horno con Verduras</h3>
                  <p className="text-sm text-gray-600 mb-3">Rica en omega-3. 4g carbohidratos netos.</p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li>• 180g salmón + brócoli + aceite oliva</li>
                    <li>• Tiempo: 25 minutos</li>
                    <li>• Macros: 28g grasa, 35g proteína, 4g carbohidratos</li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-2xl mb-3">🥗</div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">4. Ensalada César Keto</h3>
                  <p className="text-sm text-gray-600 mb-3">Sin crutones, extra queso. 3g carbohidratos netos.</p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li>• Lechuga + parmesano + aderezo casero</li>
                    <li>• Tiempo: 10 minutos</li>
                    <li>• Macros: 24g grasa, 8g proteína, 3g carbohidratos</li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-2xl mb-3">🧀</div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">5. Pizza de Coliflor</h3>
                  <p className="text-sm text-gray-600 mb-3">Sustituye masa tradicional. 6g carbohidratos netos.</p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li>• Base coliflor + queso + pepperoni</li>
                    <li>• Tiempo: 45 minutos</li>
                    <li>• Macros: 22g grasa, 16g proteína, 6g carbohidratos</li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-2xl mb-3">🥤</div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">6. Batido Keto de Chocolate</h3>
                  <p className="text-sm text-gray-600 mb-3">Postre saludable. 4g carbohidratos netos.</p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li>• Aguacate + cacao + leche coco + stevia</li>
                    <li>• Tiempo: 5 minutos</li>
                    <li>• Macros: 26g grasa, 6g proteína, 4g carbohidratos</li>
                  </ul>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <h3 className="text-xl font-bold text-green-800 mb-3">
                  📚 ¿Quieres las 500+ Recetas Completas?
                </h3>
                <p className="text-green-700 mb-4">
                  Accede a nuestra base de datos completa con ingredientes, instrucciones detalladas y videos.
                </p>
                <Link 
                  href="/recetas" 
                  className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full transition-colors"
                >
                  Ver Todas las Recetas GRATIS
                </Link>
              </div>
            </section>

            {/* Sección 7: Errores Comunes */}
            <section id="errores-comunes" className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                🚫 Los 7 Errores Keto Más Comunes (Y Cómo Evitarlos)
              </h2>

              <div className="space-y-6">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-sm font-bold">1</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-red-800 mb-2">❌ "Carbohidratos ocultos" en alimentos procesados</h3>
                      <p className="text-red-700 mb-3">Muchas personas comen productos "sin azúcar" que contienen carbohidratos ocultos como maltodextrina, dextrosa o almidones modificados.</p>
                      <div className="bg-white rounded p-3">
                        <strong className="text-green-700">✅ SOLUCIÓN:</strong> Lee SIEMPRE las etiquetas nutricionales. Si tiene más de 3g carbohidratos por porción, evítalo. Enfócate en alimentos enteros sin procesar.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-sm font-bold">2</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-orange-800 mb-2">❌ No consumir suficientes electrolitos</h3>
                      <p className="text-orange-700 mb-3">El 90% de los síntomas de gripe keto se deben a falta de sodio, magnesio y potasio. Tu cuerpo elimina más agua en keto.</p>
                      <div className="bg-white rounded p-3">
                        <strong className="text-green-700">✅ SOLUCIÓN:</strong> Consume diariamente: 2-3g sal marina, 300mg magnesio, 1000mg potasio. Agrega sal a todas las comidas y bebe agua con electrolitos.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-sm font-bold">3</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-yellow-800 mb-2">❌ Temer las grasas y comer poca cantidad</h3>
                      <p className="text-yellow-700 mb-3">Muchos principiantes mantienen la mentalidad "low-fat" y no comen suficientes grasas, sintiéndose cansados y con hambre constante.</p>
                      <div className="bg-white rounded p-3">
                        <strong className="text-green-700">✅ SOLUCIÓN:</strong> Las grasas deben ser 70-75% de tus calorías. Agrega aceite oliva, mantequilla, aguacate y frutos secos generosamente. Tu energía aumentará.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-sm font-bold">4</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-blue-800 mb-2">❌ Exceso de proteínas (más del 25%)</h3>
                      <p className="text-blue-700 mb-3">El exceso de proteína se convierte en glucosa mediante gluconeogénesis, sacándote de cetosis. Es el error #1 en atletas.</p>
                      <div className="bg-white rounded p-3">
                        <strong className="text-green-700">✅ SOLUCIÓN:</strong> Calcula 1.2-1.6g proteína por kg de peso corporal. Si pesas 70kg, máximo 112g proteína diarios. Prioriza grasas sobre proteínas.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-sm font-bold">5</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-purple-800 mb-2">❌ No planificar y comer "lo que encuentre"</h3>
                      <p className="text-purple-700 mb-3">Sin preparación, es fácil caer en tentaciones o comer alimentos no keto por conveniencia, especialmente fuera de casa.</p>
                      <div className="bg-white rounded p-3">
                        <strong className="text-green-700">✅ SOLUCIÓN:</strong> Meal prep domingos. Prepara 3-4 comidas, lleva snacks keto (nueces, queso), planifica menús semanales usando nuestras recetas.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-pink-50 border border-pink-200 rounded-xl p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-sm font-bold">6</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-pink-800 mb-2">❌ Rendirse durante la primera semana</h3>
                      <p className="text-pink-700 mb-3">Los primeros 3-7 días son los más difíciles. Muchos abandonan justo cuando su cuerpo está adaptándose y entrando en cetosis.</p>
                      <div className="bg-white rounded p-3">
                        <strong className="text-green-700">✅ SOLUCIÓN:</strong> Comprométete mínimo 30 días. Únete a nuestra comunidad para apoyo diario. Los beneficios reales aparecen después del día 14.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-gray-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-sm font-bold">7</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 mb-2">❌ No medir progreso correctamente</h3>
                      <p className="text-gray-700 mb-3">Obsesionarse solo con la báscula ignora otros beneficios: pérdida de grasa, ganancia muscular, energía mental, mejor sueño.</p>
                      <div className="bg-white rounded p-3">
                        <strong className="text-green-700">✅ SOLUCIÓN:</strong> Mide: peso, cintura, fotos progreso, energía (1-10), calidad sueño, concentración mental. El progreso real va más allá del peso.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Sección 8: Testimonios */}
            <section id="testimonios" className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
                🌟 Testimonios Reales de Nuestra Comunidad
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">M</div>
                    <div className="ml-3">
                      <h4 className="font-semibold text-gray-800">María García</h4>
                      <p className="text-sm text-gray-600">35 años, Madrid</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">"Perdí 18kg en 4 meses siguiendo las recetas de Planeta Keto. Mi energía aumentó increíblemente y ya no tengo antojos de azúcar."</p>
                  <div className="text-sm text-green-600 font-semibold">
                    ✅ -18kg en 4 meses ✅ Más energía ✅ Sin antojos
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">C</div>
                    <div className="ml-3">
                      <h4 className="font-semibold text-gray-800">Carlos Mendoza</h4>
                      <p className="text-sm text-gray-600">42 años, México</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">"Reducir el azúcar en sangre de 180 a 95 mg/dl. Mi médico está sorprendido. La comunidad del foro me ayudó muchísimo."</p>
                  <div className="text-sm text-green-600 font-semibold">
                    ✅ Diabetes controlada ✅ -25kg ✅ Medicación reducida
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">L</div>
                    <div className="ml-3">
                      <h4 className="font-semibold text-gray-800">Laura Fernández</h4>
                      <p className="text-sm text-gray-600">28 años, Barcelona</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">"Después del embarazo no podía perder peso. En 6 meses con keto recuperé mi figura y me siento mejor que nunca."</p>
                  <div className="text-sm text-green-600 font-semibold">
                    ✅ Peso pre-embarazo ✅ Más confianza ✅ Mejor sueño
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-8 text-center">
                <h3 className="text-2xl font-bold text-orange-800 mb-4">
                  🏆 Más de 15,000 Transformaciones Exitosas
                </h3>
                <div className="grid md:grid-cols-4 gap-6 mb-6">
                  <div>
                    <div className="text-3xl font-bold text-orange-600">15,247</div>
                    <div className="text-sm text-orange-700">Personas Transformadas</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-600">89%</div>
                    <div className="text-sm text-green-700">Perdieron +5kg mes 1</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600">94%</div>
                    <div className="text-sm text-blue-700">Mejoraron su energía</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-600">97%</div>
                    <div className="text-sm text-purple-700">Recomiendan keto</div>
                  </div>
                </div>
                <p className="text-orange-700 mb-6">
                  Únete a miles de personas que ya cambiaron su vida con nuestro sistema probado
                </p>
                <Link 
                  href="/foro" 
                  className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full transition-colors"
                >
                  Ver Más Testimonios en el Foro
                </Link>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
                🙋‍♀️ Preguntas Más Frecuentes sobre Keto
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

            {/* CTA Final Optimizado */}
            <section className="text-center py-16">
              <div className="bg-gradient-to-br from-green-600 via-green-500 to-emerald-600 rounded-3xl p-12 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative">
                  <h2 className="text-4xl md:text-5xl font-black mb-6">
                    🚀 ¡Tu Transformación Keto Empieza AHORA!
                  </h2>
                  <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                    Únete a las <strong>15,247 personas</strong> que ya perdieron peso y transformaron su vida con Planeta Keto
                  </p>

                  <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto mb-8">
                    <h3 className="text-2xl font-bold mb-4 text-yellow-300">
                      🎁 OBTÉN GRATIS TU PACK COMPLETO KETO
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 text-left mb-6">
                      <div>
                        <ul className="space-y-2 text-white">
                          <li>✅ Plan menús 30 días paso a paso</li>
                          <li>✅ +500 recetas keto con videos</li>
                          <li>✅ Lista compras semanal</li>
                          <li>✅ Calculadora macros personalizada</li>
                        </ul>
                      </div>
                      <div>
                        <ul className="space-y-2 text-white">
                          <li>✅ Guía gripe keto (evítala 100%)</li>
                          <li>✅ Acceso comunidad VIP 15K+</li>
                          <li>✅ Soporte 24/7 en el foro</li>
                          <li>✅ Actualizaciones de por vida</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-full inline-block mb-4">
                      ⏰ OFERTA LIMITADA: Solo primeros 1,000 usuarios
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center gap-4 mb-6">
                    <Link 
                      href="/recetas" 
                      className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      🍽️ EMPEZAR MI PLAN GRATIS
                    </Link>
                    <Link 
                      href="/foro" 
                      className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 border border-white/30"
                    >
                      💬 Unirme a la Comunidad
                    </Link>
                  </div>

                  <div className="flex justify-center space-x-8 text-sm opacity-90">
                    <div>🔒 100% Gratis</div>
                    <div>📱 Sin Apps que descargar</div>
                    <div>⚡ Acceso inmediato</div>
                    <div>🌟 +15K usuarios satisfechos</div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </>
  );
}