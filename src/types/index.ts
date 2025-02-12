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
