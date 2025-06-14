// app/page.tsx
import MainLayout from './components/MainLayout';
import { client, urlFor } from '../lib/sanityClient';
import Link from 'next/link';

type SanityImage = { asset: { _ref: string; _type: string } };

interface Category {
  title: string;
  slug: string;
  categoryImage?: unknown;
}

interface HomeData {
  siteTitle: string;
  heroTitle: string;
  heroDescription: string;
  heroImage?: unknown;
  youtubeUrl?: string;
  youtubeDisplayText?: string;
  email?: string;
  phone?: string;
  picksTitle?: string;
  picksSubtitle?: string;
}

async function getHomeData() {
  const homePageQuery = `*[_type == "homePage"][0]`;
  return client.fetch(homePageQuery);
}

async function getCategories() {
  const categoriesQuery = `*[_type == "category"]{ title, "slug": slug.current, categoryImage }`;
  return client.fetch(categoriesQuery);
}

function isSanityImage(img: unknown): img is SanityImage {
  return typeof img === 'object' && img !== null && 'asset' in img;
}

export default async function Home() {
  const homeData: HomeData = await getHomeData();
  const categories: Category[] = await getCategories();

  return (
    <MainLayout title={homeData?.heroTitle || "Bienvenido"}>
      {/* Desktop/Tablet */}
      <div className="hidden md:block bg-white">
        {/* Hero Section */}
        <section className="relative bg-[#8fb454] bg-[url('/plantomovil.png')] bg-cover bg-center bg-no-repeat py-6 w-full text-white overflow-hidden">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 z-0" />
          <div className="relative z-10 container mx-auto px-6">
            {/* Top Bar */}
            <div className="flex justify-between items-center mb-8">
              <span className="font-rubik text-4xl md:text-6xl font-bold uppercase text-white drop-shadow-lg tracking-tight">
                {homeData?.siteTitle}
              </span>
              <nav className="flex gap-8">
                {homeData?.youtubeUrl && (
                  <a
                    href={homeData.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-white font-bold text-lg hover:text-yellow-300 transition"
                  >
                    {/* YouTube Icon */}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M2 8a4 4 0 0 1 4 -4h12a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-12a4 4 0 0 1 -4 -4v-8z"></path><path d="M10 9l5 3l-5 3z"></path></svg>
                    <span>{homeData?.youtubeDisplayText || homeData?.youtubeUrl}</span>
                  </a>
                )}
                {homeData?.email && (
                  <a
                    href={`mailto:${homeData.email}`}
                    className="inline-flex items-center gap-2 text-white font-bold text-lg hover:text-yellow-300 transition"
                  >
                    {/* Mail Icon */}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z"></path><path d="M3 7l9 6l9 -6"></path></svg>
                    <span>{homeData.email}</span>
                  </a>
                )}
                {homeData?.phone && (
                  <a
                    href={`tel:${homeData.phone}`}
                    className="inline-flex items-center gap-2 text-white font-bold text-lg hover:text-yellow-300 transition"
                  >
                    {/* Phone Icon */}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2"></path></svg>
                    <span>{homeData.phone}</span>
                  </a>
                )}
              </nav>
            </div>
            {/* Main Content */}
            <div className="relative text-center py-8">
              <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-lg">{homeData?.heroTitle}</h1>
              <p className="max-w-2xl mx-auto mt-4 text-2xl font-bold text-white drop-shadow-lg">{homeData?.heroDescription}</p>
              {isSanityImage(homeData?.heroImage) && (
                <img
                  src={urlFor(homeData.heroImage).width(400).url()}
                  alt="Plato de receta principal"
                  className="mx-auto mt-8 w-full max-w-xs md:max-w-md drop-shadow-xl"
                />
              )}
              {/* Imágenes decorativas */}
              <img src="/perejil.webp" alt="Decoración perejil" className="hidden md:block absolute top-[43%] left-[12%] w-[380px] z-20" />
              <img src="/champinon.png" alt="Decoración champiñón" className="hidden md:block absolute top-[20%] left-[2%] w-[330px] z-20" />
              <img src="/lechuga.png" alt="Decoración lechuga" className="hidden md:block absolute top-[15%] right-[1%] w-[340px] rotate-12 z-20" />
              <img src="/perejil.webp" alt="Decoración pan" className="hidden md:block absolute bottom-0 right-[12%] w-[380px] z-20" />
            </div>
          </div>
        </section>
        {/* Picks Section */}
        <section className="text-center py-20 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-extrabold text-[#333]">{homeData?.picksTitle}</h2>
            <p className="text-[#555] mt-2">{homeData?.picksSubtitle}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-12 text-left">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/${category.slug}`}
                  className="bg-[#f8f9fa] rounded-xl no-underline text-inherit transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg flex flex-col"
                >
                  <div className="rounded-t-xl overflow-hidden">
                    {isSanityImage(category.categoryImage) && (
                      <img
                        src={urlFor(category.categoryImage).width(300).height(200).url()}
                        alt={`Imagen de ${category.title}`}
                        className="w-full h-[200px] object-cover"
                      />
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <h3 className="text-lg font-bold">{category.title}</h3>
                    <span className="inline-block text-[#8fb454] font-medium mt-4">Ver recetas &rarr;</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
      {/* Mobile Hero */}
      <div className="block md:hidden">
        <div className="relative min-h-screen w-screen bg-[#8fb454] overflow-hidden">
          <img src="/plantomovil.png" alt="Fondo de Planeta Keto" className="absolute top-0 left-0 w-full h-full object-cover z-0" />
          <div className="relative z-10 flex flex-col justify-between items-center h-screen w-screen">
            <header className="w-full flex flex-col items-center mt-2">
              <h1 className="w-full text-center font-rubik text-5xl sm:text-6xl text-white drop-shadow-lg tracking-wider font-bold uppercase">PLANETA KETO</h1>
              <div className="flex flex-row items-center justify-center gap-4 text-white font-bold text-lg mt-4">
                <a href="https://youtube.com/@PLANETAKETO" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#FF0000"><path d="M23.498 6.186a2.994 2.994 0 0 0-2.107-2.117C19.19 3.5 12 3.5 12 3.5s-7.19 0-9.391.569A2.994 2.994 0 0 0 .502 6.186C0 8.39 0 12 0 12s0 3.61.502 5.814a2.994 2.994 0 0 0 2.107 2.117C4.81 20.5 12 20.5 12 20.5s7.19 0 9.391-.569a2.994 2.994 0 0 0 2.107-2.117C24 15.61 24 12 24 12s0-3.61-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  <span>YOUTUBE</span>
                </a>
                <a href="mailto:info@planetaketo.es" className="inline-flex items-center gap-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.01L12 13 4 6.01V6h16zm0 12H4V8.99l8 6.99 8-6.99V18z"/></svg>
                  <span>CONTACTO</span>
                </a>
              </div>
            </header>
            <footer className="w-full flex justify-center mb-14">
              <Link href="/recetas" className="bg-white text-[#8fb454] font-bold py-4 px-10 rounded-full text-xl shadow-lg transition-transform animate-pulse hover:scale-105">Ver recetas</Link>
            </footer>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}