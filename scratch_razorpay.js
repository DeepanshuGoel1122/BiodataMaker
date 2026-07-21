const Razorpay = require('razorpay');
require('dotenv').config({ path: '.env.local' });

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: 'dummy_secret',
});

async function run() {
  try {
    const order = await razorpay.orders.create({
      amount: 4900,
      currency: 'INR',
      receipt: 'test'
    });
    console.log("Success:", order);
  } catch (error) {
    console.error("Error:", error);
  }
}

run();
