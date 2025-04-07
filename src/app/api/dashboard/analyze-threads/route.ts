import { json } from 'stream/consumers';
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { fetchPosts } from '@/server';
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
    const { profileId } = await request.json();

    const posts = await fetchPosts(profileId, accessToken);

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

    const contents = postsWithoutReposts
      .map((post) => `- ${post.text}`)
      .join('\n');

    const prompt = `
    다음은 한 사용자가 Threads에 남긴 글이야.

    ${contents}

    이 사람의 글을 분석해서 다음 질문과 함께 이 사람의 말투, 관심사, 활동 스타일을 캐주얼하고 간단하게 요약해.

    1. 이 사람의 성격은 어떤가요?
    2. 이 사람의 관심사는 무엇인가요?
    3. 이 사람의 말투는 어떤가요?
    4. 이 사람의 활동 스타일은 어떤가요?
    5. 이 사람의 글에서 어떤 주제를 자주 다루나요?
    6. 이 사람의 글에서 어떤 감정을 자주 표현하나요?
    7. 이 사람의 글에서 어떤 단어를 자주 사용하나요?
    8. 이 사람의 글에서 어떤 해시태그를 자주 사용하나요?
    9. 이 사람의 글에서 어떤 이모지를 자주 사용하나요?
    10. 이 사람의 글에서 어떤 문체를 자주 사용하나요?
    11. 이 사람의 글에서 어떤 문법을 자주 사용하나요?
    12. 이 사람의 글에서 어떤 문장을 자주 사용하나요?

    분석한 데이터를 아래 인터페이스를 참고 JSON 형식으로 반환해.

    interface AnalyzeThreads {
      summary: string;
      interests: string[];
      tone: string;
      activityPattern: string;
      frequentEmotions: string[];
      frequentWords: string[];
      frequentHashtags: string[];
      frequentEmojis: string[];
      frequentStyles: string[];
      frequentGrammar: string[];
      frequentSentences: string[];
    };

    JSON 형식으로 대답할 때는 반드시 JSON.parse()로 바로 데이터를 사용할 수 있게 대답해.
    그리고 JSON 형식이 아닌 다른 형식으로는 절대 대답하지 마.
    `;

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    return NextResponse.json({
      results: response,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
