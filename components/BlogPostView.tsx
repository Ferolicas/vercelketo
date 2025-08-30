'use client'

import { BlogPost } from '@/types/sanity';

interface BlogPostViewProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

export default function BlogPostView({ post, relatedPosts }: BlogPostViewProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
          {post.excerpt && (
            <p className="text-xl text-gray-600">{post.excerpt}</p>
          )}
        </header>


        <div className="prose prose-lg max-w-none">
          <p>Contenido del blog post aquí...</p>
        </div>

      </article>
    </div>
  );
}