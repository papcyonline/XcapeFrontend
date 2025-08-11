// src/app/auth/callback/page.tsx
"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth-store'

export default function AuthCallback() {
  const router = useRouter()
  const { setUser } = useAuthStore()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          router.push('/login?error=auth_failed')
          return
        }

        if (data.session) {
          const user = data.session.user
          
          // Store token in localStorage
          localStorage.setItem('token', data.session.access_token)
          
          // Create user object for the store
          const userProfile = {
            id: user.id,
            email: user.email!,
            full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
            company_name: user.user_metadata?.company_name || null,
            subscription_plan: 'free',
            leads_quota: 100,
            leads_used: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          
          // Set user in store
          setUser(userProfile)
          
          // Redirect to dashboard
          router.push('/dashboard')
        } else {
          router.push('/login')
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        router.push('/login?error=auth_failed')
      }
    }

    handleAuthCallback()
  }, [router, setUser])

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="text-gray-600">Completing sign in...</span>
      </div>
    </div>
  )
}