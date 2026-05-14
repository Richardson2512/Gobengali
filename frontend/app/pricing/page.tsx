"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle, Zap, Shield, Headphones, Code } from "lucide-react";
import { Footer } from "@/components/Footer";

const FREE_FEATURES = [
  "500 words per day",
  "Basic grammar checking",
  "Spelling correction",
  "Live transliteration",
  "English ↔ Bengali translation",
  "Export to TXT",
];

const PRO_FEATURES = [
  "Unlimited words per day",
  "Advanced AI grammar checking",
  "Priority spelling correction",
  "Live transliteration",
  "English ↔ Bengali translation",
  "Export to TXT & DOCX",
  "API access",
  "Priority support",
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  prefill?: { email?: string; name?: string };
  theme?: { color?: string };
  handler: (response: RazorpayPaymentResponse) => void;
  modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
  open(): void;
}

interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

function getUserEmail(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("user_email") || "";
}

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const monthlyPrice = 9;
  const annualPrice = Math.round(monthlyPrice * 12 * 0.8);
  const displayMonthly = annual ? Math.round((annualPrice / 12) * 10) / 10 : monthlyPrice;

  const handleGetPro = useCallback(async () => {
    setError(null);

    const token = getAuthToken();
    if (!token) {
      router.push("/?login=1");
      return;
    }

    setPaying(true);

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setError("Failed to load payment gateway. Please try again.");
        return;
      }

      const orderRes = await fetch(`${API_URL}/payments/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan: annual ? "annual" : "monthly" }),
      });

      if (!orderRes.ok) {
        const data = await orderRes.json().catch(() => ({}));
        setError(data.detail || "Failed to create order. Please try again.");
        return;
      }

      const order = await orderRes.json();

      const rzp = new window.Razorpay({
        key: order.key_id || RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.order_id,
        name: "GoBengali",
        description: annual ? "Pro Annual Plan" : "Pro Monthly Plan",
        prefill: { email: getUserEmail() },
        theme: { color: "#16a34a" },
        handler: async (response: RazorpayPaymentResponse) => {
          try {
            const verifyRes = await fetch(`${API_URL}/payments/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (verifyRes.ok) {
              router.push("/?upgraded=1");
            } else {
              setError("Payment received but verification failed. Contact support.");
            }
          } catch {
            setError("Verification error. Contact support with your payment ID.");
          } finally {
            setPaying(false);
          }
        },
        modal: {
          ondismiss: () => setPaying(false),
        },
      });

      rzp.open();
    } catch {
      setError("Something went wrong. Please try again.");
      setPaying(false);
    }
  }, [annual, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
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

      <section className="py-20 text-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent <span className="text-green-600">Pricing</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10">
            Start free. Upgrade when you need more.
          </p>

          <div className="inline-flex items-center gap-3 bg-gray-100 p-1 rounded-full mb-12">
            <button
              onClick={() => setAnnual(false)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                !annual ? "bg-white shadow text-gray-900" : "text-gray-500"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                annual ? "bg-white shadow text-gray-900" : "text-gray-500"
              }`}
            >
              Annual
              <span className="ml-2 bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>

          {error && (
            <div className="mb-6 max-w-md mx-auto bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200 text-left">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Free</h2>
              <p className="text-gray-500 mb-6">Perfect for casual writers</p>
              <div className="mb-8">
                <span className="text-5xl font-bold text-gray-900">$0</span>
                <span className="text-gray-500 ml-2">/ month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-gray-700">
                    <CheckCircle size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/"
                className="block w-full text-center bg-gray-100 text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors"
              >
                Get Started Free
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-gradient-to-b from-green-600 to-emerald-600 rounded-2xl shadow-xl p-8 border-2 border-green-500 text-left relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-4 py-1 rounded-full">
                MOST POPULAR
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Pro</h2>
              <p className="text-green-100 mb-6">For serious Bengali writers</p>
              <div className="mb-8">
                <span className="text-5xl font-bold text-white">${displayMonthly}</span>
                <span className="text-green-100 ml-2">/ month</span>
                {annual && (
                  <p className="text-green-200 text-sm mt-1">
                    Billed ${annualPrice}/year
                  </p>
                )}
              </div>
              <ul className="space-y-3 mb-8">
                {PRO_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-white">
                    <CheckCircle size={18} className="text-green-200 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={handleGetPro}
                disabled={paying}
                className="block w-full text-center bg-white text-green-600 px-6 py-3 rounded-lg font-bold hover:bg-green-50 transition-colors shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {paying ? "Processing..." : "Get Pro"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Everything in Pro
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap size={28} className="text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Unlimited Usage</h3>
              <p className="text-gray-600 text-sm">No daily word limits. Write as much as you need.</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Code size={28} className="text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">API Access</h3>
              <p className="text-gray-600 text-sm">Integrate GoBengali into your own apps and workflows.</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Headphones size={28} className="text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Priority Support</h3>
              <p className="text-gray-600 text-sm">Get help within hours, not days.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <Shield size={40} className="text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">30-day money-back guarantee</h2>
          <p className="text-gray-600">
            Not satisfied? Contact us within 30 days of your Pro subscription and we'll refund you in full, no questions asked.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
