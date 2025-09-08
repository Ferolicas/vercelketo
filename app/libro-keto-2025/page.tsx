import { generateSEOMetadata } from '@/components/SEOHead';
import BookLandingPage from '@/components/book/BookLandingPage';

export async function generateMetadata() {
  return generateSEOMetadata({
    title: 'Guía Completa Keto 2025 - El Libro #1 de Dieta Cetogénica | Planeta Keto',
    description: '📖 Descarga el libro keto más completo de España. +200 recetas probadas, plan de 30 días, calculadora de macros. Transforma tu cuerpo en 30 días. Garantía incluida. Solo €14.75',
    keywords: 'libro keto, guía cetogénica, dieta keto pdf, recetas keto libro, plan keto 30 días, libro dieta cetogénica, guía keto española, descargar libro keto, keto para principiantes, dieta cetogénica libro',
    url: '/libro-keto-2025',
    type: 'product',
    image: '/book-cover-3d.jpg'
  });
}

export default function LibroKeto2025Page() {
  return <BookLandingPage />;
}