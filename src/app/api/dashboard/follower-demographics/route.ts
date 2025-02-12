import { NextRequest, NextResponse } from 'next/server';
import { FollowerDemographicsResponseType, ProfileResponseType } from '@/types';

const THREADS_API_BASE = 'https://graph.threads.net/v1.0';

// 내 정보
async function fetchProfileData(
  accessToken: string,
): Promise<ProfileResponseType> {
  const profileParams = new URLSearchParams({
    fields: 'id,username,name,threads_profile_picture_url,threads_biography',
    access_token: accessToken,
  });

  const response = await fetch(
    `${THREADS_API_BASE}/me/?${profileParams.toString()}`,
  );
  return response.json();
}

// 사용자 인사이트 (follower_demographics)
async function fetchFollowerDemographics(
  userId: string,
  accessToken: string,
  breakdown?: string,
): Promise<FollowerDemographicsResponseType> {
  const followerParams = new URLSearchParams({
    access_token: accessToken,
    metric: 'follower_demographics',
  });

  if (breakdown) {
    followerParams.append('breakdown', breakdown);
  }

  const response = await fetch(
    `${THREADS_API_BASE}/${userId}/threads_insights?${followerParams.toString()}`,
  );

  if (!response.ok) {
    const errorData = await response.json();
    const message = errorData.error.error_user_msg
      ? JSON.stringify(errorData.error.error_user_msg)
      : `Follower demographics API request failed: ${JSON.stringify(errorData)}`;

    throw new Error(message);
  }

  const { data } = await response.json();
  return data;
}

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
    const profileData = await fetchProfileData(accessToken);

    if (!profileData.id) {
      return NextResponse.json(
        { error: 'Either userId or mediaId must be provided.' },
        { status: 400 },
      );
    }

    const followerDemographics = await fetchFollowerDemographics(
      profileData.id,
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
