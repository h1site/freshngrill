import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const OLLAMA_URL = 'http://localhost:11434/api/generate';

function extractJSON(text: string): any {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    let jsonStr = jsonMatch[0];

    // Clean up
    jsonStr = jsonStr
      .replace(/[\x00-\x1F\x7F]/g, (char) => {
        if (char === '\n') return '\\n';
        if (char === '\r') return '\\r';
        if (char === '\t') return ' ';
        return '';
      })
      .replace(/,\s*}/g, '}')
      .replace(/,\s*]/g, ']')
      .replace(/^\uFEFF/, '')
      .trim();

    try {
      const result = JSON.parse(jsonStr);
      console.log('JSON parsed OK');
      console.log('Keys:', Object.keys(result));
      console.log('Content exists:', result.content ? 'YES' : 'NO');
      console.log('Content length:', result.content?.length || 0);
      return result;
    } catch (e: any) {
      console.log('Parse error:', e.message);
      console.log('First 500 chars of jsonStr:');
      console.log(jsonStr.substring(0, 500));
      console.log('\n--- Attempting manual extraction ---');

      // Try manual extraction
      const titleMatch = jsonStr.match(/"title"\s*:\s*"([^"]+)"/);
      const contentMatch = jsonStr.match(/"content"\s*:\s*"([\s\S]*?)"\s*,\s*"seo_/);

      console.log('Title match:', titleMatch ? titleMatch[1] : 'NOT FOUND');
      console.log('Content match found:', contentMatch ? 'YES' : 'NO');
      if (contentMatch) {
        console.log('Content match length:', contentMatch[1]?.length);
      }

      return null;
    }
  }
  return null;
}

async function test() {
  const { data: post } = await supabase
    .from('posts')
    .select('id, title, excerpt, content')
    .eq('id', 1)
    .single();

  if (!post) {
    console.log('Post not found');
    return;
  }

  console.log('Post title:', post.title);
  console.log('Original content length:', post.content?.length || 0);

  const prompt = `You are a professional French to English translator.
Translate this blog post from French to English.

IMPORTANT: Translate ONLY, do not invent or add content.

POST TO TRANSLATE:
Title: ${post.title}
Excerpt: ${post.excerpt || ''}
Content:
${post.content?.substring(0, 3000) || ''}

Respond with ONLY a valid JSON object:
{
  "title": "translated title",
  "excerpt": "translated excerpt",
  "content": "translated content (full HTML preserved)",
  "seo_title": "translated SEO title (max 60 chars)",
  "seo_description": "translated meta description (max 160 chars)"
}`;

  console.log('\nSending to Ollama...');

  const response = await fetch(OLLAMA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'mistral:latest',
      prompt,
      stream: false,
      options: { num_predict: 4000, temperature: 0.3 },
    }),
  });

  const data = await response.json();
  console.log('\n=== RAW RESPONSE (last 1000 chars) ===');
  console.log(data.response?.slice(-1000));
  console.log('\n=== END RAW RESPONSE ===');
  console.log('Total response length:', data.response?.length);
  console.log('\nTesting extractJSON...');
  const result = extractJSON(data.response);

  if (result) {
    console.log('\nExtracted content preview:');
    console.log(result.content?.substring(0, 500) || 'NO CONTENT');
  }
}

test().catch(console.error);
