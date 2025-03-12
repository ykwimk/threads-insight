import { NextRequest, NextResponse } from 'next/server';
import { fetchFollowerDemographics } from '@/server';
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
    const { profileId, breakdown } = await request.json();

    if (!profileId) {
      return NextResponse.json(
        { error: 'Profile ID is required' },
        { status: 400 },
      );
    }

    const followerDemographics = await fetchFollowerDemographics(
      profileId,
      accessToken,
      breakdown,
    );

    if ('error' in followerDemographics) {
      const status = STATUS_CODE_MAP[followerDemographics.error.code] || 400;
      return NextResponse.json(
        { error: followerDemographics.error },
        { status },
      );
    }

    return NextResponse.json({ results: followerDemographics });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
