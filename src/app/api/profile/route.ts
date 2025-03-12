import { NextRequest, NextResponse } from 'next/server';
import { fetchProfileData } from '@/server';
import { STATUS_CODE_MAP } from '@/constants';

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

    if ('error' in profile) {
      const status = STATUS_CODE_MAP[profile.error.code] || 400;
      return NextResponse.json({ error: profile.error }, { status });
    }

    return NextResponse.json({ results: profile });
  } catch (error: any) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
