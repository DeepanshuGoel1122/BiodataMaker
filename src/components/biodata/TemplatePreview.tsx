'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useBiodataStore } from '@/store/useBiodataStore';
import { THEMES, ThemeColor } from '@/lib/themes';
import ClassicFreeTemplate from '@/templates/ClassicFree';
import RoyalPremiumTemplate from '@/templates/RoyalPremium';
import ElegantPremiumTemplate from '@/templates/ElegantPremium';
import ModernPremiumTemplate from '@/templates/ModernPremium';
import ExecutivePremiumTemplate from '@/templates/ExecutivePremium';
import MinimalistPremiumTemplate from '@/templates/MinimalistPremium';
import { Button } from '@/components/ui/button';
import { Download, ShieldCheck, Loader2, AlertCircle, XCircle } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import jsPDF from 'jspdf';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

// We map by name (lowercase) to component so that database IDs can be fully dynamic
const templateComponents: Record<string, any> = {
  'classic': ClassicFreeTemplate,
  'royal': RoyalPremiumTemplate,
  'elegant': ElegantPremiumTemplate,
  'modern': ModernPremiumTemplate,
  'executive': ExecutivePremiumTemplate,
  'minimalist': MinimalistPremiumTemplate
};

interface TemplatePreviewProps {
  isPreviewMode?: boolean;
}

// Simple browser-compatible hash function for the fingerprint
function generateHash(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

export default function TemplatePreview({ isPreviewMode = true }: TemplatePreviewProps) {
  const { 
    selectedTemplateId, 
    isSinglePage, 
    sections,
    imageUrl,
    paidFingerprints,
    addPaidFingerprint,
    templatesList,
    themeColor
  } = useBiodataStore();
  
  const [isPaying, setIsPaying] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [previewScale, setPreviewScale] = useState(0.65);
  const printRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const padding = width < 768 ? 32 : 64;
      const availableWidth = width - padding;
      
      if (width < 768) {
        setPreviewScale(availableWidth / 794);
      } else {
        setPreviewScale(Math.min(0.65, availableWidth / 794));
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const currentTemplate = templatesList.find(t => t.id === selectedTemplateId);
  const normalizedName = currentTemplate?.name?.toLowerCase().replace(' free', '').replace(' premium', '') || 'classic';
  const SelectedTemplate = templateComponents[normalizedName] || ClassicFreeTemplate;

  // Generate fingerprint of current state
  const getCurrentFingerprint = () => {
    const dataString = JSON.stringify({
      template: selectedTemplateId,
      image: imageUrl,
      sections: sections.map(s => ({
        title: s.title,
        fields: s.fields.map(f => ({ label: f.label, value: f.value }))
      }))
    });
    return generateHash(dataString);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePrint = async () => {
    if (!printRef.current) return;
    
    // We show a loading state on the button while generating
    setIsPaying(true);
    
    try {
      const element = printRef.current;
      
      const imgData = await htmlToImage.toJpeg(element, {
        quality: 0.95,
        backgroundColor: '#ffffff',
        pixelRatio: 2
      });
      
      // We need to measure the actual DOM element since we don't have a canvas object directly
      const elWidth = element.offsetWidth;
      const elHeight = element.offsetHeight;
      
      // A4 dimensions in mm: 210 x 297
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (elHeight * pdfWidth) / elWidth;
      
      let finalHeight = pdfHeight;
      let finalWidth = pdfWidth;
      
      // If the content is somehow taller than an A4 page, scale it down to fit on ONE page!
      if (pdfHeight > 297) {
        const ratio = 297 / pdfHeight;
        finalHeight = 297;
        finalWidth = pdfWidth * ratio;
      }
      
      const xOffset = (pdfWidth - finalWidth) / 2;
      
      pdf.addImage(imgData, 'JPEG', xOffset, 0, finalWidth, finalHeight);
      pdf.save(`Biodata_${normalizedName}.pdf`);
      
    } catch (err) {
      console.error('PDF Generation Error:', err);
      setPaymentError('Failed to generate PDF. Please try again.');
    } finally {
      setIsPaying(false);
    }
  };

  const executeDownload = async (paymentStatus: 'free' | 'premium', fingerprint: string) => {
    setIsPaying(true);
    // Log the download to the database securely via API
    try {
      await fetch('/api/biodatas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          templateId: selectedTemplateId,
          status: paymentStatus,
          fingerprint: fingerprint
        })
      });
    } catch (err) {
      console.error('Failed to log biodata generation', err);
    }
    
    // Generate the PDF
    handlePrint();
  };

  const handleInitialDownloadClick = () => {
    // Determine if template is premium by checking the store templatesList
    const currentTemplate = templatesList.find(t => t.id === selectedTemplateId);
    const isPremium = currentTemplate ? currentTemplate.is_premium : false;

    if (!isPremium) {
      const fp = getCurrentFingerprint();
      executeDownload('free', fp);
      return;
    }

    const currentFp = getCurrentFingerprint();
    if (paidFingerprints.includes(currentFp)) {
      // User has already paid for this exact configuration
      executeDownload('premium', currentFp);
      return;
    }

    // Otherwise, show confirmation dialog before payment
    setShowConfirmDialog(true);
  };

  const proceedToPayment = async () => {
    setShowConfirmDialog(false);
    setIsPaying(true);
    
    const res = await loadRazorpayScript();
    if (!res) {
      setPaymentError('Razorpay SDK failed to load. Are you online?');
      setIsPaying(false);
      return;
    }

    try {
      const orderRes = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 4900 }) // 49 INR
      });
      const orderData = await orderRes.json();
      
      if (!orderData.order) {
        console.error('Order creation failed:', orderData);
        throw new Error(orderData.details || orderData.error || 'Failed to create order');
      }

      const currentFp = getCurrentFingerprint();

      // Bypass for testing
      if (orderData.order.id.startsWith('order_dummy_')) {
        console.log('Dummy order detected. Bypassing Razorpay UI.');
        setPaymentError(null);
        const verifyRes = await fetch('/api/razorpay/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: orderData.order.id,
            razorpay_payment_id: 'pay_dummy_' + Math.floor(Math.random()*10000),
            razorpay_signature: 'dummy_sig',
            templateId: selectedTemplateId,
            fingerprint: currentFp,
            amount: 49
          })
        });
        const verifyData = await verifyRes.json();
        
        if (verifyData.success) {
          addPaidFingerprint(currentFp);
          executeDownload('premium', currentFp);
        } else {
          setPaymentError('Payment verification failed');
        }
        setIsPaying(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_dummy',
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'BioData Maker',
        description: 'Premium Template Unlock',
        order_id: orderData.order.id,
        handler: async function (response: any) {
          setPaymentError(null);
          const verifyRes = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              templateId: selectedTemplateId,
              fingerprint: currentFp,
              amount: 49
            })
          });
          const verifyData = await verifyRes.json();
          
          if (verifyData.success) {
            addPaidFingerprint(currentFp);
            executeDownload('premium', currentFp);
          } else {
            setPaymentError('Payment verification failed');
          }
        },
        prefill: {
          name: 'User',
          email: 'user@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#0f172a'
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on('payment.failed', function (response: any) {
        setPaymentError(response.error.description || 'Payment processing failed. Please try again.');
        setIsPaying(false);
      });
      paymentObject.open();
    } catch (error: any) {
      console.error(error);
      setPaymentError(error?.message || 'Error starting payment');
    } finally {
      setIsPaying(false);
    }
  };

  const isPremium = currentTemplate ? currentTemplate.is_premium : false;
  const currentFp = getCurrentFingerprint();
  const isAlreadyPaid = paidFingerprints.includes(currentFp);

  return (
    <div className="flex flex-col h-full bg-slate-100 rounded-2xl overflow-hidden shadow-inner relative">
      <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
          <ShieldCheck className="w-4 h-4 text-green-600" />
          Preview Mode
        </div>
        
        <Button onClick={handleInitialDownloadClick} disabled={isPaying} className="bg-slate-900 hover:bg-slate-800 text-white shadow-md cursor-pointer">
          {isPaying ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
          {isPremium && !isAlreadyPaid ? 'Pay ₹49 & Download' : 'Download PDF'}
        </Button>
      </div>
      
      <div 
        className="flex-1 overflow-auto p-2 md:p-8 flex justify-center items-start"
        style={{ userSelect: 'none' }}
        onContextMenu={(e) => e.preventDefault()}
      >
        <div 
          className="shrink-0 relative"
          style={{ 
            width: `${794 * previewScale}px`,
            height: `${1123 * previewScale}px`,
          }}
        >
          <div 
            className="absolute top-0 left-0 shadow-2xl transition-all duration-300 origin-top-left bg-white w-[794px] min-h-[1123px]"
            style={{ 
              transform: `scale(${previewScale})`,
            } as React.CSSProperties}
          >
            <div 
              ref={printRef} 
              className={`w-[794px] min-h-[1123px] bg-[var(--theme-bg)] ${isSinglePage ? 'single-page-mode' : ''}`}
            style={{
              '--theme-primary': THEMES[themeColor as ThemeColor]?.primary || THEMES.gold.primary,
              '--theme-secondary': THEMES[themeColor as ThemeColor]?.secondary || THEMES.gold.secondary,
              '--theme-accent': THEMES[themeColor as ThemeColor]?.accent || THEMES.gold.accent,
              '--theme-bg': THEMES[themeColor as ThemeColor]?.background || THEMES.gold.background,
              '--theme-text': THEMES[themeColor as ThemeColor]?.text || THEMES.gold.text,
              '--theme-text-light': THEMES[themeColor as ThemeColor]?.textLight || THEMES.gold.textLight,
              '--theme-border': THEMES[themeColor as ThemeColor]?.border || THEMES.gold.border,
            } as React.CSSProperties}
          >
            <SelectedTemplate />
          </div>

          {isPreviewMode && (
            <div className="absolute inset-0 z-50 pointer-events-none flex flex-col items-center justify-center overflow-hidden mix-blend-multiply opacity-20">
              {Array.from({ length: 15 }).map((_, i) => (
                <div 
                  key={i} 
                  className="text-7xl font-bold uppercase tracking-widest text-slate-900 whitespace-nowrap"
                  style={{ 
                    transform: 'rotate(-45deg) scale(1.5)',
                    marginBottom: '100px'
                  }}
                >
                  PREVIEW VERSION - WATERMARK
                </div>
              ))}
            </div>
          )}
          </div>
        </div>
      </div>

      <Dialog open={!!paymentError} onOpenChange={(open) => { if (!open) setPaymentError(null); }}>
        <DialogContent className="sm:max-w-md bg-white border-0 shadow-2xl">
          <div className="p-2 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Payment Failed</h3>
            <p className="text-slate-600 mb-6 text-sm leading-relaxed">{paymentError}</p>
            <Button
              onClick={() => setPaymentError(null)}
              className="w-full bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors shadow-md h-11"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-600">
              <AlertCircle className="w-5 h-5" />
              Confirm Your Details
            </DialogTitle>
            <DialogDescription className="pt-2 text-slate-700">
              Please verify that all information in your biodata is correct (spelling, layout, template choice). 
              <br /><br />
              <strong>Important:</strong> After payment, you can re-download this exact PDF multiple times for free. However, if you modify ANY form details or change the template, you will need to pay again for the new version.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex gap-2">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Go Back & Edit
            </Button>
            <Button onClick={proceedToPayment} className="bg-slate-900 text-white hover:bg-slate-800">
              Yes, Details are Correct
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
