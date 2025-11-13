"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Calendar, User, ArrowRight, Tag } from "lucide-react";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <span className="text-xl font-bold text-gray-900">GoBengali</span>
          </Link>
          <Link href="/" className="text-green-600 hover:text-green-700 font-semibold">
            ← Back to Editor
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 text-center bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="container mx-auto px-4 max-w-4xl">
          <BookOpen size={48} className="text-white mx-auto mb-6" />
          <h1 className="text-5xl font-bold text-white mb-6">
            GoBengali Blog
          </h1>
          <p className="text-xl text-green-100">
            Tips, updates, and insights about Bengali writing and AI technology
          </p>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Post</h2>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow">
            <div className="md:flex">
              <div className="md:w-1/2 bg-gradient-to-br from-green-600 to-emerald-600 p-12 flex items-center justify-center">
                <div className="text-center text-white">
                  <BookOpen size={80} className="mx-auto mb-6" />
                  <h3 className="text-4xl font-bold">Featured Article</h3>
                </div>
              </div>
              <div className="md:w-1/2 p-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                    AI & Technology
                  </span>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar size={14} />
                    November 10, 2025
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  How AI is Revolutionizing Bengali Language Processing
                </h3>
                <p className="text-gray-600 mb-6">
                  Discover how modern AI models like mT5 and NLLB-200 are transforming the way we write, translate, and understand Bengali content. Learn about the technology behind GoBengali and the future of Bengali NLP.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-700">
                    <User size={16} />
                    <span className="text-sm">GoBengali Team</span>
                  </div>
                  <a href="#" className="text-green-600 hover:text-green-700 font-semibold flex items-center gap-2">
                    Read More <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Recent Posts</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <BlogCard
              category="Tips & Tricks"
              title="10 Ways to Improve Your Bengali Writing"
              excerpt="Master these essential techniques to write more engaging and grammatically correct Bengali content."
              date="November 8, 2025"
              author="Content Team"
              readTime="5 min read"
            />
            <BlogCard
              category="Product Updates"
              title="Introducing Live Transliteration"
              excerpt="Type in English and see Bengali suggestions appear instantly. Learn how to use our new real-time transliteration feature."
              date="November 5, 2025"
              author="Product Team"
              readTime="3 min read"
            />
            <BlogCard
              category="Language Guide"
              title="Understanding Bengali Grammar Rules"
              excerpt="A comprehensive guide to Bengali grammar fundamentals that every writer should know."
              date="November 1, 2025"
              author="Language Team"
              readTime="8 min read"
            />
            <BlogCard
              category="Case Study"
              title="How Students Use GoBengali for Academic Success"
              excerpt="Real stories from students who improved their Bengali writing skills using GoBengali's AI tools."
              date="October 28, 2025"
              author="Community Team"
              readTime="6 min read"
            />
            <BlogCard
              category="AI Technology"
              title="Behind the Scenes: Training Bengali AI Models"
              excerpt="An inside look at how we train and optimize our AI models for Bengali language processing."
              date="October 25, 2025"
              author="ML Team"
              readTime="10 min read"
            />
            <BlogCard
              category="Best Practices"
              title="Writing Professional Bengali Emails"
              excerpt="Tips and templates for writing clear, professional emails in Bengali for business communication."
              date="October 20, 2025"
              author="Content Team"
              readTime="7 min read"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Browse by Category</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <CategoryCard name="Product Updates" count={12} color="green" />
            <CategoryCard name="Tips & Tricks" count={24} color="blue" />
            <CategoryCard name="Language Guide" count={18} color="purple" />
            <CategoryCard name="AI Technology" count={15} color="orange" />
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-xl text-green-100 mb-8">
            Get the latest tips, updates, and Bengali writing resources delivered to your inbox
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              />
              <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors">
                Subscribe
              </button>
            </div>
            <p className="text-green-100 text-sm mt-3">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function BlogCard({ category, title, excerpt, date, author, readTime }: any) {
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
          <a href="#">{title}</a>
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
        <a
          href="#"
          className="text-green-600 hover:text-green-700 font-semibold text-sm flex items-center gap-2"
        >
          Read More <ArrowRight size={14} />
        </a>
      </div>
    </article>
  );
}

function CategoryCard({ name, count, color }: any) {
  const colorClasses = {
    green: 'bg-green-100 text-green-700 hover:bg-green-200',
    blue: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    purple: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
    orange: 'bg-orange-100 text-orange-700 hover:bg-orange-200',
  };

  return (
    <a
      href="#"
      className={`p-6 rounded-xl transition-colors ${colorClasses[color as keyof typeof colorClasses]}`}
    >
      <h3 className="font-bold text-lg mb-2">{name}</h3>
      <p className="text-sm opacity-75">{count} articles</p>
    </a>
  );
}

