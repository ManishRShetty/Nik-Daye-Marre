import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('Requests')
      .insert([
        {
          title: body.title,
          description: body.description,
          department: body.department,
          priority: body.priority,
          location_id: body.location_id,
          status: 'Pending',
          // user_id is ignored for now if RLS is disabled or mocking anonymous
        }
      ])
      .select();

    if (error) throw error;
    
    return NextResponse.json({
      id: data[0].id,
      status: data[0].status,
      message: "Request created successfully."
    }, { status: 201 });
  } catch (error) {
    console.error('POST /api/requests error:', error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = supabase.from('Requests').select('*').order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;
    
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error('GET /api/requests error:', error);
    // Rule 7: Gracefully fail. Return empty array on database fetch error.
    return NextResponse.json({ data: [] }, { status: 200 });
  }
}
