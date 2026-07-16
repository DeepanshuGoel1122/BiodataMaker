'use client';

import React, { useEffect, useState } from 'react';
import FormBuilder from '@/components/biodata/FormBuilder';
import TemplatePreview from '@/components/biodata/TemplatePreview';
import { useBiodataStore, TemplateInfo } from '@/store/useBiodataStore';
import { Button, buttonVariants } from '@/components/ui/button';
import { LayoutTemplate, Settings2, Loader2, Crown, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';

import { ErrorBoundary } from 'react-error-boundary';

export default function CreateBiodataPage() {
  const { 
    selectedTemplateId, 
    setSelectedTemplateId, 
    resetForm,
    templatesList,
    setTemplatesList,
    isSinglePage,
    setIsSinglePage
  } = useBiodataStore();

  const [isLoading, setIsLoading] = useState(true);
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);

  // Handle Android back button to close the modal instead of going to homepage
  useEffect(() => {
    const handlePopState = () => {
      if (isMobilePreviewOpen) {
        setIsMobilePreviewOpen(false);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isMobilePreviewOpen]);

  const handleMobilePreviewChange = (open: boolean) => {
    if (open) {
      // Push a dummy state so the back button is caught by popstate
      window.history.pushState(null, '', window.location.href);
    } else {
      // If closed manually via the X button, we should pop the dummy state to keep history clean
      // but only if we are currently holding the dummy state
      setIsMobilePreviewOpen(false);
    }
    setIsMobilePreviewOpen(open);
  };

  const fallbackTemplates: TemplateInfo[] = [
    { id: 'd86b8b0e-3c58-40da-9e45-8bc6dc970364', name: 'Classic', description: '', thumbnail_url: '', is_premium: false },
    { id: 'f1797c36-7c0b-4eb8-b992-cf1fa131f4a9', name: 'Royal', description: '', thumbnail_url: '', is_premium: true },
    { id: 'e28a9d47-8c1b-4fc9-b003-de2f6c8d1f2a', name: 'Elegant', description: '', thumbnail_url: '', is_premium: true },
    { id: 'c39b0e58-9d2c-5fd0-c114-ef3f7d9e2f3b', name: 'Modern', description: '', thumbnail_url: '', is_premium: true },
    { id: '3e62c147-9f7b-410a-8cc8-3162799c8fc4', name: 'Executive', description: '', thumbnail_url: '', is_premium: true },
    { id: '7f2d59ac-bd56-4c4f-9e79-57388916d7a5', name: 'Minimalist', description: '', thumbnail_url: '', is_premium: true }
  ];

  useEffect(() => {
    setHasHydrated(true);
    async function fetchTemplates() {
      try {
        const { data, error } = await supabase
          .from('templates')
          .select('*')
          .order('name');
        
        const merged = fallbackTemplates.map(ft => {
          const dbTemplate = data?.find(t => t.name.toLowerCase() === ft.name.toLowerCase());
          return dbTemplate || ft;
        });
        
        setTemplatesList(merged);
        
        // Auto-migrate selectedTemplateId to a valid DB ID if it's currently a legacy hardcoded one
        const currentId = useBiodataStore.getState().selectedTemplateId;
        if (!merged.find(t => t.id === currentId)) {
          const isClassic = currentId.includes('classic') || currentId === 'd86b8b0e-3c58-40da-9e45-8bc6dc970364';
          const matchedTemplate = merged.find(t => t.name.toLowerCase().includes(isClassic ? 'classic' : 'royal')) || merged[0];
          setSelectedTemplateId(matchedTemplate.id);
        }
      } catch (err) {
        console.error('Failed to fetch templates', err);
        setTemplatesList(fallbackTemplates);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTemplates();
  }, [setTemplatesList]);

  // Use the store's templates list directly now that it's guaranteed to have all templates
  const availableTemplates = templatesList.length > 0 ? templatesList : fallbackTemplates;

  const currentTemplateName = availableTemplates.find(t => t.id === selectedTemplateId)?.name || 'Classic';

  return (
    <ErrorBoundary fallbackRender={({ error }) => <div className="p-8 text-red-500 font-bold text-xl">CLIENT CRASH: {error.message}</div>}>
      <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-2 flex flex-col sm:flex-row sm:items-center justify-between sticky top-0 z-40 gap-2 sm:gap-0 shadow-sm">
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-900 rounded-md flex items-center justify-center">
              <LayoutTemplate className="w-3.5 h-3.5 text-white" />
            </div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight">BioData Maker</h1>
            {hasHydrated && (
              <span className="hidden sm:flex items-center text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full ml-2">
                <CheckCircle2 className="w-2.5 h-2.5 mr-1" /> Autosaved
              </span>
            )}
          </div>
          
          <Button variant="ghost" className="text-slate-500 sm:hidden" onClick={resetForm}>
            Reset
          </Button>
        </div>
        
        <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-2 bg-slate-100/50 px-3 py-1.5 rounded-full border border-slate-200 shrink-0">
            <span className="text-sm font-medium text-slate-600 whitespace-nowrap">Fit to 1 Page</span>
            <Switch checked={isSinglePage} onCheckedChange={setIsSinglePage} />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className={`${buttonVariants({ variant: 'outline' })} min-w-[130px] justify-between shrink-0 h-8 px-3 text-sm`}>
              {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : currentTemplateName}
              <Settings2 className="w-3.5 h-3.5 ml-2 opacity-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {availableTemplates.map((template) => (
                <DropdownMenuItem 
                  key={template.id}
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setSelectedTemplateId(template.id)}
                >
                  <span className={`font-medium ${selectedTemplateId === template.id ? 'text-slate-900' : 'text-slate-600'}`}>
                    {template.name}
                  </span>
                  {template.is_premium ? (
                    <span className="flex items-center text-[10px] uppercase font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-sm">
                      <Crown className="w-3 h-3 mr-1" /> Pro
                    </span>
                  ) : (
                    <span className="text-[10px] uppercase font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-sm">
                      Free
                    </span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="ghost" className="text-slate-500 hidden sm:flex shrink-0" onClick={resetForm}>
            Reset All
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      {hasHydrated ? (
        <main className="flex-1 max-w-[1600px] w-full mx-auto flex flex-col lg:flex-row relative">
          {/* Left Panel: Form (Scrollable with page) */}
          <div className="w-full lg:w-[45%] pb-24 lg:pb-10 min-h-screen">
            <div className="p-2 md:px-4 md:py-2 sticky top-[48px] sm:top-[40px] bg-slate-50/90 backdrop-blur-sm z-10 border-b lg:border-none border-slate-200 flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-slate-500" />
              <h2 className="text-sm font-semibold text-slate-700">Customize Details</h2>
            </div>
            <div className="px-2 md:px-4 mt-2">
              <FormBuilder />
            </div>
          </div>

          {/* Right Panel: Preview (Sticky) */}
          <div className="hidden lg:block w-[55%] p-4 bg-slate-200/50 border-l border-slate-200">
            <div className="sticky top-[64px] h-[calc(100vh-80px)] w-full">
              <TemplatePreview />
            </div>
          </div>
        </main>
      ) : (
        <div className="flex-1 flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
        </div>
      )}
      
      {/* Mobile Preview FAB & Sheet */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <Sheet open={isMobilePreviewOpen} onOpenChange={handleMobilePreviewChange}>
          <SheetTrigger className={`${buttonVariants({ size: 'lg' })} rounded-full shadow-2xl h-14 px-6 bg-slate-900 text-white hover:bg-slate-800`}>
            <LayoutTemplate className="w-5 h-5 mr-2" />
            View Preview
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[90vh] p-0 flex flex-col rounded-t-2xl">
            <SheetHeader className="px-4 py-3 border-b border-slate-200 bg-white">
              <SheetTitle>Preview & Download</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-100">
              <TemplatePreview isPreviewMode={true} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
    </ErrorBoundary>
  );
}
