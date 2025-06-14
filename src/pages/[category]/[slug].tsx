import { GetStaticPaths, GetStaticProps } from "next";
import { client, urlFor } from "../../lib/sanityClient";
import Image from "next/image";

type SanityImage = {
  asset: { _ref: string; _type: string };
  [key: string]: unknown;
};

type AuthorRef = {
  _ref: string;
  _type: string;
};

type CategoryRef = {
  _ref: string;
  _type: string;
};

type IngredientSection = {
  // Define aquí los campos de tu sección de ingredientes si tienes el schema
  [key: string]: unknown;
};

export interface Post {
  title: string;
  slug: { current: string };
  author?: AuthorRef;
  mainImage?: SanityImage;
  category: CategoryRef;
  publishedAt: string;
  body: unknown;
  youtubeUrl?: string;
  level?: 'Principiante' | 'Intermedio' | 'Avanzado';
  preparationTime?: string;
  ingredients?: IngredientSection[];
}

interface PageProps {
  post: Post | null;
}

export default function PostPage({ post }: PageProps) {
  if (!post) {
    return <div className="text-center py-20">No se encontró la receta.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      {post.mainImage && (
        <Image
          src={urlFor(post.mainImage).width(800).height(400).url()}
          alt={post.title}
          width={800}
          height={400}
          className="rounded-lg mb-6"
        />
      )}
      <p className="text-gray-500 mb-2">Publicado: {new Date(post.publishedAt).toLocaleDateString()}</p>
      {post.level && <p className="mb-2">Nivel: {post.level}</p>}
      {post.preparationTime && <p className="mb-2">Tiempo de preparación: {post.preparationTime}</p>}
      {post.youtubeUrl && (
        <div className="mb-4">
          <a href={post.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            Ver video en YouTube
          </a>
        </div>
      )}
      {/* Aquí puedes renderizar ingredientes, body, etc. */}
      {/* <pre>{JSON.stringify(post, null, 2)}</pre> */}
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await client.fetch<{ slug: { current: string }, category: { slug: { current: string } } }[]>(
    `*[_type == "post"]{ "slug": slug, category->{ "slug": slug } }`
  );

  return {
    paths: posts.map((post) => ({
      params: {
        category: post.category?.slug.current,
        slug: post.slug.current,
      },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const category = params?.category as string;
  const slug = params?.slug as string;

  const post = await client.fetch<Post>(
    `*[_type == "post" && slug.current == $slug && category->slug.current == $category][0]{ 
      title,
      slug,
      author,
      mainImage,
      category,
      publishedAt,
      body,
      youtubeUrl,
      level,
      preparationTime,
      ingredients
    }`,
    { slug, category }
  );

  return {
    props: {
      post: post ?? null,
    },
    revalidate: 60,
  };
};