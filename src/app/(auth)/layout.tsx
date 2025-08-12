// src/app/(auth)/layout.tsx
import { ThemeToggle } from '@/components/layout/theme-toggle'
import Image from 'next/image'
import logo from '@/../public/Logo.png'

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
            <div className="mb-4 flex justify-center">
              <Image 
                src={logo} 
                alt="Xcape Leads" 
                width={120} 
                height={40}
                className="h-10 w-auto"
              />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Xcape Leads
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              AI-powered lead Finder
            </p>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}