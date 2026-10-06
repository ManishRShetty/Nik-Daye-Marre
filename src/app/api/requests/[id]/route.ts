import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // In Phase 3, this will update Supabase
    // await supabase.from('requests').update({ status: body.status }).eq('id', id);

    return NextResponse.json({
      id: id,
      status: body.status || "In Progress",
      updated_at: new Date().toISOString()
    }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
