// src/app/(auth)/layout.tsx
import { ThemeToggle } from '@/components/layout/theme-toggle'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Lead Generation SaaS
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              AI-powered lead generation platform
            </p>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}