"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Video, FileText, Lightbulb, Target, Users } from "lucide-react";

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
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
      <section className="py-16 text-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <BookOpen size={48} className="text-green-600 mx-auto mb-6" />
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Guides & Tutorials
          </h1>
          <p className="text-xl text-gray-600">
            Learn how to make the most of GoBengali with our step-by-step guides
          </p>
        </div>
      </section>

      {/* Guides Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Beginner Guides */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Getting Started</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <GuideCard
                icon={<Target className="text-green-600" />}
                title="Writing Your First Bengali Document"
                description="A complete beginner's guide to using GoBengali for the first time"
                duration="5 min read"
                level="Beginner"
                href="#"
              />
              <GuideCard
                icon={<Lightbulb className="text-blue-600" />}
                title="Understanding the AI Assistant"
                description="Learn how to use AI suggestions to improve your Bengali writing"
                duration="7 min read"
                level="Beginner"
                href="#"
              />
              <GuideCard
                icon={<FileText className="text-purple-600" />}
                title="Text Formatting Basics"
                description="Master headings, bold, italic, and other formatting options"
                duration="4 min read"
                level="Beginner"
                href="#"
              />
              <GuideCard
                icon={<Video className="text-orange-600" />}
                title="Live Transliteration Tutorial"
                description="Type in English and convert to Bengali in real-time"
                duration="6 min read"
                level="Beginner"
                href="#"
              />
            </div>
          </div>

          {/* Intermediate Guides */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Advanced Features</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <GuideCard
                icon={<FileText className="text-emerald-600" />}
                title="Working with Large Documents"
                description="Tips for managing long-form Bengali content efficiently"
                duration="8 min read"
                level="Intermediate"
                href="#"
              />
              <GuideCard
                icon={<Target className="text-indigo-600" />}
                title="Grammar Checking Best Practices"
                description="Get the most accurate grammar suggestions for Bengali"
                duration="10 min read"
                level="Intermediate"
                href="#"
              />
              <GuideCard
                icon={<Lightbulb className="text-pink-600" />}
                title="Exporting to Different Formats"
                description="Choose the right export format for your needs"
                duration="5 min read"
                level="Intermediate"
                href="#"
              />
              <GuideCard
                icon={<Video className="text-red-600" />}
                title="Keyboard Shortcuts & Productivity"
                description="Speed up your workflow with essential shortcuts"
                duration="6 min read"
                level="Intermediate"
                href="#"
              />
            </div>
          </div>

          {/* Use Cases */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Use Cases</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <UseCaseCard
                icon={<Users className="text-blue-600" />}
                title="For Students"
                description="Write essays, assignments, and research papers in perfect Bengali"
              />
              <UseCaseCard
                icon={<Target className="text-green-600" />}
                title="For Professionals"
                description="Create business documents, emails, and reports with confidence"
              />
              <UseCaseCard
                icon={<BookOpen className="text-purple-600" />}
                title="For Writers & Bloggers"
                description="Craft engaging Bengali content with AI-powered assistance"
              />
              <UseCaseCard
                icon={<FileText className="text-orange-600" />}
                title="For Translators"
                description="Translate and refine English to Bengali content quickly"
              />
              <UseCaseCard
                icon={<Video className="text-pink-600" />}
                title="For Content Creators"
                description="Produce social media content and captions in Bengali"
              />
              <UseCaseCard
                icon={<Lightbulb className="text-indigo-600" />}
                title="For Educators"
                description="Prepare teaching materials and lesson plans in Bengali"
              />
            </div>
          </div>

          {/* Video Tutorials Section */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-12 rounded-2xl text-center mb-16">
            <Video size={48} className="text-white mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Video Tutorials Coming Soon</h2>
            <p className="text-green-100 mb-6 max-w-2xl mx-auto">
              We're creating comprehensive video tutorials to help you master GoBengali. 
              Subscribe to our newsletter to get notified when they're available!
            </p>
            <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors">
              Notify Me
            </button>
          </div>

          {/* Tips & Tricks */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Tips & Tricks</h2>
            <div className="space-y-4">
              <TipCard
                tip="Use Space to quickly accept transliteration suggestions instead of clicking"
                category="Productivity"
              />
              <TipCard
                tip="Accept All suggestions at once to apply multiple corrections quickly"
                category="AI Assistant"
              />
              <TipCard
                tip="Export to DOCX format for Bengali content you need to edit further in Word"
                category="Export"
              />
              <TipCard
                tip="The AI Assistant shows suggestions in Bengali to help you understand corrections better"
                category="Learning"
              />
              <TipCard
                tip="Free tier gives you 500 words/day and 15 AI accepts - perfect for casual use"
                category="Free Tier"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Writing?</h2>
          <p className="text-gray-600 mb-8">
            Put these guides into practice and create amazing Bengali content today
          </p>
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
          >
            Open Editor
          </Link>
        </div>
      </section>
    </div>
  );
}

function GuideCard({ icon, title, description, duration, level, href }: any) {
  return (
    <a
      href={href}
      className="block bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-200"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm mb-4">{description}</p>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-500">{duration}</span>
            <span className={`px-2 py-1 rounded text-xs font-semibold ${
              level === 'Beginner' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {level}
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}

function UseCaseCard({ icon, title, description }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}

function TipCard({ tip, category }: any) {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
      <div className="flex items-start gap-3">
        <Lightbulb size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="text-xs font-semibold text-yellow-700 uppercase">{category}</span>
          <p className="text-gray-700 mt-1">{tip}</p>
        </div>
      </div>
    </div>
  );
}

