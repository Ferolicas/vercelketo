'use client'

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircleIcon, XCircleIcon, UserIcon, EnvelopeIcon, PhoneIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

function CompleteOrderContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'payment_success' | 'form_complete' | 'error'>('loading');
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [customerData, setCustomerData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    pais: 'España',
    suscribirNewsletter: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [calendlyUrl, setCalendlyUrl] = useState<string | null>(null);

  useEffect(() => {
    const paymentIntentId = searchParams.get('payment_intent');
    const paymentIntentClientSecret = searchParams.get('payment_intent_client_secret');
    const redirectStatus = searchParams.get('redirect_status');

    if (redirectStatus === 'succeeded' && paymentIntentId) {
      setStatus('payment_success');
      setPaymentDetails({
        paymentIntentId,
        redirectStatus
      });
    } else if (redirectStatus === 'processing') {
      setStatus('loading');
    } else {
      setStatus('error');
    }
  }, [searchParams]);

  const handleSubmitCustomerData = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentDetails?.paymentIntentId) return;
    
    setSubmitting(true);
    
    try {
      const response = await fetch('/api/save-customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntentId: paymentDetails.paymentIntentId,
          ...customerData
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus('form_complete');
        if (result.calendlyUrl) {
          setCalendlyUrl(result.calendlyUrl);
        }
      } else {
        throw new Error(result.error || 'Error al procesar los datos');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar los datos. Por favor, intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'payment_success':
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              ¡Pago Completado! 🎉
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Para completar tu compra, necesitamos algunos datos adicionales
            </p>
            
            <form onSubmit={handleSubmitCustomerData} className="max-w-md mx-auto space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre completo *
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="nombre"
                      value={customerData.nombre}
                      onChange={(e) => setCustomerData({...customerData, nombre: e.target.value})}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Correo electrónico *
                  </label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      value={customerData.email}
                      onChange={(e) => setCustomerData({...customerData, email: e.target.value})}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      id="telefono"
                      value={customerData.telefono}
                      onChange={(e) => setCustomerData({...customerData, telefono: e.target.value})}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="pais" className="block text-sm font-medium text-gray-700 mb-2">
                    País *
                  </label>
                  <div className="relative">
                    <GlobeAltIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      id="pais"
                      value={customerData.pais}
                      onChange={(e) => setCustomerData({...customerData, pais: e.target.value})}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    >
                      <option value="España">España</option>
                      <option value="México">México</option>
                      <option value="Argentina">Argentina</option>
                      <option value="Colombia">Colombia</option>
                      <option value="Chile">Chile</option>
                      <option value="Perú">Perú</option>
                      <option value="Venezuela">Venezuela</option>
                      <option value="Ecuador">Ecuador</option>
                      <option value="Uruguay">Uruguay</option>
                      <option value="Paraguay">Paraguay</option>
                      <option value="Bolivia">Bolivia</option>
                      <option value="Costa Rica">Costa Rica</option>
                      <option value="Guatemala">Guatemala</option>
                      <option value="Honduras">Honduras</option>
                      <option value="Nicaragua">Nicaragua</option>
                      <option value="Panamá">Panamá</option>
                      <option value="República Dominicana">República Dominicana</option>
                      <option value="El Salvador">El Salvador</option>
                      <option value="Estados Unidos">Estados Unidos</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="newsletter"
                    checked={customerData.suscribirNewsletter}
                    onChange={(e) => setCustomerData({...customerData, suscribirNewsletter: e.target.checked})}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="newsletter" className="ml-2 block text-sm text-gray-700">
                    Suscribirme al newsletter para recibir recetas keto exclusivas
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {submitting ? 'Procesando...' : 'Completar Registro'}
              </button>
            </form>
          </div>
        );

      case 'form_complete':
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              ¡Todo Listo! 🎉
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Tu compra se ha procesado exitosamente
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-green-800 mb-2">¿Qué sigue?</h3>
              <ul className="text-sm text-green-700 space-y-2 text-left">
                <li>• Recibirás un email de confirmación en los próximos minutos</li>
                <li>• Tu producto digital estará disponible en el email</li>
                {calendlyUrl && <li>• Podrás agendar tu sesión usando el enlace que recibirás</li>}
              </ul>
            </div>
            {calendlyUrl && (
              <div className="mb-6">
                <a
                  href={calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-block"
                >
                  Agendar Sesión con Calendly
                </a>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/productos-y-servicios"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Explorar más productos
              </Link>
              <Link
                href="/"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Ir al inicio
              </Link>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircleIcon className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Error en el pago
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Hubo un problema procesando tu pago
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-red-800 mb-2">¿Qué hacer?</h3>
              <ul className="text-sm text-red-700 space-y-2">
                <li>• Verifica que tu tarjeta tenga fondos suficientes</li>
                <li>• Intenta con otro método de pago</li>
                <li>• Contacta a tu banco si persiste el problema</li>
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/productos-y-servicios"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Intentar de nuevo
              </Link>
              <Link
                href="/"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Ir al inicio
              </Link>
            </div>
          </div>
        );
      
      case 'loading':
      default:
        return (
          <div className="text-center">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-green-500 border-t-transparent mx-auto mb-6"></div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Procesando tu pago...
            </h1>
            <p className="text-xl text-gray-600">
              Por favor espera mientras confirmamos tu transacción
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

// Loading component for the Suspense fallback
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-green-500 border-t-transparent mx-auto mb-6"></div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Cargando...
          </h1>
        </div>
      </div>
    </div>
  );
}

export default function CompleteOrderPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CompleteOrderContent />
    </Suspense>
  );
}