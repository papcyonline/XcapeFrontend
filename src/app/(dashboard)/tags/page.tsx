import { TagsManager } from '@/components/tags/tags-manager'

export default function TagsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          Tags
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
          Organize and categorize your leads with custom tags
        </p>
      </div>
      
      <TagsManager />
    </div>
  )
}