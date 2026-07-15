'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutTemplate, Lock, RefreshCw, Crown, IndianRupee, FileText } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';

interface TemplateData {
  id: string;
  name: string;
  is_premium: boolean;
}

interface PaymentData {
  id: string;
  template_id: string;
  amount: number;
  created_at: string;
  fingerprint: string;
}

interface BiodataData {
  id: string;
  template_id: string;
  status: string;
  created_at: string;
  fingerprint: string;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [stats, setStats] = useState({ paymentsAmount: 0, biodatasCount: 0 });
  const [templates, setTemplates] = useState<TemplateData[]>([]);
  const [recentPayments, setRecentPayments] = useState<PaymentData[]>([]);
  const [recentBiodatas, setRecentBiodatas] = useState<BiodataData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check persisted auth on mount
  useEffect(() => {
    const savedPassword = sessionStorage.getItem('adminPassword');
    if (savedPassword) {
      setPassword(savedPassword);
      setIsAuthenticated(true);
      loadData(savedPassword);
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/data', {
        headers: {
          'Authorization': `Bearer ${password}`
        }
      });

      if (!response.ok) {
        setError('Invalid password');
        setIsLoading(false);
        return;
      }

      const result = await response.json();
      setIsAuthenticated(true);
      sessionStorage.setItem('adminPassword', password);
      
      setTemplates(result.templates);
      setRecentPayments(result.recentPayments);
      setRecentBiodatas(result.recentBiodatas);
      setStats(result.stats);
    } catch (err) {
      setError('Connection error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminPassword');
    setPassword('');
    setIsAuthenticated(false);
  };

  const loadData = async (currentPassword = password) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/data', {
        headers: {
          'Authorization': `Bearer ${currentPassword}`
        }
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch data');
      }

      setTemplates(result.templates);
      setRecentPayments(result.recentPayments);
      setRecentBiodatas(result.recentBiodatas);
      setStats(result.stats);
      
    } catch (err: any) {
      console.error(err);
      if (err.message.includes('Unauthorized') || err.message.includes('credentials')) {
        handleLogout();
      } else {
        alert(`Dashboard Error: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTemplatePremium = async (templateId: string, currentStatus: boolean) => {
    try {
      // Optimistic update
      setTemplates(templates.map(t => t.id === templateId ? { ...t, is_premium: !currentStatus } : t));
      
      const response = await fetch('/api/admin/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${password}`
        },
        body: JSON.stringify({
          templateId,
          is_premium: !currentStatus
        })
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || result.details || 'Failed to update template');
      }

    } catch (err: any) {
      console.error('Error toggling template', err);
      // Revert optimistic update
      setTemplates(templates.map(t => t.id === templateId ? { ...t, is_premium: currentStatus } : t));
      alert(`Failed to update template status: ${err?.message || 'Unknown error'}`);
    }
  };

  const getTemplateName = (id: string) => {
    return templates.find(t => t.id === id)?.name || id;
  };

  if (isLoading && !isAuthenticated) return null; // Avoid flicker

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-slate-200">
          <CardHeader className="text-center space-y-2">
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>
              <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800">
                Secure Login
              </Button>
            </form>
            <div className="mt-6 text-center">
              <Link href="/" className="text-sm text-slate-500 hover:text-slate-900">
                &larr; Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8 pb-20">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-200 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
              <p className="text-slate-500 text-sm">Manage templates and view generated biodatas & payments.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => loadData()} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Revenue</CardTitle>
              <IndianRupee className="w-4 h-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-slate-900">₹{stats.paymentsAmount}</div>
              <p className="text-sm text-emerald-600 font-medium mt-1">From {recentPayments.length} premium downloads</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Biodatas Generated</CardTitle>
              <FileText className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-slate-900">{stats.biodatasCount}</div>
              <p className="text-sm text-slate-500 mt-1">Downloads tracked across all templates</p>
            </CardContent>
          </Card>
        </div>

        {/* Templates Management */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Manage Templates</CardTitle>
          </CardHeader>
          <CardContent>
            {templates.length === 0 && !isLoading ? (
              <p className="text-slate-500 text-sm">No templates found.</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {templates.map(template => (
                  <div key={template.id} className="flex items-center justify-between p-4 border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white shadow-sm border border-slate-100 rounded flex items-center justify-center">
                        <LayoutTemplate className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">{template.name}</h3>
                        <p className="text-xs text-slate-400 font-mono">{template.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {template.is_premium ? (
                        <span className="flex items-center text-[10px] uppercase font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded-sm">
                          <Crown className="w-3 h-3 mr-1" /> Pro
                        </span>
                      ) : (
                        <span className="text-[10px] uppercase font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-sm">
                          Free
                        </span>
                      )}
                      <Switch 
                        checked={template.is_premium} 
                        onCheckedChange={() => toggleTemplatePremium(template.id, template.is_premium)} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Data Tables Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Payments Table */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">Recent Payments</CardTitle>
            </CardHeader>
            <CardContent>
              {recentPayments.length === 0 ? (
                <p className="text-sm text-slate-500 py-4">No payments recorded yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 rounded-tl-lg">Date</th>
                        <th className="px-4 py-3">Template</th>
                        <th className="px-4 py-3 rounded-tr-lg text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentPayments.map((payment) => (
                        <tr key={payment.id} className="border-b border-slate-100 last:border-0">
                          <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                            {new Date(payment.created_at).toLocaleDateString()} {new Date(payment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-900">
                            {getTemplateName(payment.template_id)}
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-emerald-600">
                            ₹{payment.amount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Biodatas Table */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">Recent Biodatas Generated</CardTitle>
            </CardHeader>
            <CardContent>
              {recentBiodatas.length === 0 ? (
                <p className="text-sm text-slate-500 py-4">No biodatas generated yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 rounded-tl-lg">Date</th>
                        <th className="px-4 py-3">Template</th>
                        <th className="px-4 py-3 rounded-tr-lg">Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBiodatas.map((biodata) => (
                        <tr key={biodata.id} className="border-b border-slate-100 last:border-0">
                          <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                            {new Date(biodata.created_at).toLocaleDateString()} {new Date(biodata.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-900">
                            {getTemplateName(biodata.template_id)}
                          </td>
                          <td className="px-4 py-3">
                            {biodata.status === 'premium' ? (
                              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold uppercase">Premium</span>
                            ) : (
                              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold uppercase">Free</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
