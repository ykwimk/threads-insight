import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function UserProfileCard() {
  const dummy = {
    username: 'plantlover_91',
    summary:
      '자주 감정에 대해 이야기하며, 공감과 위로를 주는 글을 많이 씁니다.',
    interests: ['🌱 식물', '🧠 마케팅', '😴 일상'],
    tone: '다정하고 감성적인 표현 사용',
    activityPattern: '하루 2~3회 글 작성',
  };

  const { username, summary, interests, tone, activityPattern } = dummy;

  return (
    <div className="p-6 pb-0">
      <Card className="mx-auto p-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Link
              href=""
              className="underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              @{username}
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            📝 <strong>관심 주제:</strong> {interests.join(', ')}
          </p>
          <p>
            💬 <strong>말투/감정:</strong> {tone}
          </p>
          <p>
            ⏱️ <strong>활동 패턴:</strong> {activityPattern}
          </p>
          <div className="pt-2">
            <p className="font-medium">🔍 요약</p>
            <p className="">{summary}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
