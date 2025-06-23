// components/BackButton.tsx
'use client'; // ¡Esto es crucial!

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react'; // Asumo que `ArrowLeft` viene de aquí

interface BackButtonProps {
  /**
   * El texto a mostrar en el botón. Por defecto: "Volver"
   * Ejemplo: "Volver a categorías", "Volver al inicio", "Volver a la receta"
   */
  text?: string;
  /**
   * Clases adicionales de Tailwind CSS para personalizar el estilo del botón.
   */
  className?: string;
}

export function BackButton({ text = 'Volver', className = '' }: BackButtonProps) {
  const router = useRouter();

  const handleGoBack = () => {
    router.back(); // Simula el botón de "atrás" del navegador
  };

  return (
    <button
      onClick={handleGoBack}
      className={`inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-medium transition-colors ${className}`}
      aria-label={text} // Para accesibilidad
    >
      <ArrowLeft size={20} />
      <span>{text}</span>
    </button>
  );
}