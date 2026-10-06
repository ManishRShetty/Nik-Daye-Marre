export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

// PATCH /api/requests (Update ticket status)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
    }

    const updatePayload: any = { status };
    if (status === 'Completed' || status === 'Resolved') {
      updatePayload.resolved_at = new Date().toISOString();
    }

    let { data, error } = await supabase
      .from('requests')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    // If Supabase throws an error because the `resolved_at` column doesn't exist yet, fallback
    if (error && error.message.includes('resolved_at')) {
      const fallbackUpdate = await supabase
        .from('requests')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      data = fallbackUpdate.data;
      error = fallbackUpdate.error;
    }

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
