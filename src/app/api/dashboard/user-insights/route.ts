import { NextRequest, NextResponse } from 'next/server';
import { fetchUserInsights } from '@/server';
import { STATUS_CODE_MAP } from '@/constants';

export async function POST(request: NextRequest) {
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
    const { profileId } = await request.json();

    if (!profileId) {
      return NextResponse.json(
        { error: 'Profile ID is required' },
        { status: 400 },
      );
    }

    const userInsights = await fetchUserInsights(profileId, accessToken);

    if ('error' in userInsights) {
      const status = STATUS_CODE_MAP[userInsights.error.code] || 400;
      return NextResponse.json({ error: userInsights.error }, { status });
    }

    return NextResponse.json({ results: userInsights });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
