import { MediaInsightsDataType, PostDataType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface Props {
  post: PostDataType;
  insights: Array<MediaInsightsDataType>;
  onCardClick: () => void;
}

export default function PostCard({ post, insights, onCardClick }: Props) {
  const getInsightValueByName = (
    insights: Array<MediaInsightsDataType>,
    metric: string,
  ) => {
    const findInsightValueByMetric = insights.find(
      (insight: MediaInsightsDataType) => insight.name === metric,
    );

    return findInsightValueByMetric?.values[0]?.value || 0;
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

  const views = getInsightValueByName(insights, 'views');
  const likes = getInsightValueByName(insights, 'likes');
  const replies = getInsightValueByName(insights, 'replies');

  return (
    <Card key={post.id} className="cursor-pointer" onClick={onCardClick}>
      <CardHeader>
        {post.media_url && (
          <img
            src={post.media_url}
            alt="미디어"
            className="h-40 w-full rounded-lg object-cover"
          />
        )}
        <span className="text-sm font-medium">
          {getMediaTypeLabel(post.media_type || '')}
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
}
