import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/requests (Fetch all tickets)
export async function GET() {
  const { data, error } = await supabase
    .from('requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST /api/requests (Insert new ticket)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('requests')
      .insert([
        {
          title: body.title,
          description: body.description,
          department: body.department,
          location_id: body.location_id,
          priority: body.priority || 'low',
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
