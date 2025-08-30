'use client'

import { ForumPost } from '@/types/sanity';

interface ForoPostViewProps {
  post: ForumPost;
  relatedPosts: ForumPost[];
}

export default function ForoPostView({ post, relatedPosts }: ForoPostViewProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
        </header>


        <div className="prose prose-lg max-w-none">
          <p>{post.content}</p>
        </div>

      </article>
    </div>
  );
}