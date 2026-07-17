import React from 'react';
import { useBiodataStore, BiodataField } from '@/store/useBiodataStore';

export default function ClassicFreeTemplate() {
  const { sections, imageUrl } = useBiodataStore();

  return (
    <div className="w-full bg-[var(--theme-bg)] p-8 font-serif text-[var(--theme-text)] border border-[var(--theme-border)]" style={{ width: '210mm', minHeight: '297mm', margin: '0 auto' }}>
      <div className="text-center mb-8 border-b-2 border-[var(--theme-primary)] pb-6">
        <h1 className="text-4xl font-bold uppercase tracking-widest text-[var(--theme-primary)] mb-2">Biodata</h1>
        <p className="text-sm italic text-[var(--theme-text-light)]">Om Shree Ganeshaya Namah</p>
      </div>

      <div className="flex flex-col md:flex-row print:flex-row gap-8">
        <div className="flex-1 space-y-8">
          {sections.map(section => {
            const filledFields = section.fields.filter(f => f.value);
            if (filledFields.length === 0) return null;
            
            return (
              <div key={section.id} className="space-y-3 print-avoid-break">
                <h2 className="text-xl font-bold uppercase tracking-wider text-[var(--theme-accent)] border-b border-[var(--theme-border)] pb-1 mb-3">
                  {section.title}
                </h2>
                <div className="space-y-2">
                  {filledFields.map(field => (
                    <div key={field.id} className="flex text-sm">
                      <span className="w-40 font-semibold text-[var(--theme-text)]">{field.label}</span>
                      <span className="px-2 text-[var(--theme-primary)]">:</span>
                      <span className="flex-1 text-[var(--theme-text)]">{field.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {imageUrl && (
          <div className="w-[180px] shrink-0 text-center break-inside-avoid print-avoid-break">
            <img src={imageUrl} alt="Profile" className="w-[180px] h-[180px] object-cover aspect-square rounded-full border-4 border-[var(--theme-primary)] mx-auto shadow-md" />
          </div>
        )}
      </div>
    </div>
  );
}
