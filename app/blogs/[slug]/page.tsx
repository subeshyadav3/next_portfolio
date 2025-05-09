import { getPostBySlug,getAllPosts } from '@/app/lib/blogs';
import { remark } from 'remark';
import html from 'remark-html';
import { notFound } from 'next/navigation';
import Head from 'next/head';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map(post => ({ slug: post.slug }));
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) return notFound();

  const processedContent = await remark().use(html).process(post.content);
  const contentHtml = processedContent.toString();

  const fullUrl = `https://subeshyadav.com.np/blogs/${params.slug}`;

  return (
    <>
      <Head>
        <title>{post.title}</title>
        <meta name="description" content={post.title} />
        <link rel="canonical" href={fullUrl} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "datePublished": post.date,
            "url": fullUrl,
          })
        }} />
      </Head>

      <article className="p-4 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold">{post.title}</h1>
        <p className="text-sm text-gray-500 mb-6">Published on {post.date}</p>
        <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </article>
    </>
  );
}
