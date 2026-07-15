import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { v4 as uuidv4 } from 'uuid';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_dummy',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const amount = body.amount || 4900; // default 49 INR in paise
    const currency = 'INR';
    
    // Check if using dummy keys for local testing
    if (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID === 'rzp_test_dummy' || !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
      console.log('Using dummy Razorpay keys, returning mock order');
      return NextResponse.json({
        order: {
          id: 'order_dummy_' + uuidv4().substring(0, 8),
          amount,
          currency,
          receipt: uuidv4()
        }
      }, { status: 200 });
    }

    // Create an order via real Razorpay API
    const options = {
      amount,
      currency,
      receipt: uuidv4(),
    };
    
    const order = await razorpay.orders.create(options);
    
    return NextResponse.json({ order }, { status: 200 });
  } catch (error) {
    console.error('Error creating razorpay order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
