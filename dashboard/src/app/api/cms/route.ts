import { NextResponse } from 'next/server';
import { db } from '@/utils/db';

function addCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

export async function OPTIONS() {
  const response = NextResponse.json({ success: true });
  return addCorsHeaders(response);
}

export async function GET() {
  try {
    const cms = db.get('cms');
    const response = NextResponse.json(cms);
    return addCorsHeaders(response);
  } catch (error: any) {
    return addCorsHeaders(NextResponse.json({ error: error.message }, { status: 500 }));
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { section, data } = body;
    
    if (!section || !data) {
      return addCorsHeaders(NextResponse.json({ error: 'Missing section or data' }, { status: 400 }));
    }
    
    const updatedCMS = db.updateCMS(section, data);
    const response = NextResponse.json({ success: true, cms: updatedCMS });
    return addCorsHeaders(response);
  } catch (error: any) {
    return addCorsHeaders(NextResponse.json({ error: error.message }, { status: 500 }));
  }
}
