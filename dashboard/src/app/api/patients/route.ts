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
    const patients = await db.get('patients');
    const response = NextResponse.json(patients);
    return addCorsHeaders(response);
  } catch (error: any) {
    return addCorsHeaders(NextResponse.json({ error: error.message }, { status: 500 }));
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.name || !body.phone) {
      return addCorsHeaders(NextResponse.json({ error: 'Missing required parameters (name, phone)' }, { status: 400 }));
    }
    
    const newPatient = await db.insert('patients', {
      name: body.name,
      age: body.age || 30,
      gender: body.gender || 'Male',
      phone: body.phone,
      bloodGroup: body.bloodGroup || 'O+',
      status: body.status || 'ER Queue',
      ward: body.ward || 'Emergency Triage',
      admissionDate: body.admissionDate || new Date().toISOString().split('T')[0],
      history: body.history || [],
      reports: body.reports || [],
      prescriptions: body.prescriptions || []
    });
    
    const response = NextResponse.json({ success: true, patient: newPatient });
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
    
    const updated = await db.update('patients', body.id, body);
    if (!updated) {
      return addCorsHeaders(NextResponse.json({ error: 'Patient not found' }, { status: 404 }));
    }
    
    const response = NextResponse.json({ success: true, patient: updated });
    return addCorsHeaders(response);
  } catch (error: any) {
    return addCorsHeaders(NextResponse.json({ error: error.message }, { status: 500 }));
  }
}
