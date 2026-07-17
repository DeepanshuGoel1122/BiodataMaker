import React from 'react';
import { useBiodataStore } from '@/store/useBiodataStore';
import { Heart } from 'lucide-react';

export default function RoyalPremiumTemplate() {
  const { sections, imageUrl } = useBiodataStore();

  return (
    <div className="w-full bg-[var(--theme-bg)] p-8 font-serif text-[var(--theme-text)] relative" style={{ width: '210mm', minHeight: '297mm', margin: '0 auto' }}>
      {/* Decorative border */}
      <div className="absolute inset-4 border-2 border-[var(--theme-primary)] pointer-events-none"></div>
      <div className="absolute inset-5 border border-[var(--theme-accent)] pointer-events-none opacity-50"></div>
      
      {/* Header */}
      <div className="text-center mb-10 pb-6 relative">
        <div className="absolute bottom-0 w-full flex justify-center">
          <div className="h-0.5 w-48 bg-[var(--theme-primary)] relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rotate-45 bg-[var(--theme-primary)]"></div>
          </div>
        </div>
        <h1 className="text-5xl font-bold uppercase tracking-[0.2em] text-[var(--theme-primary)] mb-3" style={{ textShadow: '1px 1px 2px rgba(212,175,55,0.2)' }}>
          Biodata
        </h1>
        <p className="text-sm italic text-[var(--theme-text-light)] font-medium">|| Shree Ganeshay Namah ||</p>
      </div>

      <div className="flex flex-col md:flex-row print:flex-row gap-8 relative z-10">
        {imageUrl && (
          <div className="w-[190px] shrink-0 text-center break-inside-avoid print-avoid-break">
            <div className="p-2 border-2 border-[var(--theme-primary)] bg-[var(--theme-secondary)]">
              <img src={imageUrl} alt="Profile" className="w-[170px] h-[170px] object-cover aspect-square mx-auto" />
            </div>
          </div>
        )}

        <div className="flex-1 space-y-6">
          {sections.map(section => {
            const filledFields = section.fields.filter(f => f.value);
            if (filledFields.length === 0) return null;
            
            return (
              <div key={section.id} className="space-y-4 print-avoid-break bg-[var(--theme-secondary)]/50 p-4 border border-[var(--theme-border)]">
                <h2 className="text-xl font-bold uppercase tracking-wider text-[var(--theme-accent)] flex items-center gap-3">
                  <span className="w-2 h-2 rotate-45 bg-[var(--theme-primary)]"></span>
                  {section.title}
                  <span className="flex-1 h-px bg-gradient-to-r from-[var(--theme-primary)]/50 to-transparent"></span>
                </h2>
                <div className="space-y-2">
                  {filledFields.map(field => (
                    <div key={field.id} className="flex text-sm">
                      <span className="w-44 font-semibold text-[var(--theme-text)]">{field.label}</span>
                      <span className="px-2 text-[var(--theme-primary)]">:</span>
                      <span className="flex-1 text-[var(--theme-text-light)]">{field.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Background overlay graphic */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
        <Heart className="w-[600px] h-[600px]" />
      </div>
    </div>
  );
}
