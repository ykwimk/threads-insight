// 에러 처리를 위한 타입 정의
export interface ErrorData {
  error: {
    message: string;
    type: string;
    code: number;
    fbtrace_id: string;
  };
}

// 내 정보
export interface ProfileData {
  id: string;
  username: string;
  name: string;
  threads_profile_picture_url: string;
  threads_biography: string;
}

export type ProfileResponse = ProfileData | ErrorData;

// 사용자 인사이트
export interface UserInsightsResults {
  data: Array<UserInsightsData>;
  paging: {
    next: string;
    previous: string;
  };
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

export type UserInsightsResponse = UserInsightsResults | ErrorData;

// 팔로워들의 인구 통계 정보
export interface FollowerDemographicsResults {
  data: Array<FollowerDemographicsData>;
  paging: {
    next: string;
    previous: string;
  };
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
  | FollowerDemographicsResults
  | ErrorData;

export interface PostResponseType {
  data: Array<PostDataType>;
  paging?: any;
}

export interface PostDataType {
  id: string;
  media_type?: string;
  text?: string;
  media_url?: string;
}

export interface MediaInsightsResponseType {
  data: Array<MediaInsightsDataType>;
}

export interface MediaInsightsDataType {
  name: string;
  period: string;
  values: any; // 임시
  title: string;
  description: string;
  id: string;
}

export type MediaInsightsDataByIdType = Array<{
  id: string | null;
  insights: Array<MediaInsightsDataType>;
}>;
