import { Eye, Heart, MessageSquare } from 'lucide-react';
import { MediaInsightsData, PostsData } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface Props {
  post: PostsData;
  insights: Array<MediaInsightsData>;
  onCardClick: () => void;
}

export default function PostCard({ post, insights, onCardClick }: Props) {
  const getInsightValueByName = (
    insights: Array<MediaInsightsData>,
    metric: string,
  ) => {
    const findInsightValueByMetric = insights.find(
      (insight: MediaInsightsData) => insight.name === metric,
    );

    return findInsightValueByMetric?.values[0]?.value || 0;
  };

  const views = getInsightValueByName(insights, 'views');
  const likes = getInsightValueByName(insights, 'likes');
  const replies = getInsightValueByName(insights, 'replies');

  return (
    <Card
      key={post.id}
      className="flex h-full cursor-pointer flex-col justify-between overflow-hidden shadow-md transition hover:shadow-lg"
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
          <div className="p-4">
            <p className="line-clamp-[8] text-sm">{post.text}</p>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4">
        {post.media_url && (
          <CardTitle className="mb-3 line-clamp-2 min-h-10 text-sm font-medium">
            {post.text}
          </CardTitle>
        )}
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
