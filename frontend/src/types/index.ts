// Type definitions for the link shortener app

export interface Link {
  id: string;
  short_code: string;
  short_url: string;
  original_url: string;
  created_at: string;
  total_clicks: number;
  unique_clicks: number;
}

export interface Click {
  timestamp: string;
  referrer: string | null;
  user_agent: string;
  is_unique: boolean;
}

export interface ClicksData {
  [shortCode: string]: Click[];
}

export interface StorageData {
  links: Link[];
  clicks: ClicksData;
}

export interface CreateLinkInput {
  original_url: string;
  custom_code?: string;
}

export interface ChartDataPoint {
  date: string;
  clicks: number;
}
