import { NextRequest, NextResponse } from 'next/server';
import { PostDataType } from '@/types';
import { fetchMediaInsights, fetchPostsData, fetchProfileData } from '@/server';

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get('threads_access_token')?.value;
  if (!accessToken) {
    return NextResponse.json(
      { error: 'No access token found. Please login again.' },
      { status: 401 },
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const after = searchParams.get('after') || undefined;

    const profile = await fetchProfileData(accessToken);
    const posts = await fetchPostsData(profile.id, accessToken, after);

    if (!profile.id || !posts) {
      return NextResponse.json(
        { error: 'Either userId or mediaId must be provided.' },
        { status: 400 },
      );
    }
    const mediaIds = posts.data.map((post: PostDataType) => post.id);
    const mediaInsights = await fetchMediaInsights(
      mediaIds,
      accessToken,
      after,
    );

    return NextResponse.json({
      mediaInsights,
      posts: posts.data,
      nextCursor: posts.paging?.cursors?.after || null,
    });
  } catch (error: any) {
    console.error('Media Insights API 호출 중 오류:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 },
    );
  }
}
