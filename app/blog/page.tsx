import type { Metadata } from "next";
import Link from "next/link";
import Contact from "@/components/Contact";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes on motion, frontend engineering and building things for the web — by Oguz Tozkoparan.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <main className="px-6 pt-32 md:px-10 md:pt-40">
        <p className="label text-dim">
          <span className="text-acid">Blog</span> / {posts.length} posts
        </p>
        <h1 className="display mt-6 text-6xl text-ink md:text-8xl">
          Field
          <br />
          <span className="text-acid">Notes</span>
        </h1>
        <p className="mt-6 max-w-md text-dim">
          Notes on motion, frontend engineering and building things for the
          web.
        </p>

        <div className="mt-16">
          {posts.map((post, i) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className={`cap-row grid gap-3 border-t border-line px-2 py-8 md:grid-cols-[8rem_1fr_minmax(0,20rem)_4rem] md:items-baseline md:gap-6 md:px-4 md:py-10 ${
                i === posts.length - 1 ? "border-b" : ""
              }`}
            >
              <span className="label text-dim">{post.date}</span>
              <h2 className="display text-2xl text-ink sm:text-4xl">
                {post.title}
              </h2>
              <p className="label leading-relaxed text-dim md:text-right">
                {post.tags.join(" · ")}
              </p>
              <span className="label text-dim md:text-right">
                {post.readingMinutes} min
              </span>
            </Link>
          ))}
        </div>
      </main>
      <Contact />
    </>
  );
}
