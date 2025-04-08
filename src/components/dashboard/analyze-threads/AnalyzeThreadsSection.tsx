import { useCallback, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface Props {
  username: string;
  profileId: string;
}

const defaultContent = {
  username: 'plantlover_91',
  summary: '자주 감정에 대해 이야기하며, 공감과 위로를 주는 글을 많이 씁니다.',
  interests: ['🌱 식물', '🧠 마케팅', '😴 일상'],
  tone: '다정하고 감성적인 표현 사용',
  activityPattern: '하루 2~3회 글 작성',
};

export function AnalyzeThreadsSection({ username, profileId }: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [content, setContent] = useState<{
    summary: string;
    interests: string[];
    tone: string;
    activityPattern: string;
    frequentEmotions?: string[];
    frequentWords?: string[];
    frequentHashtags?: string[];
    frequentEmojis?: string[];
    frequentStyles?: string[];
    frequentGrammar?: string[];
    frequentSentences?: string[];
  }>(defaultContent);

  const fetchData = useCallback(async () => {
    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/dashboard/analyze-threads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profileId }),
      });

      const json = await res.json();

      if (res.ok) {
        const text = json.results.candidates[0].content.parts[0].text;
        const cleaned = text
          .replace(/^```json\s*/i, '')
          .replace(/```$/, '')
          .trim();
        const parsedJson = JSON.parse(cleaned);

        setConfirmed(true);
        setContent(parsedJson);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const {
    summary,
    interests,
    tone,
    activityPattern,
    frequentEmotions,
    frequentWords,
    frequentHashtags,
    frequentEmojis,
    frequentStyles,
    frequentGrammar,
    frequentSentences,
  } = content;

  return (
    <section className="p-6 pb-0">
      <Card className="relative mx-auto p-4">
        {!confirmed && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/5 backdrop-blur-md">
            <div className="w-full text-center">
              <h3 className="text-center text-lg font-semibold">
                내 Threads 성향 알아보기
              </h3>
              <p className="mx-auto mt-2 max-w-xs text-center text-sm">
                당신이 남긴 글과 댓글을 바탕으로
                <br />
                말투, 관심사, 활동 스타일을 AI가 요약해드릴게요.
              </p>
              <Button
                size="sm"
                className="mt-3 px-4 py-5 text-sm"
                disabled={loading}
                onClick={fetchData}
              >
                {loading ? (
                  <LoadingSpinner borderColor="border-white" />
                ) : (
                  `분석하기`
                )}
              </Button>
            </div>
          </div>
        )}
        <CardHeader className="py-2">
          <CardTitle>
            <Link
              href={`https://www.threads.net/@${username}`}
              className="underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              @{username}
            </Link>
            님은,
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <ul className="[&>*]:mt-3">
            <li>
              <div className="flex w-full items-start gap-2">
                <strong>📝 관심 주제:</strong>
                <p className="flex-1"> {interests.join(', ')}</p>
              </div>
            </li>
            <li>
              <div className="flex w-full items-start gap-2">
                <strong>💬 말투/감정:</strong>
                <p className="flex-1"> {tone}</p>
              </div>
            </li>
            <li>
              <div className="flex w-full items-start gap-2">
                <strong>⏱️ 활동 패턴:</strong>
                <p className="flex-1"> {activityPattern}</p>
              </div>
            </li>
            <li>
              <div className="flex w-full items-start gap-2">
                <strong>🔍 요약</strong>
                <p className="flex-1"> {summary}</p>
              </div>
            </li>
            {frequentEmotions && !!frequentEmotions.length && (
              <li>
                <div className="flex w-full items-start gap-2">
                  <strong>😃 자주 사용하는 감정:</strong>
                  <p className="flex-1">{frequentEmotions.join(', ')}</p>
                </div>
              </li>
            )}
            {frequentWords && !!frequentWords.length && (
              <li>
                <div className="flex w-full items-start gap-2">
                  <strong>📊 자주 사용하는 단어:</strong>
                  <p className="flex-1">{frequentWords.join(', ')}</p>
                </div>
              </li>
            )}
            {frequentHashtags && !!frequentHashtags.length && (
              <li>
                <div className="flex w-full items-start gap-2">
                  <strong>🔖 자주 사용하는 해시태그:</strong>
                  <p className="flex-1">{frequentHashtags.join(', ')}</p>
                </div>
              </li>
            )}
            {frequentEmojis && !!frequentEmojis.length && (
              <li>
                <div className="flex w-full items-start gap-2">
                  <strong>📱 자주 사용하는 이모지:</strong>
                  <p className="flex-1">{frequentEmojis.join(', ')}</p>
                </div>
              </li>
            )}
            {frequentStyles && !!frequentStyles.length && (
              <li>
                <div className="flex w-full items-start gap-2">
                  <strong>✍️ 자주 사용하는 문체:</strong>
                  <p className="flex-1">{frequentStyles.join(', ')}</p>
                </div>
              </li>
            )}
            {frequentGrammar && !!frequentGrammar.length && (
              <li>
                <div className="flex w-full items-start gap-2">
                  <strong>📚 자주 사용하는 문법:</strong>
                  <p className="flex-1">{frequentGrammar.join(', ')}</p>
                </div>
              </li>
            )}
            {frequentSentences && !!frequentSentences.length && (
              <li>
                <div className="flex w-full items-start gap-2">
                  <strong>✏️ 자주 사용하는 문장:</strong>
                  <p className="flex-1">{frequentSentences.join(', ')}</p>
                </div>
              </li>
            )}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}
