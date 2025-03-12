import { NextRequest, NextResponse } from 'next/server';
import { MediaInsightsDataById, PostsData } from '@/types';
import { fetchMediaInsights, fetchPostsData } from '@/server';
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
    const { profileId, after } = await request.json();

    const posts = await fetchPostsData(profileId, accessToken, after);

    if (!profileId) {
      return NextResponse.json(
        { error: 'Profile ID is required' },
        { status: 400 },
      );
    }

    if ('error' in posts) {
      const status = STATUS_CODE_MAP[posts.error.code] || 400;
      return NextResponse.json({ error: posts.error }, { status });
    }

    // 리포스트 된 게시물 제외
    const postsWithoutReposts = posts.data.filter(
      (post) => post.media_type !== 'REPOST_FACADE',
    );
    // 포스트 ID 목록
    const mediaIds = posts.data.map((post: PostsData) => post.id);

    const mediaData: MediaInsightsDataById = await Promise.all(
      mediaIds.map(async (mediaId) => {
        try {
          const mediaInsight = await fetchMediaInsights(
            mediaId,
            accessToken,
            after,
          );

          if ('error' in mediaInsight) {
            return { id: mediaId, insights: [] };
          }

          return { id: mediaId, insights: mediaInsight.data };
        } catch (error) {
          console.error(error);
          return { id: null, insights: [] }; // 실패한 경우 ID null, 빈 배열 반환
        }
      }),
    );

    return NextResponse.json({
      mediaData,
      posts: postsWithoutReposts,
      afterCursor: posts.paging?.cursors?.after || null,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
