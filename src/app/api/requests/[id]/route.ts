import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('Requests')
      .update({ status: body.status })
      .eq('id', id)
      .select();

    if (error) throw error;

    return NextResponse.json({
      id: id,
      status: body.status || "In Progress",
      updated_at: new Date().toISOString()
    }, { status: 200 });
  } catch (error) {
    console.error('PATCH /api/requests/[id] error:', error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
