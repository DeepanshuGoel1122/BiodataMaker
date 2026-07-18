import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: Request) {
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

    // 2. Parse request
    const body = await request.json();
    const { templateId, is_premium } = body;

    if (!templateId || typeof is_premium !== 'boolean') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    // 3. Update using Admin Client
    const { data, error } = await supabaseAdmin
      .from('templates')
      .update({ is_premium })
      .eq('id', templateId)
      .select();

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error('Template not found or no rows updated');
    }

    return NextResponse.json({ success: true, template: data[0] });

  } catch (error: any) {
    console.error('Admin API error updating template:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
