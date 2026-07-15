import React from 'react';
import { useBiodataStore } from '@/store/useBiodataStore';

export default function ElegantPremiumTemplate() {
  const { sections, imageUrl } = useBiodataStore();

  return (
    <div className="w-full h-full p-10 font-serif text-[var(--theme-text)] shadow-xl relative overflow-hidden" style={{ width: '210mm', minHeight: '297mm', margin: '0 auto', backgroundColor: 'var(--theme-bg)' }}>
      {/* Semi-transparent overlays for subtle watercolor effect */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] opacity-20 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: 'var(--theme-primary)' }}></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] opacity-10 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: 'var(--theme-accent)' }}></div>
      
      {/* Thin elegant border around the page */}
      <div className="border-[1.5px] border-dashed border-[var(--theme-primary)] p-8 h-[calc(100%-2rem)] relative z-10 bg-white/60 backdrop-blur-sm rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        
        {/* Header Section */}
        <div className="flex flex-col items-center mb-10 pb-6 relative">
          {/* Gold Gradient Line */}
          <div className="absolute bottom-0 w-3/4 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, var(--theme-primary), transparent)' }}></div>
          
          <svg className="w-12 h-12 mb-4 text-[var(--theme-primary)] opacity-90 drop-shadow-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L15 8L22 9L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9L9 8L12 2Z" fill="currentColor" fillOpacity="0.2"/>
            <circle cx="12" cy="12" r="3" fill="var(--theme-accent)"/>
          </svg>
          <h1 className="text-5xl font-bold uppercase tracking-[0.25em] text-[var(--theme-primary)] mb-3" style={{ textShadow: '1px 1px 0px rgba(255,255,255,1), 2px 2px 4px rgba(0,0,0,0.1)' }}>
            Biodata
          </h1>
          <p className="text-sm font-medium tracking-widest text-[var(--theme-accent)] uppercase">|| Shree Ganeshay Namah ||</p>
        </div>

        <div className="flex flex-col md:flex-row print:flex-row gap-10">
          <div className="flex-1 space-y-10">
            {sections.map(section => {
              const filledFields = section.fields.filter(f => f.value);
              if (filledFields.length === 0) return null;
              
              // Decorative Initial
              const firstLetter = section.title.charAt(0).toUpperCase();
              const restOfTitle = section.title.slice(1);
              
              return (
                <div key={section.id} className="space-y-4 print-avoid-break bg-[var(--theme-secondary)]/40 p-6 rounded-xl border border-[var(--theme-border)] shadow-sm relative overflow-hidden group">
                  {/* Elegant decorative side line */}
                  <div className="absolute left-0 top-0 w-[3px] h-full" style={{ background: 'linear-gradient(to bottom, var(--theme-primary), var(--theme-accent))' }}></div>
                  
                  <h2 className="text-xl font-bold uppercase tracking-widest text-[var(--theme-accent)] mb-5 flex items-center gap-2">
                    <span className="text-3xl font-serif text-[var(--theme-primary)] opacity-80 leading-none">{firstLetter}</span>
                    <span className="mt-1">{restOfTitle}</span>
                  </h2>
                  <div className="space-y-3 pl-2">
                    {filledFields.map(field => (
                      <div key={field.id} className="flex text-sm items-start">
                        <span className="w-44 font-semibold text-[var(--theme-text)]">{field.label}</span>
                        <span className="px-2 text-[var(--theme-primary)] font-bold">:</span>
                        <span className="flex-1 text-[var(--theme-text-light)] leading-relaxed">{field.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {imageUrl && (
            <div className="w-[200px] shrink-0 text-center break-inside-avoid print-avoid-break pt-2">
              <div className="p-[3px] rounded-full shadow-[0_10px_25px_rgba(0,0,0,0.1)]" style={{ background: 'linear-gradient(135deg, var(--theme-primary), var(--theme-accent))' }}>
                <img src={imageUrl} alt="Profile" className="w-[194px] h-[194px] object-cover aspect-square rounded-full border-[6px] border-white" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
