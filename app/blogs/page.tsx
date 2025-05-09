import Link from 'next/link';
import { getAllPosts } from '../lib/blogs';

export default function BlogListPage() {
  const posts = getAllPosts();

  return (
    <main className="p-4">
      <h1 className="text-3xl font-bold mb-4">Blog</h1>
      <ul>
        {posts.map(post => (
          <li key={post.slug}>
            <Link href={`/blogs/${post.slug}`}>
              <span className="text-blue-600 hover:underline">{post.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
