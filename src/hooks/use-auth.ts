import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'

export function useAuth() {
  const store = useAuthStore()

  useEffect(() => {
    store.initialize()
  }, [store])

  return store
}