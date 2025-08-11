export interface User {
  id: string
  email: string
  full_name: string
  company_name?: string
  phone?: string
  bio?: string
  timezone?: string
  avatar_url?: string     // Add this line
  subscription_plan: string
  leads_quota: number
  leads_used: number
  created_at: string
  updated_at: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  full_name: string
  company_name?: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
}