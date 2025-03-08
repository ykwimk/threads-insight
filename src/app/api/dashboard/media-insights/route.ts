import { NextRequest, NextResponse } from 'next/server';
import { PostDataType } from '@/types';
import { fetchMediaInsights, fetchPostsData, fetchProfileData } from '@/server';

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
    const { searchParams } = new URL(request.url);
    const after = searchParams.get('after') || undefined;

    const profile = await fetchProfileData(accessToken);
    const posts = await fetchPostsData(profile.id, accessToken, after);

    if (!profile.id || !posts) {
      return NextResponse.json(
        { error: 'Either userId or posts must be provided.' },
        { status: 400 },
      );
    }

    const filteredPosts = posts.data.filter(
      (post) => post.media_type !== 'REPOST_FACADE',
    ); // 리포스트 된 게시물 제외 필터

    const mediaIds = posts.data.map((post: PostDataType) => post.id);
    const mediaInsights = await fetchMediaInsights(
      mediaIds,
      accessToken,
      after,
    );

    return NextResponse.json({
      mediaInsights,
      posts: filteredPosts,
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
