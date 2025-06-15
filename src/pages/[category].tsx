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
    <div className="min-h-screen flex flex-col bg-[#ecf0f1]">
      {/* Header */}
      <header className="sticky top-0 w-full text-white shadow-2xl shadow-[#1e272e] relative z-10 bg-[#1e272e] rounded-4xl">
  <div className="max-w-5xl mx-auto px-2 py-2 flex items-center gap-4">
    {/* Logo */}
    <Link href="/" className="block" style={{ height: "clamp(32px, 22vw, 200px)" }}>
      <Image
        src="/logo.png"
        alt="Planeta Keto Logo"
        width={0}
        height={0}
        sizes="100vw"
        className="object-contain w-auto h-full max-h-full max-w-full"
        priority
      />
    </Link>
    {/* Letras y enlaces */}
    <div className="flex flex-col flex-1 justify-start items-center">
      <h1 className="text-[14vw] md:text-[3vw] uppercase text-white text-left leading-none" id="titucatego">
        {category.replace(/-/g, " ")}
      </h1>
      <div className="flex gap-4 mt-2">
        <Link
  href="https://youtube.com/@PLANETAKETO"
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center gap-2 font-bold text-white hover:text-yellow-300 transition text-[5vw] md:text-xl"
>
  <svg className="w-8 h-8 md:w-8 md:h-8" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="4" fill="#FF0000"/>
    <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#fff"/>
  </svg>
</Link>

{/* Correo (Gmail style, color) */}
<Link
  href="mailto:info@planetaketo.es"
  className="flex items-center gap-2 font-bold text-white hover:text-yellow-300 transition text-[5vw] md:text-xl"
>
  <svg className="w-8 h-8 md:w-8 md:h-8" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="4" fill="#EA4335"/>
    <path d="M4 7L12 13L20 7" stroke="#fff" strokeWidth="2"/>
    <rect x="4" y="7" width="16" height="10" rx="2" fill="#fff"/>
    <path d="M4 7L12 13L20 7" stroke="#EA4335" strokeWidth="2"/>
  </svg>
</Link>

{/* Amazon (color, sin negro) */}
<Link
  href="https://www.amazon.es/"
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center gap-2 font-bold text-white hover:text-yellow-300 transition text-[5vw] md:text-xl"
>
  <svg className="w-8 h-8 md:w-8 md:h-8" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="16" fill="#FF9900"/>
    <path d="M10 21c2.5 1.5 9.5 1.5 12 0" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
    <ellipse cx="16" cy="14" rx="5" ry="4" fill="#fff"/>
    <ellipse cx="16" cy="14" rx="3" ry="2" fill="#FF9900"/>
  </svg>
</Link>

{/* Hotmart (color, sin negro) */}
<Link
  href="https://www.hotmart.com/"
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center gap-2 font-bold text-white hover:text-yellow-300 transition text-[5vw] md:text-xl"
>
  <svg className="w-8 h-8 md:w-8 md:h-8" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="16" fill="#FF5722"/>
    <path d="M16 8c2.5 3.5 5 7 5 10a5 5 0 1 1-10 0c0-3 2.5-6.5 5-10z" fill="#fff"/>
  </svg>
</Link>
      </div>
    </div>
  </div>
</header>
      {/* Recetas */}
      <section className="w-full flex justify-center items-center py-12 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl w-full px-4 justify-items-center">
          {recetas.length === 0 && (
            <div className="col-span-full text-center text-gray-500 text-xl">No hay recetas en esta categoría.</div>
          )}
          {recetas.map((receta) => (
  <Link
    key={receta.slug}
    href={`/${receta.categoriaSlug}/${receta.slug}`}
    className="card bg-base-100 w-96 shadow-sm hover:shadow-lg transition-transform duration-200 hover:-translate-y-1 overflow-hidden text-inherit no-underline group"
  >
    <figure className="flex items-center justify-center w-full h-64 bg-gray-100 overflow-hidden relative ">
  {isSanityImage(receta.mainImage) ? (
    <Image
      src={urlFor(receta.mainImage).url()}
      alt={receta.title}
      fill
      className="object-contain w-[100%] h-[100%] m-auto"
      style={{ maxWidth: "100%", maxHeight: "100%" }}
      priority={false}
    />
  ) : (
    <img
      src="https://via.placeholder.com/400x250?text=Sin+Imagen"
      alt={receta.title}
      className="object-contain w-[100%] h-[100%] m-auto"
      style={{ maxWidth: "100%", maxHeight: "100%" }}
    />
  )}
</figure>
    <div className="card-body bg-[#1e272e]">
      <h2 className="card-title text-[1.5rem] text-white">
        {receta.title}
        {/* Badge de "NUEVO" si la receta es reciente (últimos 7 días) */}
        {new Date(receta.publishedAt) > new Date(Date.now() - 1000 * 60 * 60 * 24 * 7) && (
          <div className="badge badge-secondary">NUEVO</div>
        )}
      </h2>
      <p className="text-gray-500 text-sm">
        
      </p>
      <div className="card-actions justify-end">
        <div className="badge badge-outline capitalize text-white">{receta.preparationTime}</div>
        <div className="badge badge-outline capitalize text-white">{receta.level}</div>
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