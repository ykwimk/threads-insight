import { NextRequest, NextResponse } from 'next/server';
import { fetchPost } from '@/server';
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
    const { mediaIds } = await request.json();

    const mappingImages = await Promise.all(
      mediaIds.map(async (id: string) => {
        try {
          const post = await fetchPost(id, accessToken);

          if ('error' in post) {
            const status = STATUS_CODE_MAP[post.error.code] || 400;
            return NextResponse.json({ error: post.error }, { status });
          }

          return { id, media_url: post.media_url };
        } catch (err) {
          console.error('이미지 불러오기 실패', err);
          return { id: null, media_url: null };
        }
      }),
    );

    return NextResponse.json({
      results: mappingImages,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
