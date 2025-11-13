"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Code, Terminal, Globe, Type, FileText, Zap } from "lucide-react";
import { Footer } from "@/components/Footer";

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white shadow-sm sticky top-0 z-50">
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

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="md:col-span-1">
            <nav className="sticky top-24 space-y-1">
              <h3 className="font-bold text-gray-900 mb-4">Documentation</h3>
              <a href="#getting-started" className="block px-3 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded">Getting Started</a>
              <a href="#editor" className="block px-3 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded">Using the Editor</a>
              <a href="#transliteration" className="block px-3 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded">Transliteration</a>
              <a href="#ai-assistant" className="block px-3 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded">AI Assistant</a>
              <a href="#export" className="block px-3 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded">Exporting Documents</a>
              <a href="#api" className="block px-3 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded">API Reference</a>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="md:col-span-3 prose prose-green max-w-none">
            {/* Getting Started */}
            <section id="getting-started" className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Zap size={24} className="text-green-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 m-0">Documentation</h1>
              </div>
              <p className="text-xl text-gray-600 mb-8">
                Complete guide to using GoBengali for perfect Bengali writing
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">Getting Started</h2>
              <p className="text-gray-700 mb-4">
                GoBengali is an AI-powered Bengali writing assistant that helps you write with perfect grammar, spelling, and style.
              </p>

              <div className="bg-green-50 border-l-4 border-green-600 p-6 my-6">
                <h3 className="text-xl font-bold text-green-900 mb-2">Quick Start</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Open the GoBengali editor at <code className="bg-green-100 px-2 py-1 rounded">gobengali.com</code></li>
                  <li>Start typing in English or Bengali</li>
                  <li>Get real-time suggestions and corrections</li>
                  <li>Accept suggestions or export your document</li>
                </ol>
              </div>
            </section>

            {/* Using the Editor */}
            <section id="editor" className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText size={24} className="text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 m-0">Using the Editor</h2>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Text Formatting</h3>
              <p className="text-gray-700 mb-4">
                The editor supports rich text formatting with the toolbar:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                <li><strong>Headings:</strong> H1, H2, H3 for document structure</li>
                <li><strong>Text Styles:</strong> Bold, Italic, Underline</li>
                <li><strong>Lists:</strong> Bullet lists and numbered lists</li>
                <li><strong>Alignment:</strong> Left, Center, Right alignment</li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Word Limits</h3>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 my-6">
                <p className="text-gray-700">
                  <strong>Free Tier:</strong> 500 words per day, 15 AI suggestion accepts per day
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>Pro Tier:</strong> Unlimited words and suggestions
                </p>
              </div>
            </section>

            {/* Transliteration */}
            <section id="transliteration" className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Type size={24} className="text-purple-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 m-0">Live Transliteration</h2>
              </div>

              <p className="text-gray-700 mb-4">
                Type in English and get instant Bengali suggestions as you write.
              </p>

              <div className="bg-gray-100 p-6 rounded-lg my-6">
                <h4 className="font-bold text-gray-900 mb-3">Example:</h4>
                <div className="space-y-2">
                  <p className="text-gray-700">You type: <code className="bg-white px-2 py-1 rounded">namaste</code></p>
                  <p className="text-gray-700">Suggestions: <span className="text-2xl">নমস্তে, নমস্কার, নমস্কারম</span></p>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How to Use</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Type an English word (minimum 2 characters)</li>
                <li>A dropdown will appear with Bengali suggestions</li>
                <li>Press <kbd className="bg-gray-200 px-2 py-1 rounded">Space</kbd> to accept the first suggestion</li>
                <li>Use arrow keys to select different suggestions</li>
              </ol>
            </section>

            {/* AI Assistant */}
            <section id="ai-assistant" className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <BookOpen size={24} className="text-emerald-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 m-0">AI Assistant</h2>
              </div>

              <p className="text-gray-700 mb-4">
                The AI Assistant panel shows real-time grammar and spelling corrections for your Bengali text.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">AI Models Used</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                <li><strong>Grammar:</strong> mT5 (primary), IndicBERT (fallback)</li>
                <li><strong>Spelling:</strong> BSpell (primary), LanguageTool (fallback)</li>
                <li><strong>Translation:</strong> NLLB-200</li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Accepting Suggestions</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Accept:</strong> Apply a single correction</li>
                <li><strong>Reject:</strong> Dismiss a suggestion</li>
                <li><strong>Accept All:</strong> Apply all corrections at once</li>
                <li><strong>Reject All:</strong> Dismiss all suggestions</li>
              </ul>
            </section>

            {/* Export */}
            <section id="export" className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FileText size={24} className="text-orange-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 m-0">Exporting Documents</h2>
              </div>

              <p className="text-gray-700 mb-4">
                Export your Bengali content in multiple formats:
              </p>

              <div className="grid md:grid-cols-2 gap-4 my-6">
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <h4 className="font-bold text-green-900 mb-2">✓ Text (.txt)</h4>
                  <p className="text-sm text-gray-700">Perfect Unicode support for Bengali</p>
                </div>
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <h4 className="font-bold text-green-900 mb-2">✓ Word (.docx)</h4>
                  <p className="text-sm text-gray-700">Full Bengali font support in Word</p>
                </div>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-6 my-6">
                <p className="text-gray-700">
                  <strong>⚠ PDF Export:</strong> Not recommended for Bengali text as it may show garbled characters. Use TXT or DOCX instead.
                </p>
              </div>
            </section>

            {/* API Reference */}
            <section id="api" className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Code size={24} className="text-indigo-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 m-0">API Reference</h2>
              </div>

              <p className="text-gray-700 mb-4">
                Integrate GoBengali's AI capabilities into your own applications.
              </p>

              <div className="bg-gray-900 text-white p-6 rounded-lg my-6 overflow-x-auto">
                <p className="text-green-400 mb-2"># Base URL</p>
                <code>https://api.gobengali.com</code>

                <p className="text-green-400 mt-6 mb-2"># Endpoints</p>
                <p className="mb-1">POST /api/translate</p>
                <p className="mb-1">POST /api/grammar/check</p>
                <p className="mb-1">POST /api/spelling/check</p>
                <p className="mb-1">POST /api/transliterate</p>
              </div>

              <p className="text-gray-700">
                For detailed API documentation and authentication, please contact us at{" "}
                <a href="mailto:api@gobengali.com" className="text-green-600 hover:text-green-700 font-semibold">
                  api@gobengali.com
                </a>
              </p>
            </section>

            {/* Support */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 rounded-xl text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Need Help?</h3>
              <p className="text-green-100 mb-6">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <Link
                href="/support"
                className="inline-block bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}

