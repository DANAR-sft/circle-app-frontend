export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-800 rounded-md ${className}`}
    />
  );
}

export function ThreadSkeleton() {
  return (
    <div className="flex flex-row border-b border-gray-200 dark:border-gray-700 p-4">
      <div className="mr-3 shrink-0">
        <Skeleton className="w-10 h-10 rounded-full" />
      </div>
      <div className="flex-1 w-full relative">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="space-y-2 mb-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
        <div className="flex gap-6 mt-4">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="flex flex-row items-center gap-3 w-full border-b border-gray-200 dark:border-gray-700 p-4">
      <div className="flex-shrink-0">
        <Skeleton className="w-10 h-10 rounded-full" />
      </div>
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-48" />
      </div>
      <div className="flex-shrink-0">
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>
    </div>
  );
}
