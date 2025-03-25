import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
      <Card className="relative mx-auto p-4">
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/5 backdrop-blur-md">
          <div className="w-full text-center">
            <h3 className="text-center text-lg font-semibold">
              내 Threads 성향 알아보기
            </h3>
            <p className="mx-auto mt-2 max-w-xs text-center text-sm">
              당신이 남긴 글과 댓글을 바탕으로
              <br />
              말투, 관심사, 활동 스타일을 AI가 요약해드릴게요.
            </p>
            <Button size="sm" className="mt-3 px-4 py-5 text-sm">
              분석하기
            </Button>
          </div>
        </div>
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
