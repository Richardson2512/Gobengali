"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle, Globe, BookOpen, Sparkles, Type, FileDown, Zap } from "lucide-react";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
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

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Powerful Features for <span className="text-green-600">Bengali Writing</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Everything you need to write perfect Bengali content with AI assistance
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1: Grammar Checker */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Grammar Checker</h3>
              <p className="text-gray-600 mb-4">
                Advanced AI-powered grammar checking that understands Bengali language nuances and context.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-green-600 mt-1 flex-shrink-0" />
                  <span>Real-time grammar corrections</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-green-600 mt-1 flex-shrink-0" />
                  <span>Context-aware suggestions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-green-600 mt-1 flex-shrink-0" />
                  <span>Detailed error explanations in Bengali</span>
                </li>
              </ul>
            </div>

            {/* Feature 2: Spelling Checker */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <BookOpen size={32} className="text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Spelling Checker</h3>
              <p className="text-gray-600 mb-4">
                Catch every spelling mistake with our intelligent Bengali spelling correction system.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-blue-600 mt-1 flex-shrink-0" />
                  <span>Comprehensive Bengali dictionary</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-blue-600 mt-1 flex-shrink-0" />
                  <span>Smart word suggestions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-blue-600 mt-1 flex-shrink-0" />
                  <span>Handles complex Bengali words</span>
                </li>
              </ul>
            </div>

            {/* Feature 3: Bengali Translator */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Globe size={32} className="text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Bengali Translator</h3>
              <p className="text-gray-600 mb-4">
                High-quality translation between English and Bengali using state-of-the-art AI models.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-purple-600 mt-1 flex-shrink-0" />
                  <span>NLLB-200 AI translation model</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-purple-600 mt-1 flex-shrink-0" />
                  <span>Natural-sounding translations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-purple-600 mt-1 flex-shrink-0" />
                  <span>Preserves context and meaning</span>
                </li>
              </ul>
            </div>

            {/* Feature 4: AI Writing Assistant */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-emerald-100 rounded-lg flex items-center justify-center mb-6">
                <Sparkles size={32} className="text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Writing Assistant</h3>
              <p className="text-gray-600 mb-4">
                Get intelligent suggestions and corrections as you type with our real-time AI assistant.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-emerald-600 mt-1 flex-shrink-0" />
                  <span>Live error detection</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-emerald-600 mt-1 flex-shrink-0" />
                  <span>One-click corrections</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-emerald-600 mt-1 flex-shrink-0" />
                  <span>Accept all or individual suggestions</span>
                </li>
              </ul>
            </div>

            {/* Feature 5: Live Transliteration */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                <Type size={32} className="text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Live Transliteration</h3>
              <p className="text-gray-600 mb-4">
                Type in English and see Bengali suggestions appear instantly as you write.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-orange-600 mt-1 flex-shrink-0" />
                  <span>Real-time English to Bengali conversion</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-orange-600 mt-1 flex-shrink-0" />
                  <span>Multiple word suggestions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-orange-600 mt-1 flex-shrink-0" />
                  <span>Smart keyboard shortcuts</span>
                </li>
              </ul>
            </div>

            {/* Feature 6: Export Documents */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                <FileDown size={32} className="text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Export Documents</h3>
              <p className="text-gray-600 mb-4">
                Save your Bengali content in multiple formats with perfect Unicode support.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-red-600 mt-1 flex-shrink-0" />
                  <span>Export to TXT, DOCX formats</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-red-600 mt-1 flex-shrink-0" />
                  <span>Full Bengali font support</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-red-600 mt-1 flex-shrink-0" />
                  <span>One-click download</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pro Features Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <Zap size={48} className="text-white mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-4">Unlock Pro Features</h2>
          <p className="text-xl text-green-100 mb-8">
            Get unlimited access to all features with GoBengali Pro
          </p>
          <div className="grid md:grid-cols-2 gap-6 text-left mb-8">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <h3 className="text-xl font-bold text-white mb-3">Free Tier</h3>
              <ul className="space-y-2 text-green-100">
                <li>✓ 500 words per day</li>
                <li>✓ 15 AI suggestion accepts/day</li>
                <li>✓ Basic features</li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <h3 className="text-xl font-bold text-white mb-3">Pro Tier</h3>
              <ul className="space-y-2 text-green-100">
                <li>✓ Unlimited words</li>
                <li>✓ Unlimited AI suggestions</li>
                <li>✓ Priority support</li>
              </ul>
            </div>
          </div>
          <Link
            href="/"
            className="inline-block bg-white text-green-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-50 transition-colors shadow-lg"
          >
            Try GoBengali Free
          </Link>
        </div>
      </section>
    </div>
  );
}

