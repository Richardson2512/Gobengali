"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Header } from "@/components/Header";
import { AIAssistantPanel } from "@/components/AIAssistantPanel";
import { useEditorStore } from "@/store/editorStore";

// Dynamic import to avoid SSR issues with TipTap
const Editor = dynamic(() => import("@/components/Editor").catch((error) => {
  console.error("Failed to load Editor:", error);
  return {
    default: () => (
      <div className="flex items-center justify-center h-[600px] text-center p-8">
        <div>
          <p className="text-red-600 font-semibold mb-2">Failed to load editor</p>
          <p className="text-gray-600 text-sm">Check console for details (Press F12)</p>
          <p className="text-gray-500 text-xs mt-2">{error.message}</p>
        </div>
      </div>
    )
  };
}), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[600px]">
      <div>
        <div className="loader mx-auto"></div>
        <p className="text-gray-500 mt-4">Loading editor...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  const { isPanelOpen } = useEditorStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="relative inline-block group cursor-pointer min-w-[800px]">
            {/* Bengali text - shows by default, hides on hover */}
            <h1 className="text-5xl font-bold text-gray-900 mb-4 bengali-text transition-opacity duration-300 group-hover:opacity-0 group-hover:invisible">
              আপনার বাংলা লেখার সঙ্গী
            </h1>
            {/* English text - hidden by default, shows on hover */}
            <h1 className="absolute inset-0 text-5xl font-bold text-gray-900 mb-4 opacity-0 invisible transition-opacity duration-300 group-hover:opacity-100 group-hover:visible whitespace-nowrap">
              Your Bengali Writing Partner
            </h1>
          </div>
          <p className="text-2xl text-gray-700 mb-6">
            Your AI Writing Partner for <span className="text-green-600 font-semibold">Bengali that Excels</span>
          </p>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto mb-8">
            Get instant, context-aware suggestions for grammar, spelling, and style, 
            so you never have to second-guess your writing again.
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>AI-Powered Translation</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Grammar Correction</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Spelling Checker</span>
            </div>
          </div>
        </div>
      </section>
      
      <main className="container mx-auto px-4 py-6" id="editor-workspace">
        <div className="flex gap-6 items-start">
          {/* Editor Section */}
          <div className={`flex-1 transition-all duration-300 ${isPanelOpen ? 'mr-0' : 'mr-0'}`}>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[800px]">
              <Editor />
            </div>
          </div>

          {/* AI Assistant Panel - Always visible */}
          <div className="w-96" style={{ minHeight: '800px' }}>
            <AIAssistantPanel />
          </div>
        </div>
      </main>

      {/* Grammar Engine Section */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Left: Description */}
            <div>
              <p className="text-green-600 font-semibold mb-3">AI Grammar Engine</p>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Correct Bengali grammar mistakes in seconds</h2>
              <p className="text-lg text-gray-600 mb-8">
                Don't worry about tricky rules. GoBengali's AI instantly detects and fixes the most complex errors, 
                so your writing is always clear and professional.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-green-500 rounded-full p-1 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Verb conjugation errors</h3>
                    <p className="text-gray-600">Catches incorrect verb forms and tense usage</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-500 rounded-full p-1 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Sandhi rule violations</h3>
                    <p className="text-gray-600">Identifies and corrects complex sandhi mistakes</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-500 rounded-full p-1 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Subject-verb agreement</h3>
                    <p className="text-gray-600">Guarantees proper agreement between subjects and verbs</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Demo */}
            <div className="relative">
              <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 mb-4">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Pro
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg mb-4">
                <div className="flex items-center gap-2 mb-4 text-blue-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-gray-900 bengali-text text-lg">
                  বাগানে অনেক রঙিন ফুল <span className="border-b-2 border-dotted border-red-500">ছিল</span>।
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-xl border-2 border-green-500">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-gray-700">Grammar</span>
                </div>
                <p className="text-gray-900 bengali-text text-lg mb-4">
                  বাগানে অনেক রঙিন ফুল <span className="line-through text-red-500">ছিল</span> <span className="text-green-600 font-semibold">ছিলো</span>।
                </p>
                <div className="flex gap-2">
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
                    Apply suggestion
                  </button>
                  <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted by Bengali writers worldwide</h2>
            <p className="text-xl text-gray-600">Join thousands who write with confidence using AI-powered Bengali language intelligence</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Card 1 */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="bg-green-100 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Bengali-First AI</h3>
              <p className="text-gray-600">
                Built from the ground up for Bengali, our AI is trained on the unique nuances of the language.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Beyond Grammar</h3>
              <p className="text-gray-600">
                Correct complex grammar, subtle spelling errors, punctuation, style, and tone.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="bg-orange-100 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Smart Typing</h3>
              <p className="text-gray-600">
                Instantly convert English characters into perfect Bengali script as you type.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="bg-emerald-100 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Access Anywhere</h3>
              <p className="text-gray-600">
                Start on your phone, finish on your laptop. Your work is always saved and in sync.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Spell Check Section */}
      <section className="py-16 bg-gradient-to-br from-yellow-50 to-amber-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Left: Demo */}
            <div className="order-2 md:order-1">
              <div className="bg-white rounded-xl p-6 shadow-lg mb-4">
                <p className="text-gray-900 bengali-text text-lg">
                  আমি তোমাকে <span className="border-b-2 border-dotted border-yellow-500">তিনশত</span> টাকা দিয়েছিলাম।
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-xl border-2 border-yellow-500">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-gray-700">Spelling</span>
                </div>
                <p className="text-gray-900 bengali-text text-lg mb-4">
                  আমি তোমাকে <span className="line-through text-red-500">তিনশত</span> <span className="text-yellow-600 font-semibold bg-yellow-100 px-1">তিনশ</span> টাকা দিয়েছিলাম।
                </p>
                <div className="flex gap-2">
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
                    Apply suggestion
                  </button>
                  <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                    Dismiss
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Description */}
            <div className="order-1 md:order-2">
              <p className="text-yellow-600 font-semibold mb-3">Smart Spell Check</p>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Fix spelling errors with context</h2>
              <p className="text-lg text-gray-600 mb-8">
                Avoid that "oops" moment after you've sent the message. GoBengali catches everything from simple typos to tricky sound-alike words (ন vs. ণ vs. ং).
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-green-500 rounded-full p-1 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Phonetic awareness</h3>
                    <p className="text-gray-600">Confused between similar sounds? We find the right spelling, instantly.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-500 rounded-full p-1 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Understands Your Dialect</h3>
                    <p className="text-gray-600">Trained on Bengali from across the globe, our AI recognizes regional spelling variations.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-500 rounded-full p-1 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Fixes with Context</h3>
                    <p className="text-gray-600">We don't just suggest a random word. We give you the right correction based on your sentence's meaning.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learn as You Write Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Left: Description */}
            <div>
              <p className="text-green-600 font-semibold mb-3">Learn as you write</p>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Learn the "why" behind the fix</h2>
              <p className="text-lg text-gray-600 mb-8">
                Every correction comes with an explanation of why your original text was wrong. Learn Bengali grammar naturally as you write.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-green-500 rounded-full p-1 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Simple "aha!" moments</h3>
                    <p className="text-gray-600">Get simple clarifications that make even the trickiest rules finally click.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-500 rounded-full p-1 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Clear grammar guides</h3>
                    <p className="text-gray-600">We explain everything from verb forms to sandhi rules.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-500 rounded-full p-1 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Progressive learning</h3>
                    <p className="text-gray-600">Absorb the patterns of perfect Bengali just by writing, and watch your own skills grow over time.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Demo */}
            <div>
              <div className="bg-white rounded-xl p-6 shadow-xl border border-gray-200">
                <div className="flex items-center gap-2 mb-6 text-red-600">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  <span className="text-sm font-semibold">Grammar</span>
                </div>
                
                <div className="mb-6">
                  <p className="text-xs text-gray-500 mb-2 font-semibold">Original:</p>
                  <div className="border-l-4 border-red-200 bg-red-50 pl-4 py-3 rounded-r">
                    <p className="text-gray-900 bengali-text">
                      আমরা মঞ্চে পৌঁছানোর পরে, অনুষ্ঠান <span className="bg-red-200">শুরু হয়েছিল</span>।
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-xs text-gray-500 mb-2 font-semibold">Suggested:</p>
                  <div className="border-l-4 border-green-500 bg-green-50 pl-4 py-3 rounded-r">
                    <p className="text-gray-900 bengali-text">
                      আমরা মঞ্চে পৌঁছানোর পরে, অনুষ্ঠান <span className="bg-green-200">শুরু হয়ে গিয়েছিল</span>।
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-xs text-gray-500 mb-2 font-semibold">Reason:</p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    The original verb 'শুরু হয়েছিল' implies the event started at the moment of arrival, while the suggested 'শুরু হয়ে গিয়েছিল' (past perfect tense) correctly indicates that the event had already started prior to their arrival.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
                    Accept
                  </button>
                  <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                    Ignore
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Style Suggestions Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Left: Demo */}
            <div className="order-2 md:order-1">
              <div className="bg-white rounded-xl p-6 shadow-lg mb-4">
                <p className="text-gray-900 bengali-text text-lg">
                  পাখিরা সকালে <span className="border-b-2 border-dotted border-blue-500">ঈশ্বর</span> খুঁজতে যায় এটি প্রকৃতির নিয়ম।
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-xl border-2 border-blue-500">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-gray-700">Clarity</span>
                </div>
                <p className="text-gray-900 bengali-text text-lg mb-4">
                  পাখিরা সকালে <span className="line-through text-red-500">ঈশ্বর</span> <span className="text-blue-600 font-semibold bg-blue-100 px-1">খাবার</span> খুঁজতে যায় এটি প্রকৃতির নিয়ম।
                </p>
                <div className="flex gap-2">
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
                    Apply suggestion
                  </button>
                  <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                    Dismiss
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Description */}
            <div className="order-1 md:order-2">
              <p className="text-blue-600 font-semibold mb-3">Style Suggestions</p>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Write in a way that truly connects</h2>
              <p className="text-lg text-gray-600 mb-8">
                Beyond grammar and spelling, GoBengali helps you choose the right tone and style for your audience. 
                From formal business communication to casual social posts.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-500 rounded-full p-1 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Formal vs informal tone</h3>
                    <p className="text-gray-600">Suggests appropriate formality level for context</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-500 rounded-full p-1 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Cultural sensitivity</h3>
                    <p className="text-gray-600">Ensures respectful and culturally appropriate language</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-500 rounded-full p-1 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Clarity improvements</h3>
                    <p className="text-gray-600">Suggests clearer, more concise expressions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything you need to know</h2>
            <p className="text-xl text-gray-600">Common questions about GoBengali's AI-powered Bengali writing assistant</p>
          </div>

          <div className="space-y-4">
            <FAQItem
              question="What exactly is GoBengali Pro?"
              answer="GoBengali Pro is your personal AI writing expert. It not only corrects grammar and spelling but also helps you refine your style, find the perfect tone, and rewrite sentences for better impact. It's for anyone who wants their Bengali writing to be clear, confident, and professional."
            />
            <FAQItem
              question="Can I try Pro features before I buy?"
              answer="Yes! We offer a free trial so you can test all Pro features before making a purchase decision. No credit card required."
            />
            <FAQItem
              question="What's included in the free version?"
              answer="The free version includes basic grammar and spelling check, limited translation, and up to 500 words per day. Upgrade to Pro for advanced features and unlimited usage."
            />
            <FAQItem
              question="Can I use GoBengali for professional work?"
              answer="Absolutely! GoBengali is ideal for business communications, academic writing, creative content, and more. Many professionals use it to ensure the quality of their Bengali writing."
            />
            <FAQItem
              question="How accurate is GoBengali's Bengali spelling checker?"
              answer="Our AI is trained on thousands of Bengali texts and achieves over 95% accuracy. It can catch everything from simple typos to complex contextual errors, and we're constantly improving it."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Improve Your Bengali Writing Today</h2>
          <p className="text-xl text-green-100 mb-8">Join thousands of Bengali writers who trust GoBengali</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button className="bg-white text-green-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-50 transition-colors shadow-lg">
              Start Free
            </button>
            <button className="bg-green-700 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-800 transition-colors border-2 border-white">
              View Pro
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-4">GoBengali</h3>
              <p className="text-gray-600 text-sm">Empowering Bengali Writers</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-green-600">Features</a></li>
                <li><a href="#" className="hover:text-green-600">Pricing</a></li>
                <li><a href="#" className="hover:text-green-600">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-green-600">Documentation</a></li>
                <li><a href="#" className="hover:text-green-600">Guides</a></li>
                <li><a href="#" className="hover:text-green-600">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-green-600">About</a></li>
                <li><a href="#" className="hover:text-green-600">Blog</a></li>
                <li><a href="#" className="hover:text-green-600">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center text-gray-600">
            <p className="mb-2">© 2025 GoBengali. All rights reserved.</p>
            <p className="text-sm">Built with ❤️ for the Bengali community</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// FAQ Item Component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:border-green-300 transition-colors">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-900">{question}</span>
        <svg
          className={`w-5 h-5 text-green-600 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-gray-700">{answer}</p>
        </div>
      )}
    </div>
  );
}

