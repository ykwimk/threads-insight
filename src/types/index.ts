// 에러 데이터
export interface ErrorData {
  error: {
    message: string;
    type: string;
    code: number;
    fbtrace_id: string;
  };
}

// 페이징 커서
export interface Cursors {
  before: string;
  after: string;
}

// 페이징
export interface Paging {
  cursors: Cursors;
  next: string;
  previous: string;
}

// API 응답
export type ApiResponse<T> = T | ErrorData;

// 내 정보
export interface ProfileData {
  id: string;
  username: string;
  name: string;
  threads_profile_picture_url: string;
  threads_biography: string;
}

export type ProfileResponse = ApiResponse<ProfileData>;

// 사용자 인사이트
export interface UserInsightsResults {
  data: Array<UserInsightsData>;
  paging: Pick<Paging, 'next' | 'previous'>;
}

export interface UserInsightsData {
  name: string;
  period: string;
  values?: Array<UserInsightsValues>;
  title: string;
  description: string;
  id: string;
  total_value?: UserInsightsValues;
}

export interface UserInsightsValues {
  value: number;
  end_time?: string;
}

export type UserInsightsResponse = ApiResponse<UserInsightsResults>;

// 팔로워들의 인구 통계 정보
export interface FollowerDemographicsResults {
  data: Array<FollowerDemographicsData>;
  paging: Pick<Paging, 'next' | 'previous'>;
}

export interface FollowerDemographicsData {
  description: string;
  id: string;
  name: string;
  period: string;
  title: string;
  total_value: FollowerDemographicsTotalValue;
}

export interface FollowerDemographicsTotalValue {
  breakdowns: Array<FollowerDemographicsBreakdowns>;
}

export interface FollowerDemographicsBreakdowns {
  dimension_keys: Array<string>;
  results: Array<FollowerDemographicsBreakdownsResults>;
}

export interface FollowerDemographicsBreakdownsResults {
  dimension_values: Array<string>;
  value: number;
}

export type FollowerDemographicsResponse =
  ApiResponse<FollowerDemographicsResults>;

// 포스트 정보
export interface PostsResults {
  data: Array<PostsData>;
  paging: Pick<Paging, 'cursors'> & Partial<Pick<Paging, 'next' | 'previous'>>;
}

export interface PostsData {
  id: string;
  text?: string;
  media_type?: string;
  media_url?: string;
  timestamp: string;
  children?: {
    data?: Array<{ id: string }>;
  };
}

export type PostsResponse = ApiResponse<PostsResults>;

// 미디어 인사이트
export interface MediaInsightsResults {
  data: Array<MediaInsightsData>;
}

export interface MediaInsightsData {
  name: string;
  period: string;
  values: Array<MediaInsightsValues>;
  title: string;
  description: string;
  id: string;
}

export interface MediaInsightsValues {
  value: number | string;
}

export type MediaInsightsResponse = ApiResponse<MediaInsightsResults>;

export type MediaInsightsDataById = Array<{
  id: string | null;
  insights: Array<MediaInsightsData>;
}>;

// 대화 (댓글 & 대댓글)
export interface ConversationResults {
  data: Array<ConversationData>;
  paging: Pick<Paging, 'cursors'>;
}

export interface ConversationData
  extends Required<{ children: Array<ConversationData> }> {
  id: string;
  text: string;
  timestamp: string;
  media_type: string;
  permalink: string;
  has_replies: boolean;
  root_post: { id: string };
  replied_to: { id: string };
  is_reply: boolean;
  hide_status: string;
  username: string;
}

export type ConversationResponse = ApiResponse<ConversationResults>;
