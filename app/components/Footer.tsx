"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Github, Twitter, Linkedin, Mail, Heart } from "lucide-react";
import TeamSection from "./TeamSection";

export default function Footer() {
  const footerLinks = {
    product: [
      { name: "Features", href: "#" },
      { name: "API Documentation", href: "#" },
      { name: "Pricing", href: "#" },
      { name: "Changelog", href: "#" },
    ],
    company: [
      { name: "About Us", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Contact", href: "#" },
    ],
    legal: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Cookie Policy", href: "#" },
      { name: "Imprint", href: "#" },
    ],
  };

  return (
    <footer className="bg-white border-t border-gray-200 mt-20 bottom-0">
      <div className="container mx-auto px-6 py-16">
        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">BlockGPT</span>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              AI-powered blockchain analysis for comprehensive wallet insights
              and transaction patterns.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-8 h-8 bg-gray-100 hover:bg-purple-100 rounded-lg flex items-center justify-center transition-colors"
              >
                <Github className="w-4 h-4 text-gray-600 hover:text-purple-600" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-gray-100 hover:bg-purple-100 rounded-lg flex items-center justify-center transition-colors"
              >
                <Twitter className="w-4 h-4 text-gray-600 hover:text-purple-600" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-gray-100 hover:bg-purple-100 rounded-lg flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-4 h-4 text-gray-600 hover:text-purple-600" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-gray-100 hover:bg-purple-100 rounded-lg flex items-center justify-center transition-colors"
              >
                <Mail className="w-4 h-4 text-gray-600 hover:text-purple-600" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-600 hover:text-purple-600 text-sm transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-600 hover:text-purple-600 text-sm transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-600 hover:text-purple-600 text-sm transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>© 2024 BlockGPT. Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>by our amazing team.</span>
            </div>
            <div className="text-sm text-gray-500">
              Version 1.0.0 • Last updated: May 2025
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
