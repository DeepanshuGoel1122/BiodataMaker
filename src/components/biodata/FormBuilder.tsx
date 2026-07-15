'use client';

import React, { useRef, useState } from 'react';
import { useBiodataStore, FieldType } from '@/store/useBiodataStore';
import { THEMES, ThemeColor } from '@/lib/themes';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowDown, ArrowUp, Pencil, Trash, Plus, Upload, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

export default function FormBuilder() {
  const { 
    sections, 
    updateFieldValue, 
    updateFieldLabel, 
    updateSectionTitle,
    moveField, 
    removeField, 
    addField,
    addSection,
    removeSection,
    imageUrl,
    setImageUrl,
    themeColor,
    setThemeColor
  } = useBiodataStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal states for adding fields
  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
  const [targetSectionId, setTargetSectionId] = useState<string | null>(null);
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState<FieldType>('text');

  // Modal state for adding section
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddField = () => {
    if (newFieldLabel.trim() && targetSectionId) {
      addField(targetSectionId, { 
        label: newFieldLabel.trim(), 
        value: '', 
        required: false, 
        type: newFieldType 
      });
      setIsFieldModalOpen(false);
      setNewFieldLabel('');
      setNewFieldType('text');
    }
  };

  const handleAddSection = () => {
    if (newSectionTitle.trim()) {
      addSection(newSectionTitle.trim());
      setIsSectionModalOpen(false);
      setNewSectionTitle('');
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-6 space-y-6 md:space-y-8">
      {/* Image Upload Section */}
      <div className="bg-white p-3 md:p-4 rounded-2xl shadow-sm border border-slate-100 space-y-3">
        <h2 className="text-base font-semibold text-slate-800">Profile Photo</h2>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-[3px] border-slate-50 bg-slate-100 flex items-center justify-center shrink-0">
            {imageUrl ? (
              <img src={imageUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="w-8 h-8 text-slate-400" />
            )}
          </div>
          <div className="space-y-2 text-center sm:text-left w-full sm:w-auto">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
            />
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="w-full sm:w-auto h-8 text-xs">
              <Upload className="w-3 h-3 mr-2" />
              Upload Image
            </Button>
            {imageUrl && (
              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 block mt-1 mx-auto sm:mx-0 h-8 text-xs" onClick={() => setImageUrl(null)}>
                Remove Image
              </Button>
            )}
            <p className="text-[10px] text-slate-500 pt-1">Square image works best. Max size 2MB.</p>
          </div>
        </div>
      </div>

      {/* Theme Selection Section */}
      <div className="bg-white p-3 md:p-4 rounded-2xl shadow-sm border border-slate-100 space-y-3">
        <h2 className="text-base font-semibold text-slate-800">Color Theme</h2>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {(Object.entries(THEMES) as [ThemeColor, typeof THEMES[ThemeColor]][]).map(([key, theme]) => (
            <button
              key={key}
              onClick={() => setThemeColor(key)}
              title={key.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                themeColor === key ? 'border-slate-900 scale-110 shadow-md' : 'border-transparent hover:scale-105'
              }`}
            >
              <div 
                className="w-6 h-6 rounded-full border border-black/10" 
                style={{ backgroundColor: theme.primary }} 
              />
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Sections */}
      {sections.map((section) => (
        <div key={section.id} className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4 md:space-y-6 relative group/section">
          <div className="flex items-center gap-2 border-b pb-2 relative">
            <Input 
              value={section.title}
              onChange={(e) => updateSectionTitle(section.id, e.target.value)}
              className="text-lg md:text-xl font-semibold text-slate-800 bg-transparent border-transparent hover:border-slate-200 focus-visible:ring-slate-200 px-2 py-1 h-10 -ml-2 w-full md:w-3/4"
            />
            <Pencil className="w-4 h-4 absolute right-2 top-3 text-slate-300 opacity-0 group-hover/section:opacity-100 pointer-events-none transition-opacity hidden md:block" />
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-0 top-1 text-red-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover/section:opacity-100 transition-opacity"
              onClick={() => removeSection(section.id)}
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-3 md:space-y-4">
            <AnimatePresence>
              {section.fields.map((field, index) => (
                <motion.div 
                  key={field.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center group/field p-2 -mx-2 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-1 w-full space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 relative">
                        <Input 
                          value={field.label}
                          onChange={(e) => updateFieldLabel(section.id, field.id, e.target.value)}
                          className="font-medium text-slate-700 bg-transparent border-transparent hover:border-slate-200 focus-visible:ring-slate-200 px-1 py-1 h-8 text-sm"
                        />
                        <Pencil className="w-3 h-3 absolute right-2 top-2.5 text-slate-300 opacity-0 group-hover/field:opacity-100 pointer-events-none transition-opacity hidden sm:block" />
                      </div>
                      {field.required && <span className="text-red-500 text-xs font-bold">*</span>}
                    </div>

                    {field.type === 'textarea' ? (
                      <Textarea 
                        value={field.value}
                        onChange={(e) => updateFieldValue(section.id, field.id, e.target.value)}
                        placeholder={`Enter ${field.label}`}
                        className="resize-none"
                        rows={2}
                      />
                    ) : field.type === 'dropdown' && field.options ? (
                      <Select value={field.value} onValueChange={(val) => updateFieldValue(section.id, field.id, val || '')}>
                        <SelectTrigger>
                          <SelectValue placeholder={`Select ${field.label}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options.map(opt => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input 
                        type={field.type}
                        value={field.value}
                        onChange={(e) => updateFieldValue(section.id, field.id, e.target.value)}
                        placeholder={`Enter ${field.label}`}
                      />
                    )}
                  </div>
                  
                  <div className="flex flex-row sm:flex-col justify-end gap-1 sm:opacity-0 group-hover/field:opacity-100 transition-opacity w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      disabled={index === 0}
                      onClick={() => moveField(section.id, index, index - 1)}
                    >
                      <ArrowUp className="w-4 h-4 sm:w-3 sm:h-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      disabled={index === section.fields.length - 1}
                      onClick={() => moveField(section.id, index, index + 1)}
                    >
                      <ArrowDown className="w-4 h-4 sm:w-3 sm:h-3" />
                    </Button>
                    {!field.required && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => removeField(section.id, field.id)}
                      >
                        <Trash className="w-4 h-4 sm:w-3 sm:h-3" />
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-4 border-dashed bg-slate-50 hover:bg-slate-100"
            onClick={() => {
              setTargetSectionId(section.id);
              setIsFieldModalOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" /> Add Field
          </Button>
        </div>
      ))}

      <Button 
        variant="default" 
        className="w-full h-12 shadow-md hover:shadow-lg transition-shadow"
        onClick={() => setIsSectionModalOpen(true)}
      >
        <Plus className="w-5 h-5 mr-2" /> Add New Section
      </Button>

      {/* Add Field Modal */}
      <Dialog open={isFieldModalOpen} onOpenChange={setIsFieldModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Custom Field</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Field Label</label>
              <Input 
                placeholder="e.g. Hobby, Salary, Education" 
                value={newFieldLabel} 
                onChange={(e) => setNewFieldLabel(e.target.value)} 
                autoFocus
                onKeyDown={(e) => { if(e.key === 'Enter') handleAddField() }}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Field Type</label>
              <Select value={newFieldType} onValueChange={(val: FieldType) => setNewFieldType(val)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text Input</SelectItem>
                  <SelectItem value="textarea">Text Area (Multi-line)</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="time">Time</SelectItem>
                  <SelectItem value="tel">Phone</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFieldModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddField} disabled={!newFieldLabel.trim()}>Add Field</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Section Modal */}
      <Dialog open={isSectionModalOpen} onOpenChange={setIsSectionModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Section</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Section Title</label>
              <Input 
                placeholder="e.g. Education, Astrological Details" 
                value={newSectionTitle} 
                onChange={(e) => setNewSectionTitle(e.target.value)} 
                autoFocus
                onKeyDown={(e) => { if(e.key === 'Enter') handleAddSection() }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSectionModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddSection} disabled={!newSectionTitle.trim()}>Add Section</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
