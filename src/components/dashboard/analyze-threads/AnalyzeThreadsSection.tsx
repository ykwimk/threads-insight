import { useCallback, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface AnalyzeThreads {
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
}

const defaultContent: AnalyzeThreads = {
  summary: '자주 감정에 대해 이야기하며, 공감과 위로를 주는 글을 많이 씁니다.',
  interests: ['🌱 식물', '🧠 마케팅', '😴 일상'],
  tone: '다정하고 감성적인 표현 사용',
  activityPattern: '하루 2~3회 글 작성',
};

const LABELS: { key: keyof AnalyzeThreads; label: string }[] = [
  { key: 'interests', label: '📝 관심 주제' },
  { key: 'tone', label: '💬 말투/감정' },
  { key: 'activityPattern', label: '⏱️ 활동 패턴' },
  { key: 'summary', label: '🔍 요약' },
  { key: 'frequentEmotions', label: '😃 자주 사용하는 감정' },
  { key: 'frequentWords', label: '📊 자주 사용하는 단어' },
  { key: 'frequentHashtags', label: '🔖 자주 사용하는 해시태그' },
  { key: 'frequentEmojis', label: '📱 자주 사용하는 이모지' },
  { key: 'frequentStyles', label: '✍️ 자주 사용하는 문체' },
  { key: 'frequentGrammar', label: '📚 자주 사용하는 문법' },
  { key: 'frequentSentences', label: '✏️ 자주 사용하는 문장' },
];

interface Props {
  username: string;
  profileId: string;
}

export function AnalyzeThreadsSection({ username, profileId }: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [content, setContent] = useState<AnalyzeThreads>(defaultContent);

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
        const parsedCleaned = JSON.parse(cleaned);

        setConfirmed(true);
        setContent(parsedCleaned);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  return (
    <section className="p-6 pb-0">
      <Card className="relative mx-auto p-4">
        {!confirmed && <Overlay loading={loading} fetchData={fetchData} />}
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
            {LABELS.map(({ key, label }) => {
              const value = content[key];

              if (!value || (Array.isArray(value) && !value.length)) {
                return null;
              }

              return (
                <li key={key}>
                  <div className="flex w-full items-start gap-2">
                    <strong>{label}</strong>
                    <p className="flex-1">
                      {Array.isArray(value) ? value.join(', ') : value}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}

interface OverlayProps {
  loading: boolean;
  fetchData: () => Promise<void>;
}

const Overlay = ({ loading, fetchData }: OverlayProps) => (
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
        {loading ? <LoadingSpinner borderColor="border-white" /> : '분석하기'}
      </Button>
    </div>
  </div>
);
