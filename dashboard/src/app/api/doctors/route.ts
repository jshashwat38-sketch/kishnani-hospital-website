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
    const doctors = db.get('doctors');
    const response = NextResponse.json(doctors);
    return addCorsHeaders(response);
  } catch (error: any) {
    return addCorsHeaders(NextResponse.json({ error: error.message }, { status: 500 }));
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newDoctor = db.insert('doctors', body);
    const response = NextResponse.json({ success: true, doctor: newDoctor });
    return addCorsHeaders(response);
  } catch (error: any) {
    return addCorsHeaders(NextResponse.json({ error: error.message }, { status: 500 }));
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return addCorsHeaders(NextResponse.json({ error: 'Missing ID' }, { status: 400 }));
    }
    const updated = db.update('doctors', body.id, body);
    const response = NextResponse.json({ success: true, doctor: updated });
    return addCorsHeaders(response);
  } catch (error: any) {
    return addCorsHeaders(NextResponse.json({ error: error.message }, { status: 500 }));
  }
}
