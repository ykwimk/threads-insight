import { NextRequest, NextResponse } from 'next/server';
import { fetchFollowerDemographics, fetchProfileData } from '@/server';

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get('threads_access_token')?.value;
  if (!accessToken) {
    return NextResponse.json(
      { error: 'No access token found. Please login again.' },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(request.url);
  const breakdown = searchParams.get('breakdown') || undefined;

  try {
    const profile = await fetchProfileData(accessToken);

    if (!profile.id) {
      return NextResponse.json(
        { error: 'Either userId or mediaId must be provided.' },
        { status: 400 },
      );
    }

    const followerDemographics = await fetchFollowerDemographics(
      profile.id,
      accessToken,
      breakdown,
    );

    return NextResponse.json({ followerDemographics });
  } catch (error: any) {
    console.error('Follower demographics API 호출 중 오류:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 },
    );
  }
}
