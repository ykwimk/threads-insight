import { NextRequest, NextResponse } from 'next/server';
import { fetchProfileData } from '@/server';

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get(
    process.env.SERVICE_ACCESS_TOKEN!,
  )?.value;

  if (!accessToken) {
    return NextResponse.json(
      { error: 'No access token found. Please login again.' },
      { status: 401 },
    );
  }

  try {
    const profile = await fetchProfileData(accessToken);

    if ('error' in profile && profile.error.code === 190) {
      return NextResponse.json({ error: profile.error }, { status: 401 });
    }

    return NextResponse.json({ profile });
  } catch (error: any) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
