'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { StarIcon } from '@heroicons/react/24/solid'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface Testimonio {
  id: string
  nombre: string
  ubicacion: string
  avatar: string
  rating: number
  testimonio: string
  resultado: string
  fechaResultado: string
  verificado: boolean
  pesoAntes?: number
  pesoDespues?: number
}

const testimoniosData: Testimonio[] = [
  {
    id: '1',
    nombre: 'María González',
    ubicacion: 'Madrid, España',
    avatar: '/testimonios/maria.jpg',
    rating: 5,
    testimonio: 'Este libro cambió completamente mi relación con la comida. Las recetas son deliciosas y fáciles de seguir. En 3 meses he perdido 15kg sin pasar hambre.',
    resultado: 'Perdió 15kg en 3 meses',
    fechaResultado: '3 meses',
    verificado: true,
    pesoAntes: 78,
    pesoDespues: 63
  },
  {
    id: '2',
    nombre: 'Carlos Ruiz',
    ubicacion: 'Barcelona, España',
    avatar: '/testimonios/carlos.jpg',
    rating: 5,
    testimonio: 'Como médico, estaba escéptico sobre keto. Pero este libro presenta la ciencia de forma clara. Lo recomiendo a mis pacientes y yo mismo perdí 12kg.',
    resultado: 'Médico que perdió 12kg',
    fechaResultado: '4 meses',
    verificado: true,
    pesoAntes: 95,
    pesoDespues: 83
  },
  {
    id: '3',
    nombre: 'Ana López',
    ubicacion: 'Valencia, España',
    avatar: '/testimonios/ana.jpg',
    rating: 5,
    testimonio: 'Había probado todas las dietas. Keto funcionó porque este libro me enseñó a hacerlo bien. Sin ansiedad, sin rebote. Ya llevo 8 meses manteniendo mi peso ideal.',
    resultado: 'Mantiene su peso ideal por 8 meses',
    fechaResultado: '8 meses',
    verificado: true,
    pesoAntes: 82,
    pesoDespues: 67
  },
  {
    id: '4',
    nombre: 'Roberto Martín',
    ubicacion: 'Sevilla, España',
    avatar: '/testimonios/roberto.jpg',
    rating: 5,
    testimonio: 'Mi diabetes tipo 2 mejoró significativamente. Los niveles de glucosa se normalizaron en 6 semanas. Mi endocrino está sorprendido con los resultados.',
    resultado: 'Mejoró diabetes tipo 2',
    fechaResultado: '6 semanas',
    verificado: true
  },
  {
    id: '5',
    nombre: 'Lucía Fernández',
    ubicacion: 'Bilbao, España',
    avatar: '/testimonios/lucia.jpg',
    rating: 5,
    testimonio: 'Soy madre de dos niños y no tenía tiempo para cocinar complicado. Las recetas rápidas de este libro me salvaron. He perdido 10kg cocinando para toda la familia.',
    resultado: 'Perdió 10kg cocinando para la familia',
    fechaResultado: '5 meses',
    verificado: true,
    pesoAntes: 71,
    pesoDespues: 61
  },
  {
    id: '6',
    nombre: 'Miguel Torres',
    ubicacion: 'Zaragoza, España',
    avatar: '/testimonios/miguel.jpg',
    rating: 5,
    testimonio: 'Deportista de alto rendimiento. Este libro me ayudó a mantener cetosis mientras entreno intenso. Mi performance mejoró un 20% y mi composición corporal es perfecta.',
    resultado: 'Mejoró performance deportiva 20%',
    fechaResultado: '3 meses',
    verificado: true
  },
  {
    id: '7',
    nombre: 'Carmen Jiménez',
    ubicacion: 'Málaga, España',
    avatar: '/testimonios/carmen.jpg',
    rating: 5,
    testimonio: 'A los 55 años pensé que era tarde para cambiar. Este libro me demostró lo contrario. He perdido 18kg y me siento como a los 30. Mi energía es increíble.',
    resultado: 'Perdió 18kg a los 55 años',
    fechaResultado: '6 meses',
    verificado: true,
    pesoAntes: 89,
    pesoDespues: 71
  },
  {
    id: '8',
    nombre: 'Alejandro Vega',
    ubicacion: 'Murcia, España',
    avatar: '/testimonios/alejandro.jpg',
    rating: 5,
    testimonio: 'Trabajo en oficina 10 horas. Este libro tiene recetas para meal prep que me ahorraron tiempo y dinero. En 4 meses bajé 14kg sin dejar de comer rico.',
    resultado: 'Perdió 14kg con meal prep',
    fechaResultado: '4 meses',
    verificado: true,
    pesoAntes: 88,
    pesoDespues: 74
  }
]

export default function TestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-scroll testimonials
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentTestimonial(prev => 
        prev === testimoniosData.length - 1 ? 0 : prev + 1
      )
    }, 5000) // Cambiar cada 5 segundos

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextTestimonial = () => {
    setIsAutoPlaying(false)
    setCurrentTestimonial(prev => 
      prev === testimoniosData.length - 1 ? 0 : prev + 1
    )
    setTimeout(() => setIsAutoPlaying(true), 10000) // Reanudar después de 10s
  }

  const prevTestimonial = () => {
    setIsAutoPlaying(false)
    setCurrentTestimonial(prev => 
      prev === 0 ? testimoniosData.length - 1 : prev - 1
    )
    setTimeout(() => setIsAutoPlaying(true), 10000) // Reanudar después de 10s
  }

  const goToTestimonial = (index: number) => {
    setIsAutoPlaying(false)
    setCurrentTestimonial(index)
    setTimeout(() => setIsAutoPlaying(true), 10000) // Reanudar después de 10s
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`h-5 w-5 ${
          i < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <section className="py-16 bg-gradient-to-br from-green-50 to-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-green-300 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-yellow-300 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-300 rounded-full blur-xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl text-white text-2xl mb-6">
            ⭐
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Más de <span className="text-green-600">10.000</span> personas
            <br />
            ya transformaron su vida
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Estos son solo algunos de los resultados reales que nuestros lectores 
            han conseguido siguiendo la guía paso a paso.
          </p>
        </div>

        {/* Featured Testimonial Carousel */}
        <div className="mb-12">
          <div className="relative bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-4xl mx-auto">
            {/* Progress bar */}
            <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full rounded-t-3xl overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-5000 ease-linear"
                style={{ 
                  width: isAutoPlaying ? '100%' : '0%',
                  transitionDuration: isAutoPlaying ? '5000ms' : '0ms'
                }}
              ></div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Avatar and info */}
              <div className="flex-shrink-0 text-center md:text-left">
                <div className="relative mb-4">
                  <Image
                    src={testimoniosData[currentTestimonial].avatar}
                    alt={testimoniosData[currentTestimonial].nombre}
                    width={120}
                    height={120}
                    className="rounded-full object-cover mx-auto border-4 border-green-100 shadow-lg"
                  />
                  {testimoniosData[currentTestimonial].verificado && (
                    <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full p-2">
                      ✓
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {testimoniosData[currentTestimonial].nombre}
                </h3>
                <p className="text-gray-500 text-sm mb-3">
                  {testimoniosData[currentTestimonial].ubicacion}
                </p>
                <div className="flex justify-center md:justify-start mb-3">
                  {renderStars(testimoniosData[currentTestimonial].rating)}
                </div>
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {testimoniosData[currentTestimonial].resultado}
                </div>
              </div>

              {/* Testimonial content */}
              <div className="flex-1">
                <blockquote className="text-lg md:text-xl text-gray-700 italic leading-relaxed mb-6">
                  "{testimoniosData[currentTestimonial].testimonio}"
                </blockquote>
                
                {/* Results showcase */}
                {testimoniosData[currentTestimonial].pesoAntes && testimoniosData[currentTestimonial].pesoDespues && (
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-center gap-8">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          {testimoniosData[currentTestimonial].pesoAntes}kg
                        </div>
                        <div className="text-sm text-gray-500">Antes</div>
                      </div>
                      <div className="text-3xl">→</div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {testimoniosData[currentTestimonial].pesoDespues}kg
                        </div>
                        <div className="text-sm text-gray-500">Después</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          -{testimoniosData[currentTestimonial].pesoAntes! - testimoniosData[currentTestimonial].pesoDespues!}kg
                        </div>
                        <div className="text-sm text-gray-500">Perdidos</div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="text-sm text-gray-500">
                  Tiempo para ver resultados: <span className="font-semibold text-green-600">
                    {testimoniosData[currentTestimonial].fechaResultado}
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="absolute top-1/2 -translate-y-1/2 left-4 md:left-2">
              <button
                onClick={prevTestimonial}
                className="w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-600 hover:text-green-600 hover:shadow-xl transition-all duration-200"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 right-4 md:right-2">
              <button
                onClick={nextTestimonial}
                className="w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-600 hover:text-green-600 hover:shadow-xl transition-all duration-200"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Dots navigation */}
          <div className="flex justify-center mt-6 gap-2">
            {testimoniosData.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentTestimonial 
                    ? 'bg-green-500 w-8' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimoniosData.slice(0, 6).map((testimonio) => (
            <div
              key={testimonio.id}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 group"
            >
              {/* Header */}
              <div className="flex items-center mb-4">
                <Image
                  src={testimonio.avatar}
                  alt={testimonio.nombre}
                  width={48}
                  height={48}
                  className="rounded-full object-cover border-2 border-green-100"
                />
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900">{testimonio.nombre}</h4>
                    {testimonio.verificado && (
                      <div className="bg-green-500 text-white rounded-full p-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{testimonio.ubicacion}</p>
                  <div className="flex mt-1">
                    {renderStars(testimonio.rating)}
                  </div>
                </div>
              </div>

              {/* Content */}
              <blockquote className="text-gray-700 text-sm italic mb-4 leading-relaxed">
                "{testimonio.testimonio.substring(0, 120)}..."
              </blockquote>

              {/* Result badge */}
              <div className="bg-green-50 text-green-700 px-3 py-2 rounded-lg text-xs font-medium text-center">
                ✅ {testimonio.resultado}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-3xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              ¿Listo para ser el próximo caso de éxito?
            </h3>
            <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
              Únete a más de 10.000 personas que ya transformaron su vida con nuestra guía completa. 
              Los resultados están garantizados.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-green-600 font-bold py-4 px-8 rounded-xl hover:bg-gray-50 transition-colors text-lg shadow-lg hover:shadow-xl">
                🚀 Descargar Mi Libro Ahora
              </button>
              <div className="flex items-center justify-center text-green-100 text-sm">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Garantía de 30 días
                </span>
                <span className="mx-2">•</span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Pago 100% seguro
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}