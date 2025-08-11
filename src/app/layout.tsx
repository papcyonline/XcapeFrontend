
import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/layout/theme-provider'

export const metadata: Metadata = {
  title: 'Xcape Leads Generator',
  description: 'AI-powered lead generation and management platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Ropa+Sans:ital,wght@0,400;1,400&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="font-ropa" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}