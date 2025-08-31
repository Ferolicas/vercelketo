'use client'

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function CompleteOrderPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    const paymentIntentId = searchParams.get('payment_intent');
    const paymentIntentClientSecret = searchParams.get('payment_intent_client_secret');
    const redirectStatus = searchParams.get('redirect_status');

    if (redirectStatus === 'succeeded' && paymentIntentId) {
      setStatus('success');
      // Aquí podrías hacer una llamada a tu API para obtener más detalles del pago
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

  const renderContent = () => {
    switch (status) {
      case 'success':
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              ¡Pago Completado! 🎉
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Tu compra se ha procesado exitosamente
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-green-800 mb-2">¿Qué sigue?</h3>
              <ul className="text-sm text-green-700 space-y-2">
                <li>• Recibirás un email de confirmación en los próximos minutos</li>
                <li>• Tu producto digital estará disponible en tu área de cliente</li>
                <li>• Si compraste un servicio, nos pondremos en contacto contigo</li>
              </ul>
            </div>
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