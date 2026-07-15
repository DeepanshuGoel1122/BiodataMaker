import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export type FieldType = 'text' | 'date' | 'time' | 'dropdown' | 'textarea' | 'email' | 'tel';

export interface BiodataField {
  id: string;
  label: string;
  value: string;
  required: boolean;
  type: FieldType;
  options?: string[]; // For dropdowns
  hidden?: boolean; // Hidden in preview
}

export interface TemplateInfo {
  id: string;
  name: string;
  description: string;
  thumbnail_url: string;
  is_premium: boolean;
}

export interface BiodataSection {
  id: string;
  title: string;
  fields: BiodataField[];
}

interface BiodataState {
  sections: BiodataSection[];
  imageUrl: string | null;
  selectedTemplateId: string;
  templatesList: TemplateInfo[];
  isSinglePage: boolean;
  
  // Payment Recovery
  paidFingerprints: string[];
  addPaidFingerprint: (fingerprint: string) => void;
  
  // Theming
  themeColor: string;
  setThemeColor: (color: string) => void;

  setImageUrl: (url: string | null) => void;
  setSections: (sections: BiodataSection[]) => void;
  setSelectedTemplateId: (id: string) => void;
  setTemplatesList: (templates: TemplateInfo[]) => void;
  setIsSinglePage: (val: boolean) => void;
  addSection: (title: string) => void;
  removeSection: (sectionId: string) => void;
  updateSectionTitle: (sectionId: string, title: string) => void;
  addField: (sectionId: string, field: Omit<BiodataField, 'id'>) => void;
  removeField: (sectionId: string, fieldId: string) => void;
  updateFieldLabel: (sectionId: string, fieldId: string, label: string) => void;
  updateFieldValue: (sectionId: string, fieldId: string, value: string) => void;
  moveField: (sectionId: string, dragIndex: number, hoverIndex: number) => void;
  resetForm: () => void;
}

const initialSections: BiodataSection[] = [
  {
    id: 'personal',
    title: 'Personal Details',
    fields: [
      { id: 'p1', label: 'Name', value: '', required: true, type: 'text' },
      { id: 'p2', label: 'Date of Birth', value: '', required: true, type: 'date' },
      { id: 'p3', label: 'Place of Birth', value: '', required: true, type: 'text' },
      { id: 'p4', label: 'Time of Birth', value: '', required: false, type: 'time' },
      { id: 'p5', label: 'Rashi', value: '', required: false, type: 'dropdown', options: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'] },
      { id: 'p6', label: 'Nakshatra', value: '', required: false, type: 'dropdown', options: ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashīrsha', 'Ardra', 'Punarvasu', 'Pushya', 'Āshleshā', 'Maghā', 'Pūrva Phalgunī', 'Uttara Phalgunī', 'Hasta', 'Chitra', 'Svātī', 'Vishākhā', 'Anurādhā', 'Jyeshtha', 'Mūla', 'Pūrva Ashādhā', 'Uttara Ashādhā', 'Shravana', 'Dhanishta', 'Shatabhishak', 'Pūrva Bhādrapadā', 'Uttara Bhādrapadā', 'Revatī'] },
      { id: 'p7', label: 'Complexion', value: '', required: false, type: 'dropdown', options: ['Fair', 'Wheatish', 'Dark'] },
      { id: 'p8', label: 'Height', value: '', required: false, type: 'text' },
      { id: 'p9', label: 'Gotra', value: '', required: false, type: 'text' },
      { id: 'p10', label: 'Occupation', value: '', required: false, type: 'text' },
    ],
  },
  {
    id: 'family',
    title: 'Family Details',
    fields: [
      { id: 'f1', label: "Father's Name", value: '', required: false, type: 'text' },
      { id: 'f2', label: "Father's Occupation", value: '', required: false, type: 'text' },
      { id: 'f3', label: "Mother's Name", value: '', required: false, type: 'text' },
      { id: 'f4', label: "Mother's Occupation", value: '', required: false, type: 'text' },
      { id: 'f5', label: 'Siblings', value: '', required: false, type: 'textarea' },
    ],
  },
  {
    id: 'contact',
    title: 'Contact Details',
    fields: [
      { id: 'c1', label: 'Contact Person', value: '', required: false, type: 'text' },
      { id: 'c2', label: 'Phone Number', value: '', required: false, type: 'tel' },
      { id: 'c3', label: 'Email', value: '', required: false, type: 'email' },
      { id: 'c4', label: 'Address', value: '', required: false, type: 'textarea' },
    ],
  }
];

export const useBiodataStore = create<BiodataState>()(
  persist(
    (set) => ({
      sections: JSON.parse(JSON.stringify(initialSections)),
      imageUrl: null,
      selectedTemplateId: 'd86b8b0e-3c58-40da-9e45-8bc6dc970364', // default template (Classic)
      templatesList: [],
      isSinglePage: true,
      paidFingerprints: [],
      
      addPaidFingerprint: (fingerprint) => set((state) => ({
        paidFingerprints: [...state.paidFingerprints, fingerprint]
      })),

      themeColor: 'gold',
      setThemeColor: (color) => set({ themeColor: color }),

      setImageUrl: (url) => set({ imageUrl: url }),
      setSections: (sections) => set({ sections }),
      setSelectedTemplateId: (id) => set({ selectedTemplateId: id }),
      setTemplatesList: (templates) => set({ templatesList: templates }),
      setIsSinglePage: (val) => set({ isSinglePage: val }),
      
      addSection: (title) => set((state) => ({
        sections: [...state.sections, { id: uuidv4(), title, fields: [] }]
      })),
      
      removeSection: (sectionId) => set((state) => ({
        sections: state.sections.filter(s => s.id !== sectionId)
      })),
      
      updateSectionTitle: (sectionId, title) => set((state) => ({
        sections: state.sections.map(section => 
          section.id === sectionId ? { ...section, title } : section
        )
      })),
      
      addField: (sectionId, field) => set((state) => ({
        sections: state.sections.map(section => 
          section.id === sectionId 
            ? { ...section, fields: [...section.fields, { ...field, id: uuidv4() }] }
            : section
        )
      })),
      
      removeField: (sectionId, fieldId) => set((state) => ({
        sections: state.sections.map(section =>
          section.id === sectionId
            ? { ...section, fields: section.fields.filter(f => f.id !== fieldId) }
            : section
        )
      })),
      
      updateFieldLabel: (sectionId, fieldId, label) => set((state) => ({
        sections: state.sections.map(section =>
          section.id === sectionId
            ? {
                ...section,
                fields: section.fields.map(f => f.id === fieldId ? { ...f, label } : f)
              }
            : section
        )
      })),

      updateFieldValue: (sectionId, fieldId, value) => set((state) => ({
        sections: state.sections.map(section =>
          section.id === sectionId
            ? {
                ...section,
                fields: section.fields.map(f => f.id === fieldId ? { ...f, value } : f)
              }
            : section
        )
      })),
      
      moveField: (sectionId, dragIndex, hoverIndex) => set((state) => {
        return {
          sections: state.sections.map(section => {
            if (section.id !== sectionId) return section;
            const newFields = [...section.fields];
            const draggedItem = newFields[dragIndex];
            newFields.splice(dragIndex, 1);
            newFields.splice(hoverIndex, 0, draggedItem);
            return { ...section, fields: newFields };
          })
        };
      }),
      
      resetForm: () => set({ 
        sections: JSON.parse(JSON.stringify(initialSections)),
        imageUrl: null,
        selectedTemplateId: 'd86b8b0e-3c58-40da-9e45-8bc6dc970364'
      })
    }),
    {
      name: 'biodata-storage', // name of the item in the storage
      storage: createJSONStorage(() => localStorage),
      // Partialize to only persist user data and paid fingerprints, not the fetched templates list
      partialize: (state) => ({ 
        sections: state.sections, 
        imageUrl: state.imageUrl, 
        selectedTemplateId: 
          (state.selectedTemplateId === 'classic-free' || state.selectedTemplateId === 'royal-premium') 
            ? (state.selectedTemplateId === 'classic-free' ? 'd86b8b0e-3c58-40da-9e45-8bc6dc970364' : 'f1797c36-7c0b-4eb8-b992-cf1fa131f4a9')
            : state.selectedTemplateId,
        isSinglePage: state.isSinglePage,
        paidFingerprints: state.paidFingerprints,
        themeColor: state.themeColor
      }),
    }
  )
);
