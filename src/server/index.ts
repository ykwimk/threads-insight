import { THREADS_API_BASE } from '@/constants';
import {
  ConversationResponse,
  FollowerDemographicsResponse,
  MediaInsightsResponse,
  PostResponse,
  PostsResponse,
  ProfileResponse,
  UserInsightsResponse,
} from '@/types';

// 내 정보
export async function fetchProfileData(
  accessToken: string,
): Promise<ProfileResponse> {
  const profileParams = new URLSearchParams({
    fields: 'id,username,name,threads_profile_picture_url,threads_biography',
    access_token: accessToken,
  });

  const response = await fetch(
    `${THREADS_API_BASE}/me/?${profileParams.toString()}`,
  );
  return response.json();
}

// 사용자 인사이트
export async function fetchUserInsights(
  profileId: string,
  accessToken: string,
): Promise<UserInsightsResponse> {
  const since = Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60; // 7일 전부터
  const until = Math.floor(Date.now() / 1000); // 현재 시간

  const userParams = new URLSearchParams({
    metric: 'views,likes,replies,reposts,quotes,followers_count',
    access_token: accessToken,
    since: since.toString(),
    until: until.toString(),
  });

  const response = await fetch(
    `${THREADS_API_BASE}/${profileId}/threads_insights?${userParams.toString()}`,
  );
  return response.json();
}

// 사용자 인사이트 (follower_demographics)
export async function fetchFollowerDemographics(
  profileId: string,
  accessToken: string,
  breakdown?: string,
): Promise<FollowerDemographicsResponse> {
  const followerParams = new URLSearchParams({
    metric: 'follower_demographics',
    access_token: accessToken,
  });

  if (breakdown) {
    followerParams.append('breakdown', breakdown);
  }

  const response = await fetch(
    `${THREADS_API_BASE}/${profileId}/threads_insights?${followerParams.toString()}`,
  );
  return response.json();
}

// 포스트 리스트
export async function fetchPosts(
  profileId: string,
  accessToken: string,
  after?: string,
): Promise<PostsResponse> {
  const postsParams = new URLSearchParams({
    fields: 'id,text,media_type,media_url,timestamp,children',
    access_token: accessToken,
  });

  if (after) {
    postsParams.append('after', after); // 다음 페이지를 위한 cursor
  }

  const response = await fetch(
    `${THREADS_API_BASE}/${profileId}/threads?${postsParams.toString()}`,
  );
  return response.json();
}

// 포스트 상세
export async function fetchPost(
  mediaId: string,
  accessToken: string,
): Promise<PostResponse> {
  const postParams = new URLSearchParams({
    fields: 'id,media_url',
    access_token: accessToken,
  });

  const response = await fetch(
    `${THREADS_API_BASE}/${mediaId}?${postParams.toString()}`,
  );
  return response.json();
}

// 미디어 인사이트
export async function fetchMediaInsights(
  mediaId: string,
  accessToken: string,
  after?: string,
): Promise<MediaInsightsResponse> {
  const mediaParams = new URLSearchParams({
    metric: 'likes,replies,views,reposts,quotes,shares',
    access_token: accessToken,
  });

  if (after) {
    mediaParams.append('after', after); // 다음 페이지를 위한 cursor
  }

  const response = await fetch(
    `${THREADS_API_BASE}/${mediaId}/insights?${mediaParams.toString()}`,
  );
  return response.json();
}

// 대화 (댓글 & 대댓글)
export async function fetchConversation(
  mediaId: string,
  accessToken: string,
): Promise<ConversationResponse> {
  const params = new URLSearchParams({
    fields:
      'id,text,timestamp,media_type,username,permalink,has_replies,replied_to,is_reply,hide_status',
    reverse: 'false',
    access_token: accessToken,
  });

  const response = await fetch(
    `${THREADS_API_BASE}/${mediaId}/conversation?${params.toString()}`,
  );
  return response.json();
}
