import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // In Phase 3, you will connect this to Supabase using @supabase/supabase-js
    // const { data, error } = await supabase.from('requests').insert([body]).select();
    
    return NextResponse.json({
      id: "req_" + Math.random().toString(36).substr(2, 5),
      status: "Pending",
      message: "Request created successfully."
    }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // In Phase 3, query Supabase based on the status filter
    
    return NextResponse.json({
      data: [
        {
          id: "req_8f72c",
          title: "AC Leaking",
          department: "Maintenance",
          priority: "Urgent",
          status: status || "Pending",
          location_id: "LAB_3",
          created_at: new Date().toISOString()
        },
        {
          id: "req_9a11b",
          title: "Need bonafide certificate",
          department: "Admin",
          priority: "Low",
          status: "Assigned",
          location_id: "ADMIN_BLOCK",
          created_at: new Date().toISOString()
        }
      ]
    }, { status: 200 });
  } catch (error) {
    // Rule 7: Gracefully fail. If a database fetch fails, return an empty array `[]`
    console.error(error);
    return NextResponse.json({ data: [] }, { status: 200 });
  }
}
