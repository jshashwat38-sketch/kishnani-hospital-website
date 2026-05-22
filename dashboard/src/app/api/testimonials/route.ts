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
    const testimonials = db.get('testimonials');
    const response = NextResponse.json(testimonials);
    return addCorsHeaders(response);
  } catch (error: any) {
    return addCorsHeaders(NextResponse.json({ error: error.message }, { status: 500 }));
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newTestimonial = db.insert('testimonials', {
      name: body.name,
      treatment: body.treatment || 'General Consultation',
      rating: body.rating || 5,
      comment: body.comment,
      sentiment: body.sentiment || 'Positive',
      approved: body.approved || false
    });
    const response = NextResponse.json({ success: true, testimonial: newTestimonial });
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
    const updated = db.update('testimonials', body.id, body);
    const response = NextResponse.json({ success: true, testimonial: updated });
    return addCorsHeaders(response);
  } catch (error: any) {
    return addCorsHeaders(NextResponse.json({ error: error.message }, { status: 500 }));
  }
}
