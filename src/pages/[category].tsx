import { GetStaticPaths, GetStaticProps } from "next";
import { client, urlFor } from "../lib/sanityClient";
import Image from "next/image";
import Link from "next/link";


type SanityImage = { asset: { _ref: string; _type: string } };

interface Receta {
  title: string;
  slug: string;
  mainImage: SanityImage | null;
  publishedAt: string;
  categoriaSlug: string;
  level?: string;
  preparationTime: string;
}

function isSanityImage(img: unknown): img is SanityImage {
  return typeof img === "object" && img !== null && "asset" in img;
}

interface PageProps {
  recetas: Receta[];
  category: string;
}

export default function CategoryPage({ recetas, category }: PageProps) {
  return (
    <div className="min-h-screen bg-[#8fb454] flex flex-col">
      {/* Header */}
      <header className="w-full text-white shadow-md relative z-10">
        <div className="max-w-5xl mx-auto px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-rubik text-3xl md:text-4xl font-bold tracking-wide drop-shadow-lg">PLANETA KETO</span>
          <nav className="flex gap-6">
            <Link
              href="https://youtube.com/@PLANETAKETO"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-bold text-white hover:text-yellow-300 transition"
            >
              <svg width="24" height="24" fill="#FF0000" viewBox="0 0 24 24"><path d="M23.498 6.186a2.994 2.994 0 0 0-2.107-2.117C19.19 3.5 12 3.5 12 3.5s-7.19 0-9.391.569A2.994 2.994 0 0 0 .502 6.186C0 8.39 0 12 0 12s0 3.61.502 5.814a2.994 2.994 0 0 0 2.107 2.117C4.81 20.5 12 20.5 12 20.5s7.19 0 9.391-.569a2.994 2.994 0 0 0 2.107-2.117C24 15.61 24 12 24 12s0-3.61-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              <span>YOUTUBE</span>
            </Link>
            <Link
              href="mailto:info@planetaketo.es"
              className="flex items-center gap-2 font-bold text-white hover:text-yellow-300 transition"
            >
              <svg width="24" height="24" fill="#fff" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.01L12 13 4 6.01V6h16zm0 12H4V8.99l8 6.99 8-6.99V18z"/></svg>
              <span>CONTACTO</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Título de la categoría */}
      <div className="max-w-5xl mx-auto px-8 mt-8">
        <h1 className="text-5xl font-bold uppercase text-white mb-6">
          {category.replace(/-/g, " ")}
        </h1>
      </div>

      {/* Recetas */}
      <section className="w-full flex justify-center items-center py-12 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl w-full px-4">
          {recetas.length === 0 && (
            <div className="col-span-full text-center text-gray-500 text-xl">No hay recetas en esta categoría.</div>
          )}
          {recetas.map((receta) => (
  <Link
    key={receta.slug}
    href={`/${receta.categoriaSlug}/${receta.slug}`}
    className="card bg-base-100 w-96 shadow-sm hover:shadow-lg transition-transform duration-200 hover:-translate-y-1 overflow-hidden text-inherit no-underline group"
  >
    <figure>
      {isSanityImage(receta.mainImage) ? (
        <Image
          src={urlFor(receta.mainImage).width(400).height(250).url()}
          alt={receta.title}
          width={400}
          height={250}
          className="object-cover w-full h-64 transition-transform duration-300 group-hover:scale-105"
          priority={false}
        />
      ) : (
        <img
          src="https://via.placeholder.com/400x250?text=Sin+Imagen"
          alt={receta.title}
          className="object-cover w-full h-64"
        />
      )}
    </figure>
    <div className="card-body">
      <h2 className="card-title text-[1.5rem]">
        {receta.title}
        {/* Badge de "NUEVO" si la receta es reciente (últimos 7 días) */}
        {new Date(receta.publishedAt) > new Date(Date.now() - 1000 * 60 * 60 * 24 * 7) && (
          <div className="badge badge-secondary">NUEVO</div>
        )}
      </h2>
      <p className="text-gray-500 text-sm">
        
      </p>
      <div className="card-actions justify-end">
        <div className="badge badge-outline capitalize">{receta.preparationTime}</div>
        <div className="badge badge-outline capitalize">{receta.level}</div>
      </div>
    </div>
  </Link>
))}    
        </div>
      </section>
    </div>
  );
}

// Genera las rutas dinámicas
export const getStaticPaths: GetStaticPaths = async () => {
  const categories = await client.fetch<{ slug: { current: string } }[]>(
    `*[_type == "category"]{ "slug": slug }`
  );

  return {
    paths: categories.map((cat) => ({
      params: { category: cat.slug.current },
    })),
    fallback: false,
  };
};

// Obtiene los datos para cada página
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const category = params?.category as string;

  const recetas: Receta[] = await client.fetch(
    `*[_type == "post" && category->slug.current == $categoriaSlug] | order(publishedAt desc){
      title,
      "slug": slug.current,
      mainImage,
      publishedAt,
      "categoriaSlug": category->slug.current,
      level,
      preparationTime
    }`,
    { categoriaSlug: category }
  );

  return {
    props: {
      recetas,
      category,
    },
    revalidate: 60,
  };
};