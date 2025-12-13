import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

const ALLOWED_FILES = [
  'recettes-fr-template.json',
  'recettes-fr-template.csv',
  'recipes-en-template.json',
  'recipes-en-template.csv',
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  // Security check - only allow specific template files
  if (!ALLOWED_FILES.includes(filename)) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  try {
    const filePath = join(process.cwd(), 'public', 'templates', filename);
    const fileContent = await readFile(filePath);

    const isJson = filename.endsWith('.json');
    const contentType = isJson ? 'application/json' : 'text/csv';

    return new NextResponse(fileContent, {
      headers: {
        'Content-Type': `${contentType}; charset=utf-8`,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
