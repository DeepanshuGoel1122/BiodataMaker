import React from 'react';
import { useBiodataStore } from '@/store/useBiodataStore';

export default function ModernPremiumTemplate() {
  const { sections, imageUrl } = useBiodataStore();

  return (
    <div className="w-full h-full p-0 font-sans text-[var(--theme-text)] relative bg-white" style={{ width: '210mm', minHeight: '297mm', margin: '0 auto' }}>
      {/* Bold Geometric Header Background */}
      <div className="absolute top-0 left-0 w-full h-48" style={{ background: 'linear-gradient(135deg, var(--theme-primary), var(--theme-accent))' }}>
        {/* Abstract shapes */}
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 800 300" preserveAspectRatio="none">
          <polygon points="0,300 800,0 800,300" fill="#ffffff" />
          <polygon points="0,0 400,0 0,300" fill="#000000" />
        </svg>
      </div>
      
      {/* Main Content Container - overlapping the header */}
      <div className="relative z-10 px-8 pt-8 pb-8 h-full flex flex-col">
        
        {/* Header Content */}
        <div className="flex flex-row items-end gap-6 mb-8">
          {imageUrl && (
            <div className="w-[160px] shrink-0 text-center break-inside-avoid print-avoid-break">
              <div className="p-1.5 bg-white rounded-2xl transform -rotate-3">
                <img src={imageUrl} alt="Profile" className="w-[150px] h-[150px] object-cover aspect-square rounded-xl" />
              </div>
            </div>
          )}
          
          <div className="flex-1 text-left text-white mt-0">
            <h1 className="text-6xl font-black uppercase tracking-tight mb-2 drop-shadow-md">
              Biodata
            </h1>
            <div className="h-1 w-24 bg-white/50 rounded-full mb-3 mx-0"></div>
            <p className="text-sm font-semibold tracking-[0.2em] uppercase opacity-90">|| Shree Ganeshay Namah ||</p>
          </div>
        </div>

        {/* Dynamic Sections Grid */}
        <div className="flex-1 grid grid-cols-1 gap-x-10 gap-y-6 print-avoid-break" style={{ gridAutoRows: 'min-content' }}>
          {sections.map((section, index) => {
            const filledFields = section.fields.filter(f => f.value);
            if (filledFields.length === 0) return null;
            
            return (
              <div key={section.id} className="space-y-3 print-avoid-break relative group pl-6">
                {/* Modern vertical accent line */}
                <div className="absolute left-0 top-1 w-1.5 h-[calc(100%-8px)] rounded-full" style={{ backgroundColor: 'var(--theme-primary)' }}></div>
                
                <h2 className="text-xl font-bold uppercase tracking-wider text-[var(--theme-accent)] mb-4 pb-2 border-b-2 border-[var(--theme-border)]/60">
                  {section.title}
                </h2>
                
                <div className="space-y-3">
                  {filledFields.map(field => (
                    <div key={field.id} className="flex text-sm items-baseline">
                      <span className="w-48 font-bold text-[var(--theme-text)] opacity-80 uppercase text-xs tracking-wider">{field.label}</span>
                      <span className="flex-1 text-[var(--theme-text)] font-medium bg-[var(--theme-secondary)]/50 px-3 py-1.5 rounded-md border border-[var(--theme-border)]/30">
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
