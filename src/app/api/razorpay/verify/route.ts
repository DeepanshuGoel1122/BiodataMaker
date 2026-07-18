import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, templateId, fingerprint, amount } = await req.json();

    // Check if using dummy keys for local testing
    if (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID === 'rzp_test_dummy' || !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
      console.log('Using dummy Razorpay keys, skipping signature verification');
      
      // Record payment securely for dummy testing
      if (templateId) {
        await supabaseAdmin.from('payments').insert([{
          id: uuidv4(),
          template_id: templateId,
          razorpay_order_id: razorpay_order_id || 'order_dummy',
          razorpay_payment_id: razorpay_payment_id || 'pay_dummy',
          status: 'paid',
          amount: amount || 4900,
          created_at: new Date().toISOString()
        }]);
      }
      
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const secret = process.env.RAZORPAY_KEY_SECRET || 'dummy_secret';

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Record payment securely
      if (templateId) {
        const { error } = await supabaseAdmin.from('payments').insert([{
          id: uuidv4(),
          template_id: templateId,
          razorpay_order_id: razorpay_order_id,
          razorpay_payment_id: razorpay_payment_id,
          status: 'paid',
          amount: amount || 4900, // keep consistent with paise if that's how it's used
          created_at: new Date().toISOString()
        }]);
        
        if (error) {
          console.error('Error inserting payment record:', error);
        }
      }

      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
