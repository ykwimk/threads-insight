import { THREADS_API_BASE } from '@/constants';
import {
  FollowerDemographicsResponseType,
  MediaInsightsDataByIdType,
  PostResponseType,
  ProfileResponse,
  UserInsightsResponseType,
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
  userId: string,
  accessToken: string,
): Promise<UserInsightsResponseType> {
  const since = Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60; // 7일 전부터
  const until = Math.floor(Date.now() / 1000); // 현재 시간

  const userParams = new URLSearchParams({
    access_token: accessToken,
    metric: 'views,likes,replies,reposts,quotes,followers_count',
    since: since.toString(),
    until: until.toString(),
  });

  const response = await fetch(
    `${THREADS_API_BASE}/${userId}/threads_insights?${userParams.toString()}`,
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `User Insights API request failed: ${JSON.stringify(errorData)}`,
    );
  }

  const { data } = await response.json();
  return data;
}

// 사용자 인사이트 (follower_demographics)
export async function fetchFollowerDemographics(
  userId: string,
  accessToken: string,
  breakdown?: string,
): Promise<FollowerDemographicsResponseType> {
  const followerParams = new URLSearchParams({
    access_token: accessToken,
    metric: 'follower_demographics',
  });

  if (breakdown) {
    followerParams.append('breakdown', breakdown);
  }

  const response = await fetch(
    `${THREADS_API_BASE}/${userId}/threads_insights?${followerParams.toString()}`,
  );

  if (!response.ok) {
    const errorData = await response.json();
    const message = errorData.error.error_user_msg
      ? JSON.stringify(errorData.error.error_user_msg)
      : `Follower demographics API request failed: ${JSON.stringify(errorData)}`;

    throw new Error(message);
  }

  const { data } = await response.json();
  return data;
}

// 포스트 정보
export async function fetchPostsData(
  userId: string,
  accessToken: string,
  after?: string,
): Promise<PostResponseType> {
  const profileParams = new URLSearchParams({
    fields: 'id,text,media_url,media_type',
    access_token: accessToken,
  });

  if (after) {
    profileParams.append('after', after); // 다음 페이지를 위한 cursor
  }

  const response = await fetch(
    `${THREADS_API_BASE}/${userId}/threads?${profileParams.toString()}`,
  );
  return response.json();
}

// 미디어 인사이트
export async function fetchMediaInsights(
  mediaIds: string[],
  accessToken: string,
  after?: string,
): Promise<MediaInsightsDataByIdType> {
  const mediaParams = new URLSearchParams({
    access_token: accessToken,
    metric: 'likes,replies,views,reposts,quotes,shares',
  });

  if (after) {
    mediaParams.append('after', after); // 다음 페이지를 위한 cursor
  }

  const mediaData: MediaInsightsDataByIdType = [];

  await Promise.all(
    mediaIds.map(async (mediaId: string) => {
      const url = `${THREADS_API_BASE}/${mediaId}/insights?${mediaParams.toString()}`;
      const response = await fetch(url);
      const { data } = await response.json();

      if (response.ok) {
        mediaData.push({ id: mediaId, insights: data });
      } else {
        console.error(`Failed to fetch insights for media ${mediaId}:`, data);
        mediaData.push({ id: null, insights: [] });
      }
    }),
  );

  return mediaData;
}
