import { Eye, Heart, MessageSquare } from 'lucide-react';
import { MediaInsightsDataType, PostDataType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

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

  const views = getInsightValueByName(insights, 'views');
  const likes = getInsightValueByName(insights, 'likes');
  const replies = getInsightValueByName(insights, 'replies');

  return (
    <Card
      key={post.id}
      className="cursor-pointer overflow-hidden shadow-md transition hover:shadow-lg"
      onClick={onCardClick}
    >
      <CardHeader className="relative p-0">
        {post.media_url ? (
          <img
            src={post.media_url}
            alt="미디어"
            className="h-40 w-full object-cover"
          />
        ) : (
          <div className="flex h-40 items-center justify-center bg-gray-100 text-gray-500">
            <span className="text-sm">텍스트 게시물</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="mb-3 line-clamp-2 text-sm font-medium">
          {post.text}
        </CardTitle>
        <div className="flex items-center justify-between text-gray-500">
          <div className="flex items-center space-x-2">
            <Eye size={18} />
            <span className="text-sm">{views}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Heart size={18} />
            <span className="text-sm">{likes}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MessageSquare size={18} />
            <span className="text-sm">{replies}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
