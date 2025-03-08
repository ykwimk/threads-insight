import { NextRequest, NextResponse } from 'next/server';
import { fetchProfileData, fetchUserInsights } from '@/server';

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

    if (!profile.id) {
      return NextResponse.json(
        { error: 'Either userId or mediaId must be provided.' },
        { status: 400 },
      );
    }

    const userInsights = await fetchUserInsights(profile.id, accessToken);

    return NextResponse.json({ userInsights });
  } catch (error: any) {
    console.error('User Insights API 호출 중 오류:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 },
    );
  }
}
