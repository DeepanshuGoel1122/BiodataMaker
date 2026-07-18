import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic'; // Ensures this route is not statically cached

export async function GET() {
  try {
    // A simple query to wake up/keep the database active.
    const { data, error } = await supabaseAdmin.from('templates').select('id').limit(1);

    if (error) {
      console.error('Keepalive error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Database pinged successfully', 
      timestamp: new Date().toISOString() 
    });
  } catch (err: any) {
    console.error('Keepalive exception:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
