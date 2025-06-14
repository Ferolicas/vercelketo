import { client, urlFor } from '../../lib/sanityClient';
import MainLayout from '../components/MainLayout';
import Link from 'next/link';
import Image from 'next/image'; // Add this import

type SanityImage = { asset: { _ref: string; _type: string } };

interface Receta {
  title: string;
  slug: string;
  mainImage: SanityImage | null;
  publishedAt: string;
  categoriaSlug: string;
}

function isSanityImage(img: unknown): img is SanityImage {
  return typeof img === 'object' && img !== null && 'asset' in img;
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const { category } = params;

  const recetas: Receta[] = await client.fetch(
    `*[_type == "post" && category->slug.current == $categoriaSlug] | order(publishedAt desc){
      title,
      "slug": slug.current,
      mainImage,
      publishedAt,
      "categoriaSlug": category->slug.current
    }`,
    { categoriaSlug: category }
  );

  return (
    <MainLayout title={`${category.charAt(0).toUpperCase() + category.slice(1)} - Planeta Keto`}>
      <header className="w-full bg-[#8fb454] text-white shadow-md relative z-10">
        <div className="max-w-5xl mx-auto px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-rubik text-3xl md:text-4xl font-bold tracking-wide drop-shadow-lg">PLANETA KETO</span>
          <nav className="flex gap-6">
            <a
              href="https://youtube.com/@PLANETAKETO"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-bold text-white hover:text-yellow-300 transition"
            >
              <svg width="24" height="24" fill="#FF0000" viewBox="0 0 24 24"><path d="M23.498 6.186a2.994 2.994 0 0 0-2.107-2.117C19.19 3.5 12 3.5 12 3.5s-7.19 0-9.391.569A2.994 2.994 0 0 0 .502 6.186C0 8.39 0 12 0 12s0 3.61.502 5.814a2.994 2.994 0 0 0 2.107 2.117C4.81 20.5 12 20.5 12 20.5s7.19 0 9.391-.569a2.994 2.994 0 0 0 2.107-2.117C24 15.61 24 12 24 12s0-3.61-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              <span>YOUTUBE</span>
            </a>
            <a
              href="mailto:info@planetaketo.es"
              className="flex items-center gap-2 font-bold text-white hover:text-yellow-300 transition"
            >
              <svg width="24" height="24" fill="#fff" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.01L12 13 4 6.01V6h16zm0 12H4V8.99l8 6.99 8-6.99V18z"/></svg>
              <span>CONTACTO</span>
            </a>
          </nav>
        </div>
      </header>

      <section className="w-full flex justify-center items-center py-12 md:py-20 bg-[#f8f9fa]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl w-full px-4">
          {recetas.length === 0 && (
            <div className="col-span-full text-center text-gray-500 text-xl">No hay recetas en esta categoría.</div>
          )}
          {recetas.map((receta) => (
            <Link
              key={receta.slug}
              href={`/${receta.categoriaSlug}/${receta.slug}`}
              className="flex flex-col rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-transform duration-200 hover:-translate-y-1 overflow-hidden text-inherit no-underline min-h-[320px] group"
            >
              <div className="w-full h-[220px] bg-gray-100 flex items-center justify-center overflow-hidden">
                {isSanityImage(receta.mainImage) && (
                  <Image
                    src={urlFor(receta.mainImage).width(600).url()}
                    alt={receta.title}
                    width={600}
                    height={220}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="flex-1 flex items-end justify-center p-4">
                <span className="text-lg font-bold text-gray-800 text-center w-full tracking-wide">{receta.title}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </MainLayout>
  );
}