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
    const appointments = await db.get('appointments');
    const response = NextResponse.json(appointments);
    return addCorsHeaders(response);
  } catch (error: any) {
    return addCorsHeaders(NextResponse.json({ error: error.message }, { status: 500 }));
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Support both snake_case and camelCase parameters for frontend forms compatibility
    const patientName = body.patientName || body.patient_name;
    const doctorName = body.doctorName || body.doctor;
    const dept = body.dept || body.department;
    const date = body.date;
    const time = body.time;
    const priority = body.priority || 'Routine';
    const status = body.status || 'Pending';
    
    if (!patientName || !date || !time) {
      return addCorsHeaders(NextResponse.json({ error: 'Missing required parameters (patientName, date, time)' }, { status: 400 }));
    }
    
    const newAppointment = await db.insert('appointments', {
      patientName,
      doctorName: doctorName || 'Dr. Lal Kumar Kishnani',
      date,
      time,
      dept: dept || 'General Medicine',
      status,
      priority
    });
    
    const response = NextResponse.json({ success: true, appointment: newAppointment });
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
    
    const updated = await db.update('appointments', body.id, body);
    if (!updated) {
      return addCorsHeaders(NextResponse.json({ error: 'Appointment not found' }, { status: 404 }));
    }
    
    const response = NextResponse.json({ success: true, appointment: updated });
    return addCorsHeaders(response);
  } catch (error: any) {
    return addCorsHeaders(NextResponse.json({ error: error.message }, { status: 500 }));
  }
}
