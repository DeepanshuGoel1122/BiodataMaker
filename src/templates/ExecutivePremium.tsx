import React from 'react';
import { useBiodataStore } from '@/store/useBiodataStore';

export default function ExecutivePremiumTemplate() {
  const { sections, imageUrl } = useBiodataStore();

  return (
    <div className="w-full h-full flex font-sans text-[var(--theme-text)] bg-white" style={{ width: '210mm', minHeight: '297mm', margin: '0 auto' }}>
      
      {/* Left Sidebar */}
      <div className="w-[35%] h-full shrink-0 flex flex-col p-8 relative z-10" style={{ backgroundColor: 'var(--theme-primary)' }}>
        
        {/* Subtle geometric pattern overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        
        {/* Profile Photo */}
        {imageUrl && (
          <div className="w-full mb-8 flex justify-center relative z-20">
            <div className="p-1.5 bg-white/20 backdrop-blur-sm rounded-lg w-full max-w-[170px] aspect-square">
              <img src={imageUrl} alt="Profile" className="w-full h-full object-cover rounded-md" />
            </div>
          </div>
        )}

        {/* Decorative Badge */}
        <div className="mt-auto mb-8 self-center relative z-20 opacity-80">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-[65%] h-full flex flex-col px-8 py-8 relative bg-[var(--theme-bg)]">
        
        {/* Header Content */}
        <div className="mb-8 border-b-2 pb-4" style={{ borderColor: 'var(--theme-primary)' }}>
          <h1 className="text-5xl font-black uppercase tracking-widest mb-3 text-slate-900" style={{ color: 'var(--theme-primary)' }}>
            Biodata
          </h1>
          <p className="text-sm font-bold tracking-[0.2em] uppercase text-[var(--theme-accent)]">|| Shree Ganeshay Namah ||</p>
        </div>

        {/* Dynamic Sections */}
        <div className="flex-1 space-y-6 print-avoid-break">
          {sections.map(section => {
            const filledFields = section.fields.filter(f => f.value);
            if (filledFields.length === 0) return null;
            
            return (
              <div key={section.id} className="space-y-3 print-avoid-break relative group">
                
                <h2 className="text-lg font-bold uppercase tracking-widest text-slate-800 flex items-center gap-4 bg-[var(--theme-secondary)]/30 px-4 py-2 rounded-md border-l-4" style={{ borderColor: 'var(--theme-primary)' }}>
                  <span className="text-[var(--theme-primary)]">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                    </svg>
                  </span>
                  {section.title}
                </h2>
                
                <div className="grid grid-cols-1 gap-y-2 pl-4">
                  {filledFields.map(field => (
                    <div key={field.id} className="flex flex-col sm:flex-row text-sm border-b border-dashed border-[var(--theme-border)] pb-2 last:border-0 last:pb-0">
                      <span className="w-44 font-bold text-[var(--theme-text)] uppercase text-xs tracking-wider pt-0.5">{field.label}</span>
                      <span className="hidden sm:inline-block px-2 text-[var(--theme-primary)]">:</span>
                      <span className="flex-1 text-[var(--theme-text)] font-medium leading-relaxed">
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
