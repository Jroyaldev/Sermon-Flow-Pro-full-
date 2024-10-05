import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL or Key is missing');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase.from('tasks').select('count').single();

    if (error) throw error;

    return NextResponse.json({ message: 'Supabase connection successful', count: data.count });
  } catch (error) {
    console.error('Error connecting to Supabase:', error);
    return NextResponse.json({ error: 'Failed to connect to Supabase' }, { status: 500 });
  }
}