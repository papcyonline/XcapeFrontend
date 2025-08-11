// src/app/(dashboard)/generate/page.tsx
import ConversationalLeadAgent from '@/components/forms/conversational-lead-agent'

export default function GeneratePage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          AI Lead Generation
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
          Chat with our AI assistant to find your perfect leads
        </p>
      </div>
      
      <ConversationalLeadAgent />
    </div>
  )
}