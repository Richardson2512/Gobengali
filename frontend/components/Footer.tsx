import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="GoBengali Logo" className="h-8 w-auto" />
              <span className="text-xl font-bold text-gray-900">GoBengali</span>
            </Link>
            <p className="text-gray-600 text-sm">Empowering Bengali Writers with AI-powered tools</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/features" className="hover:text-green-600">Features</Link></li>
              <li><a href="#" className="hover:text-green-600">Pricing</a></li>
              <li><a href="#" className="hover:text-green-600">API</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/documentation" className="hover:text-green-600">Documentation</Link></li>
              <li><Link href="/guides" className="hover:text-green-600">Guides</Link></li>
              <li><Link href="/support" className="hover:text-green-600">Support</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/about" className="hover:text-green-600">About</Link></li>
              <li><Link href="/blog" className="hover:text-green-600">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-green-600">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-8 text-center text-gray-600">
          <p className="mb-2">© 2025 GoBengali. All rights reserved.</p>
          <p className="text-sm">Built with ❤️ for the Bengali community</p>
        </div>
      </div>
    </footer>
  );
}

