'use client'

import { useState } from 'react'
import Image from 'next/image'
import { 
  BookOpenIcon, 
  DocumentTextIcon, 
  CalculatorIcon, 
  ClockIcon,
  CheckCircleIcon,
  StarIcon,
  PlayIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

interface Capitulo {
  numero: number
  titulo: string
  descripcion: string
  paginas: number
  icono: string
  contenido: string[]
  preview?: string
  destacado?: boolean
}

const capitulosData: Capitulo[] = [
  {
    numero: 1,
    titulo: "Fundamentos de la Dieta Cetogénica",
    descripcion: "Todo lo que necesitas saber sobre cetosis y cómo funciona tu cuerpo",
    paginas: 28,
    icono: "🧠",
    contenido: [
      "Qué es la cetosis y cómo alcanzarla",
      "Beneficios científicamente probados",
      "Mitos y verdades sobre keto",
      "Cómo medir tu progreso correctamente"
    ],
    preview: "La dieta cetogénica no es solo otra moda pasajera. Es un cambio metabólico profundo que transforma la forma en que tu cuerpo obtiene energía...",
    destacado: true
  },
  {
    numero: 2,
    titulo: "Alimentos Keto: Guía Completa",
    descripcion: "Lista definitiva de alimentos permitidos, prohibidos y en moderación",
    paginas: 35,
    icono: "🥑",
    contenido: [
      "Lista visual de alimentos keto",
      "Tabla de macronutrientes",
      "Cómo leer etiquetas correctamente",
      "Alternativas keto para tus comidas favoritas"
    ],
    preview: "No todos los alimentos 'saludables' son keto-friendly. Esta guía te evitará errores costosos que pueden sacarte de cetosis...",
    destacado: false
  },
  {
    numero: 3,
    titulo: "Calculadora de Macros Personalizada",
    descripcion: "Aprende a calcular tus macros perfectos según tu objetivo",
    paginas: 22,
    icono: "📊",
    contenido: [
      "Fórmulas para calcular macros",
      "Ajustes según actividad física",
      "Cómo modificar según resultados",
      "Herramientas de seguimiento recomendadas"
    ],
    preview: "Las macros genéricas no funcionan para todos. Te enseño a personalizar tu plan según tu metabolismo único...",
    destacado: true
  },
  {
    numero: 4,
    titulo: "200+ Recetas Keto Probadas",
    descripcion: "Desayunos, comidas, cenas y postres que te encantarán",
    paginas: 95,
    icono: "👨‍🍳",
    contenido: [
      "50 desayunos keto variados",
      "60 platos principales",
      "40 snacks y aperitivos",
      "50 postres sin azúcar"
    ],
    preview: "Cada receta ha sido probada por nuestra comunidad de más de 10,000 personas. Garantía de sabor y resultados...",
    destacado: true
  },
  {
    numero: 5,
    titulo: "Plan de Menús de 30 Días",
    descripcion: "Planificación completa para tu primer mes keto",
    paginas: 40,
    icono: "📅",
    contenido: [
      "Menús diarios balanceados",
      "Lista de compras semanal",
      "Prep de comidas optimizado",
      "Variaciones según preferencias"
    ],
    preview: "El mes más importante de tu transformación planificado al detalle. Solo tienes que seguir el plan...",
    destacado: false
  },
  {
    numero: 6,
    titulo: "Superando Obstáculos Comunes",
    descripción: "Soluciones para mesetas, antojos y efectos secundarios",
    paginas: 32,
    icono: "🏆",
    contenido: [
      "Cómo romper mesetas de peso",
      "Manejo de antojos intensos",
      "Keto flu y cómo evitarla",
      "Estrategias de motivación"
    ],
    preview: "Los primeros 30 días son cruciales. Estas estrategias te ayudarán a superar cualquier obstáculo...",
    destacado: true
  }
]

const bonusContent = [
  {
    titulo: "Guía de Ejercicios Keto",
    descripcion: "Rutinas optimizadas para quemar grasa en cetosis",
    icono: "💪",
    valor: "€19"
  },
  {
    titulo: "Tracker Digital de Progreso",
    descripcion: "Plantillas digitales para seguir tu evolución",
    icono: "📱",
    valor: "€15"
  },
  {
    titulo: "Lista de Compras Inteligente",
    descripcion: "Lista optimizada para ahorrar tiempo y dinero",
    icono: "🛒",
    valor: "€9"
  },
  {
    titulo: "Recetas Express (menos de 15 min)",
    descripcion: "50 recetas rápidas para días ocupados",
    icono: "⚡",
    valor: "€12"
  }
]

export default function ContentPreviewSection() {
  const [activeChapter, setActiveChapter] = useState(0)
  const [previewMode, setPreviewMode] = useState<'table' | 'pages'>('table')

  const totalPaginas = capitulosData.reduce((total, cap) => total + cap.paginas, 0)
  const bonusValue = bonusContent.reduce((total, bonus) => total + parseInt(bonus.valor.replace('€', '')), 0)

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-40 h-40 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-green-400 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-purple-400 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl text-white text-3xl mb-8">
            👁️
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Echa un vistazo a lo que
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              encontrarás dentro
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Más de <span className="font-bold text-blue-600">{totalPaginas} páginas</span> de contenido premium, 
            <span className="font-bold text-green-600"> 200+ recetas probadas</span> y herramientas que cambiarán tu vida para siempre.
          </p>
          
          {/* Preview mode selector */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-xl p-1 shadow-lg border border-gray-200">
              <button
                onClick={() => setPreviewMode('table')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  previewMode === 'table'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <BookOpenIcon className="h-5 w-5 inline mr-2" />
                Tabla de Contenidos
              </button>
              <button
                onClick={() => setPreviewMode('pages')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  previewMode === 'pages'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <EyeIcon className="h-5 w-5 inline mr-2" />
                Vista Previa
              </button>
            </div>
          </div>
        </div>

        {/* Content Preview */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Left Side - Table of Contents */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
              <h3 className="text-2xl font-bold mb-2">Contenido del Libro</h3>
              <p className="text-blue-100">6 capítulos · {totalPaginas} páginas · Acceso inmediato</p>
            </div>
            
            <div className="p-8">
              <div className="space-y-4">
                {capitulosData.map((capitulo, index) => (
                  <div
                    key={capitulo.numero}
                    onClick={() => setActiveChapter(index)}
                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 group ${
                      activeChapter === index
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                          activeChapter === index 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-100 group-hover:bg-blue-100'
                        }`}>
                          {capitulo.icono}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-bold px-2 py-1 rounded-full ${
                              activeChapter === index 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-200 text-gray-700'
                            }`}>
                              Cap {capitulo.numero}
                            </span>
                            {capitulo.destacado && (
                              <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full flex items-center">
                                <StarIcon className="h-3 w-3 mr-1" />
                                Destacado
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-gray-500 font-medium">
                            {capitulo.paginas} pág
                          </span>
                        </div>
                        
                        <h4 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600">
                          {capitulo.titulo}
                        </h4>
                        <p className="text-sm text-gray-600 mb-3">
                          {capitulo.descripcion}
                        </p>
                        
                        {/* Content bullets */}
                        <ul className="space-y-1">
                          {capitulo.contenido.slice(0, 2).map((item, i) => (
                            <li key={i} className="flex items-center text-sm text-gray-600">
                              <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                          {capitulo.contenido.length > 2 && (
                            <li className="text-sm text-blue-600 font-medium">
                              +{capitulo.contenido.length - 2} puntos más...
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Chapter Preview */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-8">
              <h3 className="text-2xl font-bold mb-2">Vista Previa</h3>
              <p className="text-green-100">
                {capitulosData[activeChapter].titulo}
              </p>
            </div>
            
            <div className="p-8">
              {/* Chapter preview content */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-4xl">{capitulosData[activeChapter].icono}</div>
                  <div>
                    <div className="text-sm text-blue-600 font-semibold">
                      Capítulo {capitulosData[activeChapter].numero}
                    </div>
                    <h4 className="text-xl font-bold text-gray-900">
                      {capitulosData[activeChapter].titulo}
                    </h4>
                  </div>
                </div>
                
                <p className="text-gray-700 leading-relaxed mb-6 italic text-lg">
                  "{capitulosData[activeChapter].preview}"
                </p>
              </div>

              {/* Complete content list */}
              <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                <h5 className="font-bold text-gray-900 mb-4 flex items-center">
                  <DocumentTextIcon className="h-5 w-5 mr-2 text-blue-600" />
                  Lo que aprenderás en este capítulo:
                </h5>
                <ul className="space-y-3">
                  {capitulosData[activeChapter].contenido.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Page count and reading time */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center">
                  <DocumentTextIcon className="h-4 w-4 mr-1" />
                  {capitulosData[activeChapter].paginas} páginas
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  ~{Math.ceil(capitulosData[activeChapter].paginas / 3)} min de lectura
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bonus Content Section */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="relative">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🎁</div>
                <h3 className="text-3xl md:text-4xl font-bold mb-4">
                  Bonus Incluidos GRATIS
                </h3>
                <p className="text-yellow-100 text-xl">
                  Valor total de €{bonusValue} incluido sin costo adicional
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {bonusContent.map((bonus, index) => (
                  <div key={index} className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 border border-white border-opacity-30">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="text-3xl">{bonus.icono}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-white">{bonus.titulo}</h4>
                          <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-sm font-bold">
                            {bonus.valor}
                          </span>
                        </div>
                        <p className="text-yellow-100 text-sm">{bonus.descripcion}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-8">
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto">
                  <div className="text-2xl font-bold mb-2">Valor Total</div>
                  <div className="flex items-center justify-center gap-4">
                    <span className="text-3xl font-bold line-through opacity-75">€89</span>
                    <span className="text-5xl font-bold">€29</span>
                  </div>
                  <div className="text-yellow-100 text-sm mt-2">
                    Ahorro de €60 (67% descuento)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sample Pages Preview */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Muestra de Páginas Reales
            </h3>
            <p className="text-xl text-gray-600">
              Así se ve el contenido por dentro. Diseño limpio y fácil de seguir.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Sample page previews */}
            <div className="text-center group">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 mb-4 aspect-[3/4] flex items-center justify-center group-hover:shadow-lg transition-shadow">
                <div className="text-gray-500">
                  <BookOpenIcon className="h-16 w-16 mx-auto mb-4" />
                  <p className="text-sm">Página de Receta</p>
                </div>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Recetas Detalladas</h4>
              <p className="text-sm text-gray-600">Con macros, tiempo de prep y fotos step-by-step</p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-8 mb-4 aspect-[3/4] flex items-center justify-center group-hover:shadow-lg transition-shadow">
                <div className="text-blue-600">
                  <CalculatorIcon className="h-16 w-16 mx-auto mb-4" />
                  <p className="text-sm">Calculadoras</p>
                </div>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Herramientas Prácticas</h4>
              <p className="text-sm text-gray-600">Calculadoras y tablas para personalizar tu plan</p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-2xl p-8 mb-4 aspect-[3/4] flex items-center justify-center group-hover:shadow-lg transition-shadow">
                <div className="text-green-600">
                  <DocumentTextIcon className="h-16 w-16 mx-auto mb-4" />
                  <p className="text-sm">Guías Paso a Paso</p>
                </div>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Explicaciones Claras</h4>
              <p className="text-sm text-gray-600">Todo explicado de forma simple y visual</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}