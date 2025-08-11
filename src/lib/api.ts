// src/lib/api.ts
import axios from 'axios'
import type {
  LeadGenerationRequest,
  LeadsFilters,
  LeadsResponse,
  Lead
} from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9876'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const isAuthEndpoint = error.config?.url?.includes('/api/auth/')
      if (!isAuthEndpoint) {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post('/api/auth/login', data).then(res => res.data),
 
  register: (data: { email: string; password: string; full_name: string; company_name?: string }) =>
    api.post('/api/auth/register', data).then(res => res.data),
 
  logout: () =>
    api.post('/api/auth/logout').then(res => res.data),

  getProfile: () =>
    api.get('/api/users/profile').then(res => res.data),
 
  updateProfile: (data: any) =>
    api.put('/api/users/profile', data).then(res => res.data),
}

// User API
export const userApi = {
  getProfile: () =>
    api.get('/api/users/profile').then(res => res.data),
 
  updateProfile: (data: any) =>
    api.put('/api/users/profile', data).then(res => res.data),
 
  getStats: () =>
    api.get('/api/users/stats').then(res => res.data),
}

// Leads API
export const leadsApi = {
  // NEW: Job-based lead generation with progress tracking
  generateJob: (data: LeadGenerationRequest) =>
    api.post('/api/leads/generate-job', data).then(res => res.data),
  
  // NEW: Get job status with progress
  getJobStatus: (jobId: string) =>
    api.get(`/api/leads/job/${jobId}/status`).then(res => res.data),
  
  // NEW: Get user's job history
  getUserJobs: () =>
    api.get('/api/leads/jobs').then(res => res.data),

  // EXISTING: Original lead generation (keep for backward compatibility)
  generate: (data: LeadGenerationRequest) =>
    api.post('/api/leads/generate', data).then(res => res.data),
 
  getGenerationStatus: (id: string) =>
    api.get(`/api/leads/status/${id}`).then(res => res.data),
 
  getAll: (filters?: LeadsFilters) =>
    api.get('/api/leads', { params: filters }).then(res => res.data),
 
  getById: (id: string) =>
    api.get(`/api/leads/${id}`).then(res => res.data),
 
  update: (id: string, data: Partial<any>) =>
    api.put(`/api/leads/${id}`, data).then(res => res.data),
 
  delete: (id: string) =>
    api.delete(`/api/leads/${id}`).then(res => res.data),

  // Tag operations
  getTags: () =>
    api.get('/api/tags').then(res => res.data),
 
  createTag: (data: { name: string; color: string }) =>
    api.post('/api/tags', data).then(res => res.data),
 
  updateTag: (id: string, data: { name: string; color: string }) =>
    api.put(`/api/tags/${id}`, data).then(res => res.data),
 
  deleteTag: (id: string) =>
    api.delete(`/api/tags/${id}`).then(res => res.data),
 
  tagLead: (leadId: string, tagId: string) =>
    api.post(`/api/tags/${tagId}/leads/${leadId}`).then(res => res.data),
 
  untagLead: (leadId: string, tagId: string) =>
    api.delete(`/api/tags/${tagId}/leads/${leadId}`).then(res => res.data),
}

// Analytics API
export const analyticsApi = {
  getOverview: () =>
    api.get('/api/analytics/overview').then(res => res.data),
 
  getStatusDistribution: () =>
    api.get('/api/analytics/status-distribution').then(res => res.data),
 
  getSourceBreakdown: () =>
    api.get('/api/analytics/source-breakdown').then(res => res.data),
 
  getIndustryBreakdown: () =>
    api.get('/api/analytics/industry-breakdown').then(res => res.data),
 
  getDailyStats: (days: number = 7) =>
    api.get('/api/analytics/daily-stats', { params: { days } }).then(res => res.data),
 
  getGeographicDistribution: () =>
    api.get('/api/analytics/geographic-distribution').then(res => res.data),
 
  getScoreDistribution: () =>
    api.get('/api/analytics/score-distribution').then(res => res.data),
 
  getRecentActivity: (limit: number = 5) =>
    api.get('/api/analytics/recent-activity', { params: { limit } }).then(res => res.data),
}

// Keep tagsApi for backward compatibility
export const tagsApi = {
  getAll: () =>
    api.get('/api/tags').then(res => res.data),
 
  create: (data: { name: string; color: string }) =>
    api.post('/api/tags', data).then(res => res.data),
 
  update: (id: string, data: { name: string; color: string }) =>
    api.put(`/api/tags/${id}`, data).then(res => res.data),
 
  delete: (id: string) =>
    api.delete(`/api/tags/${id}`).then(res => res.data),
 
  tagLead: (tagId: string, leadId: string) =>
    api.post(`/api/tags/${tagId}/leads/${leadId}`).then(res => res.data),
 
  untagLead: (tagId: string, leadId: string) =>
    api.delete(`/api/tags/${tagId}/leads/${leadId}`).then(res => res.data),
}