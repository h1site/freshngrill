import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://cjbdgfcxewvxcojxbuab.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqYmRnZmN4ZXd2eGNvanhidWFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyODk3MzQsImV4cCI6MjA4MDg2NTczNH0.rjCE0Fec2hQuOrFpIG0u69RbFiEx-zAu3P6kXMTYfxY'
);

async function check() {
  const { data, error } = await supabase.from('recipes').select('id, title, faq').eq('id', 101).single();
  console.log('Error:', error);
  if (data?.faq) {
    const faqParsed = JSON.parse(data.faq);
    console.log('FAQ Format:', JSON.stringify(faqParsed, null, 2));
  }
}

check();
