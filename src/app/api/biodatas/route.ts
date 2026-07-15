import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { templateId, status, fingerprint } = body;

    if (!templateId) {
      return NextResponse.json({ error: 'Template ID is required' }, { status: 400 });
    }

    // Insert biodata record securely using service role key (bypassing RLS)
    const { data: insertedData, error } = await supabaseAdmin
      .from('biodatas')
      .insert([{ 
        template_id: templateId, 
        data: { 
          fingerprint: fingerprint || 'unknown',
          status: status || 'free'
        }
      }])
      .select()
      .single();

    if (error) {
      console.error('Error inserting biodata record:', error);
      return NextResponse.json({ error: 'Failed to record biodata', details: error.message, hint: error.hint, code: error.code }, { status: 500 });
    }

    return NextResponse.json({ success: true, biodata: insertedData });
  } catch (error) {
    console.error('Error in biodatas POST route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
