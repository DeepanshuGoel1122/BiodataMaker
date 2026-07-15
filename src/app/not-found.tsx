import React from 'react';
import Link from 'next/link';
import { LayoutTemplate, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md w-full space-y-6">
        
        {/* Icon & Logo */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl rotate-3">
            <LayoutTemplate className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* 404 Content */}
        <div className="space-y-2">
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter">404</h1>
          <h2 className="text-2xl font-bold text-slate-800">Page not found</h2>
          <p className="text-slate-500 text-lg">
            Oops! The page you are looking for does not exist or has been moved.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <Link href="/">
            <Button size="lg" className="rounded-full shadow-lg h-12 px-8 bg-slate-900 text-white hover:bg-slate-800 hover:scale-105 transition-all">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Homepage
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
