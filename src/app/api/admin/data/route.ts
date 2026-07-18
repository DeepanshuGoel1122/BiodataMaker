import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(request: Request) {
  try {
    // 1. Verify Admin Password
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json({ error: 'Server misconfiguration: Admin password missing' }, { status: 500 });
    }
    
    if (token !== adminPassword) {
      return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
    }

    // Ensure service key is configured
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Server misconfiguration: Service role key missing' }, { status: 500 });
    }

    // 2. Fetch templates
    let { data: templateData } = await supabaseAdmin.from('templates').select('*').order('name');
    
    const initialTemplates = [
      { id: 'd86b8b0e-3c58-40da-9e45-8bc6dc970364', name: 'Classic', description: 'Clean and minimal free template', thumbnail_url: '', is_premium: false },
      { id: 'f1797c36-7c0b-4eb8-b992-cf1fa131f4a9', name: 'Royal', description: 'Elegant premium template with golden accents', thumbnail_url: '', is_premium: true },
      { id: 'e28a9d47-8c1b-4fc9-b003-de2f6c8d1f2a', name: 'Elegant', description: 'Premium template with soft watercolor effects and elegant typography', thumbnail_url: '', is_premium: true },
      { id: 'c39b0e58-9d2c-5fd0-c114-ef3f7d9e2f3b', name: 'Modern', description: 'Bold and modern premium template with geometric patterns', thumbnail_url: '', is_premium: true },
      { id: '3e62c147-9f7b-410a-8cc8-3162799c8fc4', name: 'Executive', description: 'Sleek corporate template with dual-column layout', thumbnail_url: '', is_premium: true },
      { id: '7f2d59ac-bd56-4c4f-9e79-57388916d7a5', name: 'Minimalist', description: 'Highly sophisticated, whitespace-heavy editorial layout', thumbnail_url: '', is_premium: true }
    ];

    // Always ensure all 6 templates exist
    if (!templateData || templateData.length < 6) {
      await supabaseAdmin.from('templates').upsert(initialTemplates);
      const { data: updatedTemplates } = await supabaseAdmin.from('templates').select('*').order('name');
      templateData = updatedTemplates || initialTemplates;
    }

    // 3. Fetch payments
    const { data: payments } = await supabaseAdmin.from('payments').select('*').order('created_at', { ascending: false }).limit(50);
    const paymentsAmount = (payments || []).reduce((sum, p) => sum + (p.amount || 0), 0);

    // 4. Fetch biodatas
    const { data: biodatas, count: biodatasCount } = await supabaseAdmin.from('biodatas').select('*', { count: 'exact' }).order('created_at', { ascending: false }).limit(50);

    const formattedBiodatas = (biodatas || []).map(b => ({
      id: b.id,
      template_id: b.template_id,
      status: b.status || b.data?.status || (b.is_premium ? 'premium' : 'free'),
      created_at: b.created_at,
      fingerprint: b.fingerprint || b.data?.fingerprint || ''
    }));

    return NextResponse.json({
      templates: templateData || [],
      recentPayments: payments || [],
      recentBiodatas: formattedBiodatas,
      stats: {
        paymentsAmount,
        biodatasCount: biodatasCount || 0
      }
    });

  } catch (error: any) {
    console.error('Admin API error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
