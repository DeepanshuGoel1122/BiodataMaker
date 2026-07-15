'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, LayoutTemplate, Star } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 selection:bg-slate-200">
      {/* Navbar */}
      <nav className="border-b border-slate-200 bg-white/50 backdrop-blur-md fixed top-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <LayoutTemplate className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">BioData Maker</span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/create" 
              className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-slate-800 transition-all hover:scale-105"
            >
              Create Now
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-sm font-medium mb-6">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              #1 Marriage Biodata Generator
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
              Create a Beautiful <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-600 to-slate-900">
                Biodata in Minutes
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-10 max-w-2xl mx-auto">
              Stand out with premium, beautifully designed marriage biodata templates. Completely customizable, secure, and ready to download instantly.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link 
              href="/create" 
              className="flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-slate-800 transition-all hover:scale-105 shadow-xl shadow-slate-900/20"
            >
              Create My Biodata <ArrowRight className="w-5 h-5" />
            </Link>
            <a 
              href="#templates" 
              className="flex items-center justify-center gap-2 bg-white text-slate-700 px-8 py-4 rounded-full text-lg font-medium hover:bg-slate-50 transition-all hover:scale-105 shadow-sm border border-slate-200"
            >
              View Templates
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="pt-10 flex flex-wrap justify-center gap-8 text-sm font-medium text-slate-500"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" /> No signup required
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" /> Free & Premium Designs
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" /> 100% Secure & Private
            </div>
          </motion.div>
        </div>

        {/* Templates Showcase */}
        <div id="templates" className="mt-40 scroll-mt-24">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Choose Your Design</h2>
            <p className="text-lg text-slate-600">Start with our classic template or upgrade to premium designs.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            {/* Free Template Card */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="group relative bg-white rounded-3xl p-4 shadow-sm border border-slate-200 hover:shadow-xl transition-all"
            >
              <div className="aspect-[3/4] bg-slate-100 rounded-2xl mb-6 overflow-hidden flex items-center justify-center relative">
                {/* Mockup visual */}
                <div className="w-[60%] h-[80%] bg-white shadow-lg p-4 flex flex-col gap-2">
                  <div className="w-full h-4 bg-slate-200 rounded mx-auto mb-4"></div>
                  <div className="w-1/2 h-20 bg-slate-200 mx-auto rounded-full mb-4"></div>
                  <div className="w-full h-2 bg-slate-200 rounded"></div>
                  <div className="w-[80%] h-2 bg-slate-200 rounded"></div>
                  <div className="w-full h-2 bg-slate-200 rounded mt-4"></div>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-slate-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  FREE
                </div>
              </div>
              <div className="px-2 pb-4 text-center">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Classic</h3>
                <p className="text-sm text-slate-500">Minimalist and professional. Perfect for a clean impression.</p>
              </div>
            </motion.div>

            {/* Premium Template Card */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="group relative bg-gradient-to-br from-[#fdfaf6] to-[#f8f0e3] rounded-3xl p-4 shadow-md border-2 border-[#d4af37]/30 hover:shadow-2xl hover:border-[#d4af37] transition-all"
            >
              <div className="aspect-[3/4] bg-white rounded-2xl mb-6 overflow-hidden flex items-center justify-center relative border border-[#d4af37]/20">
                {/* Mockup visual */}
                <div className="w-[60%] h-[80%] bg-[#fdfaf6] border-2 border-[#d4af37] shadow-lg p-4 flex flex-col gap-2 relative">
                  <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-[#d4af37]"></div>
                  <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-[#d4af37]"></div>
                  <div className="w-full h-4 bg-[#8b0000]/20 rounded mx-auto mb-4"></div>
                  <div className="w-1/2 h-24 bg-[#d4af37]/20 mx-auto rounded-t-full mb-4"></div>
                  <div className="w-full h-2 bg-[#4a3f35]/20 rounded"></div>
                  <div className="w-[80%] h-2 bg-[#4a3f35]/20 rounded"></div>
                </div>
                <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-200 to-yellow-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                  PREMIUM <Star className="w-3 h-3 fill-amber-900" />
                </div>
              </div>
              <div className="px-2 pb-4 text-center">
                <h3 className="text-xl font-bold text-[#8b0000] mb-2">Royal</h3>
                <p className="text-sm text-[#4a3f35]">Elegant borders, premium typography, and majestic layout.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 text-center text-slate-500 mt-20">
        <p>&copy; {new Date().getFullYear()} BioData Maker. All rights reserved.</p>
      </footer>
    </div>
  );
}
