"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Calendar, User, ArrowRight, Tag } from "lucide-react";
import { Footer } from "@/components/Footer";

const posts = [
  {
    slug: "best-bangla-grammar-checker-tools-2024",
    category: "Tools & Reviews",
    title: "Best Bangla Grammar Checker Tools in 2024",
    excerpt:
      "A detailed comparison of the top Bengali grammar checking tools available today — from rule-based systems to AI-powered assistants like GoBengali.",
    date: "January 15, 2025",
    author: "GoBengali Team",
    readTime: "6 min read",
  },
  {
    slug: "how-bangla-transliteration-works",
    category: "Technology",
    title: "How Bangla Transliteration Works: Typing Bengali with an English Keyboard",
    excerpt:
      "Learn how phonetic transliteration converts English keystrokes into Bengali script in real time, and why it's the fastest way to type Bangla.",
    date: "January 8, 2025",
    author: "GoBengali Team",
    readTime: "5 min read",
  },
  {
    slug: "common-bengali-spelling-mistakes",
    category: "Language Guide",
    title: "10 Common Bengali Spelling Mistakes and How to Fix Them",
    excerpt:
      "Even native speakers make these recurring Bengali spelling errors. Here's a practical guide to identifying and correcting the most frequent mistakes.",
    date: "December 28, 2024",
    author: "GoBengali Team",
    readTime: "7 min read",
  },
  {
    slug: "english-to-bengali-translation-guide",
    category: "Translation",
    title: "English to Bengali Translation: Tips for Natural-Sounding Output",
    excerpt:
      "Machine translation has come a long way, but getting truly natural Bengali from English still requires knowing a few key techniques.",
    date: "December 18, 2024",
    author: "GoBengali Team",
    readTime: "8 min read",
  },
  {
    slug: "ai-bengali-writing-assistant-for-students",
    category: "Use Cases",
    title: "Why Every Bengali Student Needs an AI Writing Assistant",
    excerpt:
      "From school essays to university dissertations, an AI-powered Bengali writing assistant can dramatically improve accuracy and save hours of proofreading.",
    date: "December 10, 2024",
    author: "GoBengali Team",
    readTime: "5 min read",
  },
];

export default function BlogPage() {
  const [featured, ...rest] = posts;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="GoBengali Logo" className="h-10 w-auto" />
            <span className="text-xl font-bold text-gray-900">GoBengali</span>
          </Link>
          <Link href="/" className="text-green-600 hover:text-green-700 font-semibold">
            ← Back to Editor
          </Link>
        </div>
      </header>

      <section className="py-20 text-center bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="container mx-auto px-4 max-w-4xl">
          <BookOpen size={48} className="text-white mx-auto mb-6" />
          <h1 className="text-5xl font-bold text-white mb-6">GoBengali Blog</h1>
          <p className="text-xl text-green-100">
            Guides, tips, and insights about Bengali writing, grammar, and AI tools
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Post</h2>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow">
            <div className="md:flex">
              <div className="md:w-1/2 bg-gradient-to-br from-green-600 to-emerald-600 p-12 flex items-center justify-center">
                <div className="text-center text-white">
                  <BookOpen size={80} className="mx-auto mb-6" />
                  <h3 className="text-3xl font-bold">Featured Article</h3>
                </div>
              </div>
              <div className="md:w-1/2 p-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                    {featured.category}
                  </span>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar size={14} />
                    {featured.date}
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">{featured.title}</h3>
                <p className="text-gray-600 mb-6">{featured.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-700">
                    <User size={16} />
                    <span className="text-sm">{featured.author}</span>
                  </div>
                  <Link
                    href={`/blog/${featured.slug}`}
                    className="text-green-600 hover:text-green-700 font-semibold flex items-center gap-2"
                  >
                    Read More <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Recent Posts</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {rest.map((post) => (
              <BlogCard key={post.slug} {...post} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function BlogCard({ slug, category, title, excerpt, date, author, readTime }: (typeof posts)[0]) {
  return (
    <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
            <Tag size={12} />
            {category}
          </span>
          <span className="text-xs text-gray-500">{readTime}</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-green-600 transition-colors">
          <Link href={`/blog/${slug}`}>{title}</Link>
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{excerpt}</p>
        <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <User size={14} />
            <span>{author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            <span>{date}</span>
          </div>
        </div>
      </div>
      <div className="px-6 pb-6">
        <Link
          href={`/blog/${slug}`}
          className="text-green-600 hover:text-green-700 font-semibold text-sm flex items-center gap-2"
        >
          Read More <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  );
}
