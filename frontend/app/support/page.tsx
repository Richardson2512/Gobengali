"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HelpCircle, Mail, MessageCircle, Book, Search, ChevronDown } from "lucide-react";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
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

      {/* Hero */}
      <section className="py-16 text-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <HelpCircle size={48} className="text-purple-600 mx-auto mb-6" />
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            How can we help you?
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Get support, find answers, or reach out to our team
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help..."
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none text-lg"
            />
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <SupportOption
              icon={<Book className="text-blue-600" />}
              title="Documentation"
              description="Comprehensive guides and API reference"
              link="/documentation"
              linkText="Browse Docs"
            />
            <SupportOption
              icon={<MessageCircle className="text-green-600" />}
              title="Community Forum"
              description="Ask questions and connect with other users"
              link="#"
              linkText="Visit Forum"
            />
            <SupportOption
              icon={<Mail className="text-purple-600" />}
              title="Email Support"
              description="Get help from our support team"
              link="mailto:support@gobengali.com"
              linkText="Email Us"
            />
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>

            <div className="space-y-4">
              <FAQItem
                question="How do I get started with GoBengali?"
                answer="Simply visit gobengali.com, and start typing in the editor. You can type in English or Bengali. The AI will automatically provide suggestions for grammar, spelling, and transliteration."
              />
              <FAQItem
                question="What are the free tier limitations?"
                answer="The free tier allows you to write up to 500 words per day and accept up to 15 AI suggestions per day. These limits reset at midnight every day. Upgrade to Pro for unlimited access."
              />
              <FAQItem
                question="How does transliteration work?"
                answer="When you type in English, GoBengali automatically shows Bengali word suggestions in a dropdown. Simply press Space to accept the first suggestion, or use arrow keys to select from multiple options."
              />
              <FAQItem
                question="Can I export my documents?"
                answer="Yes! You can export your content to Text (.txt) or Word (.docx) format with perfect Bengali Unicode support. PDF export is available but not recommended for Bengali text."
              />
              <FAQItem
                question="Which AI models does GoBengali use?"
                answer="GoBengali uses state-of-the-art AI models including mT5 for grammar checking, BSpell for spelling correction, and NLLB-200 for translation. We also have fallback models like IndicBERT and LanguageTool for reliability."
              />
              <FAQItem
                question="How accurate is the grammar checker?"
                answer="Our AI models achieve over 95% accuracy for Bengali grammar and spelling. The AI is continuously learning and improving from user feedback."
              />
              <FAQItem
                question="Can I use GoBengali offline?"
                answer="GoBengali requires an internet connection as all AI processing happens in the cloud to ensure you always get the best and most up-to-date corrections."
              />
              <FAQItem
                question="Is my data secure?"
                answer="Yes. We take data security seriously. Your documents are processed securely and are not stored on our servers. We only keep anonymous usage statistics to improve the service."
              />
              <FAQItem
                question="How do I upgrade to Pro?"
                answer="Click on the 'Upgrade to Pro' button anywhere in the app. Pro gives you unlimited word count, unlimited AI suggestions, and priority support."
              />
              <FAQItem
                question="Do you offer refunds?"
                answer="Yes, we offer a 30-day money-back guarantee. If you're not satisfied with Pro, contact us at support@gobengali.com for a full refund."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Still need help?</h2>
            <p className="text-xl text-gray-600">Our support team is here for you</p>
          </div>

          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-12 text-center">
            <Mail size={48} className="text-white mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-white mb-4">Contact Support</h3>
            <p className="text-green-100 mb-8 max-w-2xl mx-auto">
              Send us an email and we'll get back to you within 24 hours
            </p>
            <a
              href="mailto:support@gobengali.com"
              className="inline-block bg-white text-green-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-50 transition-colors shadow-lg"
            >
              support@gobengali.com
            </a>
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Helpful Resources</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <ResourceCard
              title="Getting Started Guide"
              link="/guides"
            />
            <ResourceCard
              title="Video Tutorials"
              link="/guides"
            />
            <ResourceCard
              title="API Documentation"
              link="/documentation#api"
            />
            <ResourceCard
              title="Bengali Language Guide"
              link="/guides"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function SupportOption({ icon, title, description, link, linkText }: any) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      <Link
        href={link}
        className="inline-block text-green-600 hover:text-green-700 font-semibold"
      >
        {linkText} →
      </Link>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:border-purple-300 transition-colors bg-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-900 pr-4">{question}</span>
        <ChevronDown
          size={20}
          className={`text-purple-600 flex-shrink-0 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-gray-700">{answer}</p>
        </div>
      )}
    </div>
  );
}

function ResourceCard({ title, link }: any) {
  return (
    <Link
      href={link}
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 text-center"
    >
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <span className="text-green-600 text-sm font-semibold">Learn more →</span>
    </Link>
  );
}

