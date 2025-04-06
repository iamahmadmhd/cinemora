import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
type InsertPayload = {
  type: 'INSERT'
  table: string
  schema: string
  record: {
    id: string;
    email: string;
    raw_user_meta_data: {
      firstname: string;
      lastname: string;
    };
  }
  old_record: null
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { record }: InsertPayload = await request.json();
  console.log({ record })
  const { error, data } = await supabase.from('profiles').insert({
    user_id: record.id,
    email: record.email,
    firstname: record.raw_user_meta_data.firstname,
    lastname: record.raw_user_meta_data.lastname,
  });
  if (error) {
    return NextResponse.error();
  }
  return NextResponse.json(data);
}