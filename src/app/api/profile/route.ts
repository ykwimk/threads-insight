import { NextRequest, NextResponse } from 'next/server';
import { fetchProfileData } from '@/server';

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
