import Link from 'next/link';
import Image from 'next/image';
import type { PostMeta } from '@/lib/blog';

interface PostCardProps {
  meta: PostMeta;
}

export default function PostCard({ meta }: PostCardProps) {
  const formattedDate = new Date(meta.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {meta.coverImage && (
        <div className="relative h-48 w-full">
          <Image
            src={meta.coverImage}
            alt={meta.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="p-6">
        <time className="text-sm text-gray-500">{formattedDate}</time>
        <h2 className="mt-2 text-xl font-semibold text-gray-900 hover:text-teal-600">
          <Link href={`/blog/${meta.slug}`}>{meta.title}</Link>
        </h2>
        <p className="mt-3 text-gray-600 line-clamp-3">{meta.excerpt}</p>
        {meta.author && (
          <p className="mt-4 text-sm text-gray-500">By {meta.author}</p>
        )}
        <Link
          href={`/blog/${meta.slug}`}
          className="mt-4 inline-block text-teal-600 hover:text-teal-700 font-medium"
        >
          Read more →
        </Link>
      </div>
    </article>
  );
}