import { notFound } from 'next/navigation';
import { client } from '@/lib/sanity';
import { Metadata } from 'next';
import ForumPostDetail from '@/components/ForumPostDetail';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const post = await client.fetch(
      `*[_type == "forumPost" && slug.current == $slug][0]{
        title,
        content,
        authorName,
        createdAt
      }`,
      { slug }
    );

    if (!post) {
      return {
        title: 'Publicación no encontrada | Foro Planeta Keto',
      };
    }

    return {
      title: `${post.title} | Foro Planeta Keto`,
      description: `${post.content.slice(0, 160)}... - Publicado por ${post.authorName}`,
      openGraph: {
        title: post.title,
        description: `${post.content.slice(0, 160)}...`,
        type: 'article',
      },
    };
  } catch (error) {
    return {
      title: 'Error | Foro Planeta Keto',
    };
  }
}

export default async function ForumPostPage({ params }: PageProps) {
  const { slug } = await params;

  try {
    const post = await client.fetch(
      `*[_type == "forumPost" && slug.current == $slug && isDeleted != true][0]{
        _id,
        title,
        content,
        authorName,
        authorEmail,
        authorId,
        category,
        tags,
        isPinned,
        views,
        likes,
        replyCount,
        createdAt,
        updatedAt,
        isEdited
      }`,
      { slug }
    );

    if (!post) {
      notFound();
    }

    // Incrementar vistas
    try {
      await client
        .patch(post._id)
        .inc({ views: 1 })
        .commit();
    } catch (error) {
      console.warn('Could not increment views:', error);
    }

    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <ForumPostDetail post={post} />
      </div>
    );
  } catch (error) {
    console.error('Error loading forum post:', error);
    notFound();
  }
}