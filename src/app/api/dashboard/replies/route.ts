import { NextRequest, NextResponse } from 'next/server';
import { MediaInsightsDataById, PostsData } from '@/types';
import { fetchMediaInsights, fetchPostsData, fetchReplies } from '@/server';
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
    const { mediaId } = await request.json();

    const replies = await fetchReplies(mediaId, accessToken);

    if (!mediaId) {
      return NextResponse.json(
        { error: 'Media ID is required' },
        { status: 400 },
      );
    }

    if ('error' in replies) {
      const status = STATUS_CODE_MAP[replies.error.code] || 400;
      return NextResponse.json({ error: replies.error }, { status });
    }

    return NextResponse.json({ results: replies });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
