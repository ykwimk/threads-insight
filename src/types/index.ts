export interface ProfileData {
  id: string;
  username: string;
  name: string;
  threads_profile_picture_url: string;
  threads_biography: string;
}

export interface ErrorData {
  error: {
    message: string;
    type: string;
    code: number;
    fbtrace_id: string;
  };
}

export type ProfileResponse = ProfileData | ErrorData;

export interface UserInsightsResult {
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

export type UserInsightsResponse = UserInsightsResult | ErrorData;

export type FollowerDemographicsResponseType = Array<FollowerDemographicsType>;

export interface FollowerDemographicsType {
  description: string;
  id: string;
  name: string;
  period: string;
  title: string;
  total_value: FollowerDemographicsTotalValueType;
}

export interface FollowerDemographicsTotalValueType {
  breakdowns: Array<FollowerDemographicsBreakdownsType>;
}

export interface FollowerDemographicsBreakdownsType {
  dimension_keys: Array<string>;
  results: Array<FollowerDemographicsResultsType>;
}

export interface FollowerDemographicsResultsType {
  dimension_values: Array<string>;
  value: number;
}

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
