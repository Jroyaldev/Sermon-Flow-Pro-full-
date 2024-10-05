import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getAuth } from '@clerk/nextjs/server';

export async function GET(req: NextRequest) {
  try {
    const auth = getAuth(req);
    const userId = auth.userId;
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createRouteHandlerClient({ cookies });
    
    const sessionToken = await auth.getToken({ template: 'supabase' });
    if (!sessionToken) {
      return NextResponse.json({ error: 'No Supabase token' }, { status: 401 });
    }

    await supabase.auth.setSession({
      access_token: sessionToken,
      refresh_token: sessionToken,
    });

    const { data, error } = await supabase.from('tasks').select('count').single();
    
    if (error) {
      throw error;
    }

    return NextResponse.json({ message: 'Supabase connection successful', count: data.count });
  } catch (error) {
    console.error('Error testing Supabase connection:', error);
    return NextResponse.json({ error: 'An error occurred while testing Supabase connection' }, { status: 500 });
  }
}