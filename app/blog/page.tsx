import { Metadata } from 'next';
import Link from 'next/link';
import { getAllPostMetas } from '@/lib/blog';
import PostCard from '@/app/components/blog/PostCard';

export const dynamic = 'force-static';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Blog | Pottery Classes Near Me',
    description: 'Articles about pottery classes, studios, and tips for beginners and experienced potters alike.',
    alternates: {
      canonical: 'https://localpotteryclasses.com/blog',
    },
    openGraph: {
      title: 'Blog | Pottery Classes Near Me',
      description: 'Articles about pottery classes, studios, and tips for beginners and experienced potters alike.',
      type: 'website',
      siteName: 'Local Pottery Classes',
      images: [
        {
          url: 'https://localpotteryclasses.com/localpotteryclasses_socialimage.png',
          width: 1200,
          height: 630,
          alt: 'Pottery Classes Blog',
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Blog | Pottery Classes Near Me',
      description: 'Articles about pottery classes, studios, and tips for beginners and experienced potters alike.',
      images: ['https://localpotteryclasses.com/localpotteryclasses_socialimage.png'],
    },
  };
}

export default async function BlogPage() {
  const posts = await getAllPostMetas();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F3ED' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                Home
              </Link>
            </li>
            <li>
              <span className="text-gray-400 mx-2">/</span>
            </li>
            <li>
              <span className="text-gray-900 font-medium">Blog</span>
            </li>
          </ol>
        </nav>

        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Pottery Classes Blog
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Discover tips, techniques, and insights about pottery classes. From choosing your first class 
            to mastering advanced techniques, our articles help you navigate your pottery journey.
          </p>
        </header>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No blog posts available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} meta={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}