import { NextRequest, NextResponse } from 'next/server';
import { fetchConversation } from '@/server';
import { STATUS_CODE_MAP } from '@/constants';
import { ConversationData } from '@/types';

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

    const conversation = await fetchConversation(mediaId, accessToken);

    if (!mediaId) {
      return NextResponse.json(
        { error: 'Media ID is required' },
        { status: 400 },
      );
    }

    if ('error' in conversation) {
      const status = STATUS_CODE_MAP[conversation.error.code] || 400;
      return NextResponse.json({ error: conversation.error }, { status });
    }

    const conversationMap = new Map<string, ConversationData>();
    const conversationData: ConversationData[] = [];

    for (const reply of conversation.data) {
      reply.children = [];
      conversationMap.set(reply.id, reply);
    }

    for (const reply of conversation.data) {
      const parent = conversationMap.get(reply.replied_to.id);
      if (parent) {
        parent.children.push(reply);
      } else {
        conversationData.push(reply);
      }
    }

    return NextResponse.json({
      results: { ...conversation, data: conversationData },
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
