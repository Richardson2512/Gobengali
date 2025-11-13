"use client";

import React from "react";
import Link from "next/link";
import { Heart, Target, Users, Zap, Globe, Award } from "lucide-react";
import { Footer } from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
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
      <section className="py-20 bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            About <span className="text-green-600">GoBengali</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Empowering Bengali writers with AI-powered tools for perfect grammar, spelling, and translation
          </p>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center">
                  <Target size={28} className="text-green-600" />
                </div>
                <h2 className="text-4xl font-bold text-gray-900">Our Mission</h2>
              </div>
              <p className="text-lg text-gray-700 mb-4">
                We believe that everyone should be able to write in Bengali with confidence. GoBengali was created to break down language barriers and help Bengali speakers around the world communicate more effectively.
              </p>
              <p className="text-lg text-gray-700">
                Our AI-powered platform makes it easy to write perfect Bengali content, whether you're a student, professional, writer, or just someone who wants to improve their Bengali writing skills.
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-12 rounded-2xl text-white">
              <h3 className="text-3xl font-bold mb-6">Our Vision</h3>
              <p className="text-green-100 text-lg mb-4">
                To become the world's leading Bengali writing assistant, helping millions of people write better Bengali content every day.
              </p>
              <p className="text-green-100 text-lg">
                We're committed to preserving and promoting the Bengali language in the digital age.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <ValueCard
              icon={<Heart className="text-red-600" />}
              title="User First"
              description="Everything we build is designed with our users in mind. Your feedback drives our development."
            />
            <ValueCard
              icon={<Zap className="text-yellow-600" />}
              title="Innovation"
              description="We leverage cutting-edge AI technology to provide the most accurate Bengali language tools."
            />
            <ValueCard
              icon={<Globe className="text-blue-600" />}
              title="Accessibility"
              description="Quality Bengali writing tools should be accessible to everyone, regardless of location or budget."
            />
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powered by Advanced AI</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              GoBengali uses state-of-the-art machine learning models specifically trained for Bengali language processing
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <TechCard
              title="mT5 Grammar Model"
              description="Advanced transformer-based model for context-aware Bengali grammar checking with 95%+ accuracy"
              stats="1B+ parameters"
            />
            <TechCard
              title="NLLB-200 Translation"
              description="Facebook's state-of-the-art multilingual model supporting high-quality English-Bengali translation"
              stats="200 languages"
            />
            <TechCard
              title="BSpell Spelling Checker"
              description="Specialized Bengali spelling correction engine with comprehensive dictionary coverage"
              stats="100K+ words"
            />
            <TechCard
              title="IndicBERT Fallback"
              description="Reliable backup model ensuring uninterrupted service and accurate corrections"
              stats="99.9% uptime"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <StatCard number="10K+" label="Active Users" />
            <StatCard number="1M+" label="Words Processed" />
            <StatCard number="95%" label="Accuracy Rate" />
            <StatCard number="24/7" label="Support Available" />
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <Users size={48} className="text-green-600 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Team</h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            GoBengali is built by a passionate team of linguists, engineers, and AI researchers dedicated to advancing Bengali language technology
          </p>
          <div className="bg-green-50 p-8 rounded-xl border-2 border-green-200">
            <p className="text-gray-700 text-lg">
              We're a diverse, global team united by our love for the Bengali language and commitment to making it easier for everyone to write in Bengali.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Join the GoBengali Community</h2>
          <p className="text-xl text-gray-600 mb-8">
            Start writing better Bengali content today with our AI-powered tools
          </p>
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
          >
            Try GoBengali Free
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function ValueCard({ icon, title, description }: any) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function TechCard({ title, description, stats }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-gray-200 hover:border-green-500 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
          {stats}
        </span>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function StatCard({ number, label }: any) {
  return (
    <div>
      <div className="text-5xl font-bold text-white mb-2">{number}</div>
      <div className="text-green-100 text-lg">{label}</div>
    </div>
  );
}

