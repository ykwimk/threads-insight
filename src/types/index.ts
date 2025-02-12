export interface ProfileResponseType {
  id: string;
  username: string;
  name: string;
  threads_profile_picture_url: string;
  threads_biography: string;
}

export interface UserInsightsResponseType {
  data: Array<UserInsightsDataType>;
}

export interface UserInsightsDataType {
  name: string;
  period: string;
  value?: Array<UserInsightsValueType>;
  title: string;
  description: string;
  id: string;
  total_value?: UserInsightsValueType;
}

export interface UserInsightsValueType {
  value: number;
  end_time?: string;
}

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
