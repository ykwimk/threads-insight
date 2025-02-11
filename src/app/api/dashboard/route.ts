import { NextRequest, NextResponse } from 'next/server';
import { ProfileResponseType, UserInsightsResponseType } from './route.d';

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

// 사용자 인사이트
async function fetchUserInsights(
  userId: string,
  accessToken: string,
  breakdown?: string,
): Promise<UserInsightsResponseType> {
  const userParams = new URLSearchParams({
    access_token: accessToken,
    metric: 'views,likes,replies,reposts,quotes,followers_count',
  });

  if (breakdown) {
    userParams.append('metric', 'follower_demographics');
    userParams.append('breakdown', breakdown);
  }

  const response = await fetch(
    `${THREADS_API_BASE}/${userId}/threads_insights?${userParams.toString()}`,
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `User Insights API request failed: ${JSON.stringify(errorData)}`,
    );
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

    const userInsights = await fetchUserInsights(
      profileData.id,
      accessToken,
      breakdown,
    );

    return NextResponse.json({ userInsights });
  } catch (error: any) {
    console.error('Insights API 호출 중 오류:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 },
    );
  }
}
