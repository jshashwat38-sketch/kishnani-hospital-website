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
    const leads = db.get('leads');
    const response = NextResponse.json(leads);
    return addCorsHeaders(response);
  } catch (error: any) {
    return addCorsHeaders(NextResponse.json({ error: error.message }, { status: 500 }));
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.name || !body.phone || !body.message) {
      return addCorsHeaders(NextResponse.json({ error: 'Missing required parameters' }, { status: 400 }));
    }
    
    const newLead = db.insert('leads', {
      name: body.name,
      phone: body.phone,
      email: body.email || '',
      message: body.message,
      status: body.status || 'Unread',
      notes: body.notes || ''
    });
    
    const response = NextResponse.json({ success: true, lead: newLead });
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
    
    const updated = db.update('leads', body.id, body);
    if (!updated) {
      return addCorsHeaders(NextResponse.json({ error: 'Lead not found' }, { status: 404 }));
    }
    
    const response = NextResponse.json({ success: true, lead: updated });
    return addCorsHeaders(response);
  } catch (error: any) {
    return addCorsHeaders(NextResponse.json({ error: error.message }, { status: 500 }));
  }
}
