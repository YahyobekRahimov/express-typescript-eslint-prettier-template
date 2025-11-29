// User Management Types
export interface UserResponse {
  id: number;
  username: string;
  role: "admin" | "staff";
  created_at: Date | null;
  updated_at: Date | null;
}

// Delegate Types
export interface DelegateResponse {
  id: number;
  badge_id: string;
  name: string;
  email: string | null;
  job_title: string | null;
  company_name: string | null;
  created_at: Date | null;
}

// Startup Types
export interface StartupResponse {
  id: number;
  name: string;
  email: string | null;
  description: string | null;
  industry: string | null;
  booth_number: string | null;
  created_at: Date | null;
}

// Recommendation Types
export interface RecommendationResponse {
  id: number;
  delegate_id: number | null;
  startup_id: number | null;
  is_visited: boolean | null;
  visited_at: Date | null;
  delegate_name?: string;
  startup_name?: string;
}

export interface RecommendationWithStartupResponse {
  id: number;
  delegate_id: number | null;
  startup_id: number;
  is_visited: boolean | null;
  visited_at: Date | null;
  startup_name: string;
  email: string | null;
  description: string | null;
  industry: string | null;
  booth_number: string | null;
}

// Scan Log Types
export interface ScanLogResponse {
  id: number;
  staff_user_id: number | null;
  delegate_id: number | null;
  scan_time: Date | null;
  staff_username?: string;
  delegate_name?: string;
}

// Analytics Types
export interface DashboardStatsResponse {
  totalDelegates: number;
  totalStartups: number;
  totalRecommendations: number;
  visitedRecommendations: number;
  totalScans: number;
  totalStaffMembers: number;
  visitationRate: string;
}

export interface DelegateAnalyticsResponse {
  delegate: {
    id: number;
    name: string;
    email: string | null;
    job_title: string | null;
    company_name: string | null;
  };
  stats: {
    totalRecommendations: number;
    visitedCount: number;
    visitationRate: string;
  };
  recommendations: {
    id: number;
    startup_id: number | null;
    is_visited: boolean | null;
    visited_at: Date | null;
    startup_name: string | null;
    booth_number: string | null;
  }[];
}

export interface TopStartupResponse {
  id: number;
  name: string;
  booth_number: string | null;
  recommendation_count: number;
  visit_count: number;
}

// Generic API Response Types
export interface ApiSuccessResponse<T> {
  success: true;
  message?: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
