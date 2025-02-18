import { NextRequest, NextResponse } from 'next/server';
import { ProfileResponseType } from '@/types';

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

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get('threads_access_token')?.value;
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
        { error: 'Either userId must be provided.' },
        { status: 400 },
      );
    }

    return NextResponse.json({ profile });
  } catch (error: any) {
    console.error('Profile API 호출 중 오류:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 },
    );
  }
}
