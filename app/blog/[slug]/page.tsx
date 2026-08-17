import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Contact from "@/components/Contact";
import { getAllPosts, getPost } from "@/lib/blog";
import { site } from "@/lib/data";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.meta.title,
    description: post.meta.description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.meta.title,
      description: post.meta.description,
      type: "article",
      publishedTime: post.meta.date,
      url: `/blog/${slug}`,
      images: ["/og.png"],
    },
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.meta.title,
    description: post.meta.description,
    datePublished: post.meta.date,
    author: { "@type": "Person", name: site.name, url: site.url },
    url: `${site.url}/blog/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="px-6 pt-32 md:px-10 md:pt-40">
        <div className="mx-auto max-w-3xl">
          <Link href="/blog" className="link-sweep label text-dim">
            ← All posts
          </Link>
          <p className="label mt-10 text-dim">
            {post.meta.date} · {post.meta.readingMinutes} min ·{" "}
            <span className="text-acid">{post.meta.tags.join(" · ")}</span>
          </p>
          <h1 className="display mt-4 text-4xl text-ink md:text-6xl">
            {post.meta.title}
          </h1>
          <article
            className="prose prose-invert mt-12 max-w-none pb-10 prose-headings:font-display prose-headings:uppercase prose-a:text-acid prose-code:text-acid/90 prose-pre:border prose-pre:border-line prose-pre:bg-panel prose-blockquote:border-acid"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </div>
      </main>
      <Contact />
    </>
  );
}
