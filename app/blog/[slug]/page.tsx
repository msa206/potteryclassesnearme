import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getPostBySlug, getPostSlugs } from '@/lib/blog';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const { meta } = post;

  return {
    title: `${meta.title} | Pottery Classes Near Me`,
    description: meta.excerpt,
    authors: meta.author ? [{ name: meta.author }] : [{ name: 'Pottery Classes Directory' }],
    alternates: {
      canonical: `https://localpotteryclasses.com/blog/${slug}`,
    },
    openGraph: {
      title: meta.title,
      description: meta.excerpt,
      type: 'article',
      publishedTime: meta.date,
      modifiedTime: meta.updated || meta.date,
      authors: meta.author ? [meta.author] : undefined,
      siteName: 'Local Pottery Classes',
      images: [
        {
          url: meta.ogImage || meta.coverImage || 'https://localpotteryclasses.com/localpotteryclasses_socialimage.png',
          width: 1200,
          height: 630,
          alt: meta.title,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.excerpt,
      images: [meta.ogImage || meta.coverImage || 'https://localpotteryclasses.com/localpotteryclasses_socialimage.png'],
    },
  };
}

// Popular cities data matching the home page
const popularCities = [
  { city: 'San Francisco', state: 'California', stateSlug: 'california', citySlug: 'san-francisco', studios: 20 },
  { city: 'New York', state: 'New York', stateSlug: 'new-york', citySlug: 'new-york', studios: 19 },
  { city: 'Brooklyn', state: 'New York', stateSlug: 'new-york', citySlug: 'brooklyn', studios: 16 },
  { city: 'Seattle', state: 'Washington', stateSlug: 'washington', citySlug: 'seattle', studios: 16 },
  { city: 'Chicago', state: 'Illinois', stateSlug: 'illinois', citySlug: 'chicago', studios: 14 },
  { city: 'San Diego', state: 'California', stateSlug: 'california', citySlug: 'san-diego', studios: 13 },
  { city: 'Austin', state: 'Texas', stateSlug: 'texas', citySlug: 'austin', studios: 13 },
  { city: 'Los Angeles', state: 'California', stateSlug: 'california', citySlug: 'los-angeles', studios: 12 },
  { city: 'Portland', state: 'Oregon', stateSlug: 'oregon', citySlug: 'portland', studios: 11 },
  { city: 'Denver', state: 'Colorado', stateSlug: 'colorado', citySlug: 'denver', studios: 10 },
  { city: 'Miami', state: 'Florida', stateSlug: 'florida', citySlug: 'miami', studios: 8 },
  { city: 'Las Vegas', state: 'Nevada', stateSlug: 'nevada', citySlug: 'las-vegas', studios: 7 },
  { city: 'Fort Worth', state: 'Texas', stateSlug: 'texas', citySlug: 'fort-worth', studios: 7 },
  { city: 'Nashville', state: 'Tennessee', stateSlug: 'tennessee', citySlug: 'nashville', studios: 7 },
  { city: 'Philadelphia', state: 'Pennsylvania', stateSlug: 'pennsylvania', citySlug: 'philadelphia', studios: 7 },
  { city: 'Sacramento', state: 'California', stateSlug: 'california', citySlug: 'sacramento', studios: 5 },
];

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { meta, content } = post;

  // Parse the date string and format it explicitly to avoid timezone issues
  const dateObj = new Date(meta.date + 'T00:00:00');
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });

  const formattedUpdated = meta.updated
    ? new Date(meta.updated + 'T00:00:00').toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
      })
    : null;

  // Breadcrumb structured data
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://localpotteryclasses.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://localpotteryclasses.com/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": meta.title,
        "item": `https://localpotteryclasses.com/blog/${slug}`
      }
    ]
  };

  // BlogPosting structured data
  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": meta.title,
    "description": meta.excerpt,
    "datePublished": meta.date,
    "dateModified": meta.updated || meta.date,
    "author": {
      "@type": "Person",
      "name": meta.author || "Pottery Classes Directory"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Local Pottery Classes",
      "logo": {
        "@type": "ImageObject",
        "url": "https://localpotteryclasses.com/android-chrome-512x512.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://localpotteryclasses.com/blog/${slug}`
    },
    "image": meta.ogImage || meta.coverImage || "https://localpotteryclasses.com/localpotteryclasses_socialimage.png"
  };

  // FAQ structured data (only for raku-pottery article for now)
  const faqJsonLd = slug === 'raku-pottery' ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What does raku pottery mean?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The word \"raku\" comes from Japanese and means \"enjoyment,\" \"pleasure,\" or \"contentment.\" The term comes from a seal given to potter Chōjirō in 1584 by the emperor. So Raku pottery literally means \"pottery of enjoyment,\" reflecting the joy that comes from creating and appreciating this unique art form."
        }
      },
      {
        "@type": "Question",
        "name": "Why is raku pottery so expensive?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Raku pottery can be expensive due to the high level of breakage during the firing process. The rapid cooling technique can often lead to thermal shock, meaning that the pots can easily crack and are ruined. Each piece also requires individual attention during the firing process, and since every piece is completely one-of-a-kind, they become artistic collectibles."
        }
      },
      {
        "@type": "Question",
        "name": "How can you tell if pottery is raku?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can identify Raku pottery by its distinctive crackle lines from rapid cooling, metallic effects from special glazes, and smoky black areas where the pottery touched burning materials. This process creates unique patterns that regular pottery simply cannot achieve."
        }
      },
      {
        "@type": "Question",
        "name": "What is the difference between raku and regular pottery?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Raku firing is much quicker than normal firing, taking around 1-2 hours compared to regular firing which can take up to 24 hours. In raku, pottery must be removed from the kiln when red hot and cooled rapidly in combustible materials like sawdust. While regular pottery prioritizes functionality and consistency, Raku embraces unpredictability and is primarily decorative since it's not food-safe."
        }
      }
    ]
  } : null;

  return (
    <article className="min-h-screen" style={{ backgroundColor: '#F5F3ED' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs with schema markup */}
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
              <Link href="/blog" className="text-gray-500 hover:text-gray-700">
                Blog
              </Link>
            </li>
            <li>
              <span className="text-gray-400 mx-2">/</span>
            </li>
            <li>
              <span className="text-gray-900 font-medium truncate max-w-xs">
                {meta.title}
              </span>
            </li>
          </ol>
        </nav>

        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{meta.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-gray-600">
            <time dateTime={meta.date}>{formattedDate}</time>
            {formattedUpdated && (
              <>
                <span>•</span>
                <span>Updated {formattedUpdated}</span>
              </>
            )}
            {meta.author && (
              <>
                <span>•</span>
                <span>By {meta.author}</span>
              </>
            )}
          </div>
        </header>

        {meta.coverImage && (
          <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
            <Image
              src={meta.coverImage}
              alt={meta.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>
        )}

        <div className="prose prose-lg prose-slate max-w-none">
          {content}
        </div>

        <footer className="mt-12 pt-8 border-t border-gray-200">
          <nav className="flex justify-between items-center">
            <Link
              href="/blog"
              className="text-teal-600 hover:text-teal-700 font-medium"
            >
              ← Back to Blog
            </Link>
          </nav>
        </footer>

        {/* FAQ Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-ink mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <details className="border border-sand/30 rounded-lg p-4 bg-white/50">
              <summary className="cursor-pointer font-medium text-lg text-ink hover:text-clay transition-colors">
                What does raku pottery mean?
              </summary>
              <p className="mt-3 text-ink/80 leading-relaxed">
                The word "raku" comes from Japanese and means "enjoyment," "pleasure," or "contentment." The term comes from a seal given to potter Chōjirō in 1584 by the emperor. So Raku pottery literally means "pottery of enjoyment," reflecting the joy that comes from creating and appreciating this unique art form.
              </p>
            </details>

            <details className="border border-sand/30 rounded-lg p-4 bg-white/50">
              <summary className="cursor-pointer font-medium text-lg text-ink hover:text-clay transition-colors">
                Why is raku pottery so expensive?
              </summary>
              <p className="mt-3 text-ink/80 leading-relaxed">
                Raku pottery can be expensive due to the high level of breakage during the firing process. The rapid cooling technique can often lead to thermal shock, meaning that the pots can easily crack and are ruined. Each piece also requires individual attention during the firing process, and since every piece is completely one-of-a-kind, they become artistic collectibles.
              </p>
            </details>

            <details className="border border-sand/30 rounded-lg p-4 bg-white/50">
              <summary className="cursor-pointer font-medium text-lg text-ink hover:text-clay transition-colors">
                How can you tell if pottery is raku?
              </summary>
              <p className="mt-3 text-ink/80 leading-relaxed">
                You can identify Raku pottery by its distinctive crackle lines from rapid cooling, metallic effects from special glazes, and smoky black areas where the pottery touched burning materials. This process creates unique patterns that regular pottery simply cannot achieve.
              </p>
            </details>

            <details className="border border-sand/30 rounded-lg p-4 bg-white/50">
              <summary className="cursor-pointer font-medium text-lg text-ink hover:text-clay transition-colors">
                What is the difference between raku and regular pottery?
              </summary>
              <p className="mt-3 text-ink/80 leading-relaxed">
                Raku firing is much quicker than normal firing, taking around 1-2 hours compared to regular firing which can take up to 24 hours. In raku, pottery must be removed from the kiln when red hot and cooled rapidly in combustible materials like sawdust. While regular pottery prioritizes functionality and consistency, Raku embraces unpredictability and is primarily decorative since it's not food-safe.
              </p>
            </details>
          </div>
        </section>

        {/* Popular Cities Section - Simplified */}
        <section className="mt-12 pt-12 pb-12 bg-white/50 rounded-xl">
          <div className="mx-auto max-w-4xl px-4">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-ink mb-2">
              Find Pottery Classes Near You
            </h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {popularCities.map((city) => (
              <Link 
                key={`${city.stateSlug}-${city.citySlug}`}
                href={`/pottery-classes/${city.stateSlug}/${city.citySlug}`}
                className="group bg-white rounded-xl p-3 hover:shadow-md transition-all border border-sand/20"
              >
                <div className="text-lg font-medium text-ink group-hover:text-clay transition-colors">
                  {city.city}
                </div>
                <div className="text-sm text-ink/50">
                  {city.state}
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-6">
            <Link href="/all-cities" className="text-sm text-teal hover:text-clay transition-colors">
              View all cities →
            </Link>
          </div>
        </div>
        </section>
      </div>
    </article>
  );
}