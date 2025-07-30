// app/api/users/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'nodejs'; 
export async function GET() {
  try {
    // const users = await clerkClient.users.getUserList();
    return NextResponse.json([]);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
