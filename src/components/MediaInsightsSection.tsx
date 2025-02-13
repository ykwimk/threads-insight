import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MediaInsightsDataByIdType, MediaInsightsDataType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import LoadingSpinner from './LoadingSpinner';

const ChartComponent = dynamic(() => import('./Chart'), { ssr: false });

export default function MediaInsightsSection() {
  const [mediaInsights, setMediaInsights] = useState<MediaInsightsDataByIdType>(
    [],
  );
  const [posts, setPosts] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedPostId, setSelectedPostId] = useState<string>('');

  const getInsightValueByName = (
    insights: Array<MediaInsightsDataType>,
    metric: string,
  ) => {
    return (
      insights.find((item: any) => item.name === metric)?.values[0]?.value || 0
    );
  };

  const getMediaTypeLabel = (mediaType: string) => {
    const typeMapping: Record<string, string> = {
      TEXT: '📝 텍스트 게시물',
      IMAGE: '🖼️ 이미지 게시물',
      TEXT_POST: '📝 텍스트 게시물',
      IMAGE_POST: '🖼️ 이미지 게시물',
      VIDEO_POST: '🎥 비디오 게시물',
      CAROUSEL_ALBUM: '📸 캐러셀 게시물',
      REPOST_FACADE: '🔄 리포스트',
    };
    return typeMapping[mediaType] || '❓ 알 수 없음';
  };

  const getSelectedPostId = useMemo(() => {
    return (
      mediaInsights.find((insight) => insight.id === selectedPostId)
        ?.insights || []
    );
  }, [mediaInsights, selectedPostId]);

  const fetchData = async () => {
    setLoading(true);

    try {
      const res = await fetch('/api/dashboard/media-insights');
      const json = await res.json();

      setMediaInsights(json.mediaInsights);
      setPosts(json.posts.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h2 className="mb-4 text-xl font-bold">미디어 인사이트</h2>
      {loading ? (
        <div className="flex items-center justify-center max-md:p-5">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts ? (
            posts.map((post: any) => {
              const insightById = mediaInsights.find(
                (insight) => insight.id === post.id,
              )?.insights;

              if (!insightById) return;

              const views = getInsightValueByName(insightById, 'views');
              const likes = getInsightValueByName(insightById, 'likes');
              const replies = getInsightValueByName(insightById, 'replies');

              return (
                <Card
                  key={post.id}
                  className="cursor-pointer"
                  onClick={() => setSelectedPostId(post.id)}
                >
                  <CardHeader>
                    {post.media_url && (
                      <img
                        src={post.media_url}
                        alt="미디어"
                        className="h-40 w-full rounded-lg object-cover"
                      />
                    )}
                    <span className="text-sm font-medium">
                      {getMediaTypeLabel(post.media_type)}
                    </span>
                    <CardTitle className="mt-2 truncate">{post.text}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>👀 조회수: {views}</p>
                    <p>❤️ 좋아요: {likes}</p>
                    <p>💬 댓글: {replies}</p>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <p className="text-gray-500">해당 데이터를 불러올 수 없습니다.</p>
          )}
        </div>
      )}
      {selectedPostId && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">
            선택한 게시물의 상세 인사이트
          </h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>메트릭</TableHead>
                <TableHead>값</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getSelectedPostId.map((insight: any) => (
                <TableRow key={insight.name}>
                  <TableCell>{insight.title}</TableCell>
                  <TableCell>{insight.values[0]?.value || 0}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="mt-8">
        <h2 className="mb-4 text-xl font-bold">📈 프로필 조회수 변화</h2>
        <ChartComponent data={[]} />
      </div>
    </div>
  );
}
