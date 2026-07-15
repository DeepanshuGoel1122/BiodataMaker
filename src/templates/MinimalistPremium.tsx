import React from 'react';
import { useBiodataStore } from '@/store/useBiodataStore';

export default function MinimalistPremiumTemplate() {
  const { sections, imageUrl } = useBiodataStore();

  return (
    <div className="w-full h-full font-serif text-[var(--theme-text)] shadow-xl relative overflow-hidden bg-[var(--theme-bg)]" style={{ width: '210mm', minHeight: '297mm', margin: '0 auto' }}>
      
      {/* Absolute top minimal border */}
      <div className="absolute top-0 left-0 w-full h-3 bg-[var(--theme-primary)]"></div>

      <div className="p-16 flex flex-col h-full">
        {/* Header Content */}
        <div className="flex flex-col items-center mb-16 text-center">
          {imageUrl && (
            <div className="mb-8 relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-accent)] rounded-full blur opacity-20"></div>
              <img src={imageUrl} alt="Profile" className="w-[180px] h-[180px] object-cover aspect-square rounded-full relative z-10 border border-[var(--theme-border)] shadow-sm grayscale hover:grayscale-0 transition-all duration-700" />
            </div>
          )}
          
          <h1 className="text-4xl font-light tracking-[0.3em] uppercase text-slate-800 mb-4" style={{ letterSpacing: '0.4em' }}>
            Biodata
          </h1>
          <div className="w-12 h-px bg-[var(--theme-primary)] mb-4"></div>
          <p className="text-xs font-sans tracking-[0.2em] uppercase text-[var(--theme-text-light)]">Shree Ganeshay Namah</p>
        </div>

        {/* Dynamic Sections */}
        <div className="flex-1 max-w-3xl mx-auto w-full space-y-12 print-avoid-break">
          {sections.map(section => {
            const filledFields = section.fields.filter(f => f.value);
            if (filledFields.length === 0) return null;
            
            return (
              <div key={section.id} className="space-y-6 print-avoid-break relative group">
                <div className="flex items-center gap-4">
                  <h2 className="text-sm font-sans font-bold uppercase tracking-[0.2em] text-[var(--theme-primary)] whitespace-nowrap">
                    {section.title}
                  </h2>
                  <div className="flex-1 h-px bg-[var(--theme-border)]/50"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 px-2">
                  {filledFields.map(field => (
                    <div key={field.id} className="flex flex-col text-sm group/field">
                      <span className="font-sans text-[9px] uppercase tracking-widest text-[var(--theme-text-light)] mb-1">{field.label}</span>
                      <span className="font-serif text-[15px] text-[var(--theme-text)] font-medium">
                        {field.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
