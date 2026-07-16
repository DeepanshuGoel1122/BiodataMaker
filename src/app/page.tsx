'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, LayoutTemplate, Star, ChevronRight, ChevronLeft } from 'lucide-react';
import { useBiodataStore } from '@/store/useBiodataStore';

export default function LandingPage() {
  const router = useRouter();
  const setSelectedTemplateId = useBiodataStore(state => state.setSelectedTemplateId);

  const homeTemplates = [
    { id: 'd86b8b0e-3c58-40da-9e45-8bc6dc970364', name: 'Classic', desc: 'Minimalist and professional. Perfect for a clean impression.', premium: false, bg: 'bg-white', border: 'border-slate-200', text: 'text-slate-900', p_text: 'text-slate-500' },
    { id: 'f1797c36-7c0b-4eb8-b992-cf1fa131f4a9', name: 'Royal', desc: 'Elegant borders, premium typography, and majestic layout.', premium: true, bg: 'bg-gradient-to-br from-[#fdfaf6] to-[#f8f0e3]', border: 'border-[#d4af37]/30', text: 'text-[#8b0000]', p_text: 'text-[#4a3f35]' },
    { id: 'e28a9d47-8c1b-4fc9-b003-de2f6c8d1f2a', name: 'Elegant', desc: 'Soft watercolor effects and beautiful elegant typography.', premium: true, bg: 'bg-gradient-to-br from-indigo-50 to-purple-50', border: 'border-indigo-100', text: 'text-indigo-900', p_text: 'text-indigo-600' },
    { id: 'c39b0e58-9d2c-5fd0-c114-ef3f7d9e2f3b', name: 'Modern', desc: 'Bold, geometric patterns and highly modern contrast.', premium: true, bg: 'bg-slate-900', border: 'border-slate-800', text: 'text-white', p_text: 'text-slate-300' },
    { id: '3e62c147-9f7b-410a-8cc8-3162799c8fc4', name: 'Executive', desc: 'Sleek corporate style layout with dual columns.', premium: true, bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-800', p_text: 'text-slate-500' },
    { id: '7f2d59ac-bd56-4c4f-9e79-57388916d7a5', name: 'Minimalist', desc: 'Highly sophisticated, whitespace-heavy editorial aesthetic.', premium: true, bg: 'bg-white', border: 'border-slate-100', text: 'text-slate-900', p_text: 'text-slate-400' }
  ];

  const handleSelectTemplate = (id: string) => {
    setSelectedTemplateId(id);
    router.push('/create');
  };

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
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="animate-in fade-in duration-500"
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
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 animate-in fade-in duration-500 delay-200 fill-mode-both"
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
            initial={{ y: 0 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="pt-10 flex flex-wrap justify-center gap-8 text-sm font-medium text-slate-500 animate-in fade-in duration-700 delay-500 fill-mode-both"
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
        <div id="templates" className="mt-40 scroll-mt-24 w-full overflow-hidden">
          <div className="max-w-2xl mx-auto text-center space-y-4 mb-10 px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Choose Your Design</h2>
            <p className="text-lg text-slate-600">Start with our classic template or upgrade to our highly designed premium layouts.</p>
          </div>

          <div className="relative w-full max-w-[1600px] mx-auto px-6">
            <div className="flex overflow-x-auto gap-6 pb-12 pt-4 snap-x snap-mandatory hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {homeTemplates.map((template) => (
                <motion.div 
                  key={template.id}
                  whileHover={{ y: -10 }}
                  onClick={() => handleSelectTemplate(template.id)}
                  className={`snap-start shrink-0 w-[65vw] sm:w-[280px] md:w-[320px] group relative ${template.bg} rounded-3xl p-4 shadow-sm border ${template.border} hover:shadow-xl transition-all cursor-pointer`}
                >
                  <div className="aspect-[3/4] bg-white/50 backdrop-blur-sm rounded-2xl mb-6 overflow-hidden flex items-center justify-center relative border border-black/5">
                    {/* Abstract Mockup visual based on template style */}
                    <div className="w-[70%] h-[80%] bg-white shadow-lg p-4 flex flex-col gap-2 relative border border-slate-100 overflow-hidden">
                      {template.name === 'Royal' && (
                         <div className="absolute inset-1 border border-amber-200/50"></div>
                      )}
                      {template.name === 'Modern' && (
                         <div className="absolute top-0 left-0 w-full h-1/3 bg-slate-900"></div>
                      )}
                      {template.name === 'Executive' && (
                         <div className="absolute top-0 left-0 w-1/3 h-full bg-slate-100"></div>
                      )}
                      
                      <div className={`w-full h-4 ${template.name === 'Modern' ? 'bg-white/20' : 'bg-slate-200'} rounded mx-auto mb-4 relative z-10`}></div>
                      <div className={`w-1/2 h-16 ${template.name === 'Modern' ? 'bg-white/20' : 'bg-slate-200'} mx-auto ${template.name === 'Royal' ? 'rounded-t-full' : 'rounded-full'} mb-4 relative z-10`}></div>
                      <div className="w-full h-2 bg-slate-200/80 rounded relative z-10"></div>
                      <div className="w-[80%] h-2 bg-slate-200/80 rounded relative z-10"></div>
                      <div className="w-full h-2 bg-slate-200/80 rounded mt-4 relative z-10"></div>
                    </div>

                    {template.premium ? (
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-200 to-yellow-400 text-amber-900 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                        PREMIUM <Star className="w-2.5 h-2.5 fill-amber-900" />
                      </div>
                    ) : (
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                        FREE
                      </div>
                    )}
                  </div>
                  <div className="px-2 pb-2 text-center">
                    <h3 className={`text-xl font-bold ${template.text} mb-2`}>{template.name}</h3>
                    <p className={`text-sm ${template.p_text}`}>{template.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Scroll hint gradient */}
            <div className="absolute top-0 right-0 bottom-0 w-24 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none"></div>
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
