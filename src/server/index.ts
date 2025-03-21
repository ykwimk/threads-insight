import { THREADS_API_BASE } from '@/constants';
import {
  FollowerDemographicsResponse,
  MediaInsightsResponse,
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

// 포스트 정보
export async function fetchPostsData(
  profileId: string,
  accessToken: string,
  after?: string,
): Promise<PostsResponse> {
  const profileParams = new URLSearchParams({
    fields: 'id,text,media_url,media_type',
    access_token: accessToken,
  });

  if (after) {
    profileParams.append('after', after); // 다음 페이지를 위한 cursor
  }

  const response = await fetch(
    `${THREADS_API_BASE}/${profileId}/threads?${profileParams.toString()}`,
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
export async function fetchConversation(mediaId: string, accessToken: string) {
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
