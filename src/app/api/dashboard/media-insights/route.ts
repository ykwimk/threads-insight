import { NextRequest, NextResponse } from 'next/server';
import {
  MediaInsightsDataType,
  PostDataType,
  PostResponseType,
  ProfileResponseType,
} from '@/types';

const THREADS_API_BASE = 'https://graph.threads.net/v1.0';

// 내 정보
async function fetchProfileData(
  accessToken: string,
): Promise<ProfileResponseType> {
  const profileParams = new URLSearchParams({
    fields: 'id',
    access_token: accessToken,
  });

  const response = await fetch(
    `${THREADS_API_BASE}/me/?${profileParams.toString()}`,
  );
  return response.json();
}

// 포스트 정보
async function fetchPostsData(
  userId: string,
  accessToken: string,
): Promise<PostResponseType> {
  const profileParams = new URLSearchParams({
    fields: 'id,text,media_url,media_type',
    access_token: accessToken,
  });

  const response = await fetch(
    `${THREADS_API_BASE}/${userId}/threads?${profileParams.toString()}`,
  );
  return response.json();
}

// 미디어 인사이트
async function fetchMediaInsights(
  mediaIds: string[],
  accessToken: string,
): Promise<
  Array<{
    id: string | null;
    insights: Array<MediaInsightsDataType>;
  }>
> {
  const mediaParams = new URLSearchParams({
    access_token: accessToken,
    metric: 'likes,replies,views,reposts,quotes,shares',
  });

  const mediaData: Array<{
    id: string | null;
    insights: Array<MediaInsightsDataType>;
  }> = [];

  await Promise.all(
    mediaIds.map(async (mediaId: string) => {
      const url = `${THREADS_API_BASE}/${mediaId}/insights?${mediaParams.toString()}`;
      const response = await fetch(url);
      const { data } = await response.json();

      if (response.ok) {
        mediaData.push({ id: mediaId, insights: data });
      } else {
        console.error(`Failed to fetch insights for media ${mediaId}:`, data);
        mediaData.push({ id: null, insights: [] });
      }
    }),
  );

  return mediaData;
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
    const posts = await fetchPostsData(profile.id, accessToken);

    if (!profile.id || !posts) {
      return NextResponse.json(
        { error: 'Either userId or mediaId must be provided.' },
        { status: 400 },
      );
    }
    const mediaIds = posts.data.map((post: PostDataType) => post.id);
    const mediaInsights = await fetchMediaInsights(mediaIds, accessToken);

    return NextResponse.json({ mediaInsights, posts });
  } catch (error: any) {
    console.error('Media Insights API 호출 중 오류:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 },
    );
  }
}
