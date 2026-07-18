const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkSchema() {
  const { data, error } = await supabaseAdmin.from('payments').insert([{
    template_id: 'd86b8b0e-3c58-40da-9e45-8bc6dc970364',
    amount: 49,
    status: 'paid'
  }]);
  if (error) {
    console.error('Error inserting payment:', error);
  } else {
    console.log('Successfully inserted payment. Data:', data);
  }
}

checkSchema();
