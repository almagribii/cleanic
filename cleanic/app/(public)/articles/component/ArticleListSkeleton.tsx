import React from "react";

const SkeletonArticleCard: React.FC = () => (
  <div
    className="group flex flex-col rounded-3xl bg-card shadow-lg border border-border 
             overflow-hidden animate-pulse h-[450px]"
  >
    <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-700">
      <div className="absolute bottom-0 left-0 p-4">
        <span className="inline-flex items-center gap-1 text-xs font-semibold bg-gray-300 dark:bg-gray-600 h-6 w-24 rounded-full"></span>
      </div>
    </div>

    <div className="p-6 md:p-7 flex flex-col grow">
      <div className="flex items-center text-sm font-medium mb-3">
        <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
      </div>
      <div className="h-6 w-full bg-gray-300 dark:bg-gray-600 rounded mb-3"></div>
      <div className="h-6 w-3/4 bg-gray-300 dark:bg-gray-600 rounded mb-3"></div>
      <div className="grow space-y-2 mb-5">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-11/12"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-10/12"></div>
      </div>
      <div className="mt-auto pt-4 border-t border-border/70">
        <div className="h-4 w-32 bg-primary/50 rounded"></div>
      </div>
    </div>
  </div>
);

export const ArticleListSkeleton: React.FC = () => {
  const skeletonCount = 6;
  return (
    <section className="pt-30 py-16 bg-background min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-pulse">
          <div className="inline-flex h-8 w-48 bg-primary/10 rounded-full mx-auto"></div>
          <div className="h-10 w-2/3 max-w-lg bg-gray-300 dark:bg-gray-700 rounded mx-auto mt-4"></div>
          <div className="h-6 w-1/2 max-w-md bg-gray-200 dark:bg-gray-600 rounded mx-auto mt-3"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <SkeletonArticleCard key={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
