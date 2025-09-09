import { compileMDX } from 'next-mdx-remote/rsc';
import fs from 'fs/promises';
import path from 'path';
import remarkGfm from 'remark-gfm';

export type PostMeta = {
  title: string;
  date: string;
  excerpt: string;
  slug: string;
  author?: string;
  coverImage?: string;
  ogImage?: string;
  updated?: string;
  draft?: boolean;
};

export type Post = {
  meta: PostMeta;
  content: React.ReactNode;
};

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

export async function getAllPostMetas(): Promise<PostMeta[]> {
  try {
    const files = await fs.readdir(BLOG_DIR);
    const mdxFiles = files.filter((file) => file.endsWith('.mdx'));

    const posts = await Promise.all(
      mdxFiles.map(async (file) => {
        const filePath = path.join(BLOG_DIR, file);
        const source = await fs.readFile(filePath, 'utf8');

        const { frontmatter } = await compileMDX<PostMeta>({
          source,
          options: {
            parseFrontmatter: true,
          },
        });

        return frontmatter;
      })
    );

    return posts
      .filter((post) => !post.draft)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error reading blog posts:', error);
    return [];
  }
}

export async function getPostSlugs(): Promise<string[]> {
  const posts = await getAllPostMetas();
  return posts.map((post) => post.slug);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const files = await fs.readdir(BLOG_DIR);
    const mdxFiles = files.filter((file) => file.endsWith('.mdx'));

    for (const file of mdxFiles) {
      const filePath = path.join(BLOG_DIR, file);
      const source = await fs.readFile(filePath, 'utf8');

      const { content, frontmatter } = await compileMDX<PostMeta>({
        source,
        options: {
          parseFrontmatter: true,
          mdxOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      });

      if (frontmatter.slug === slug && !frontmatter.draft) {
        return {
          meta: frontmatter,
          content,
        };
      }
    }

    return null;
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}