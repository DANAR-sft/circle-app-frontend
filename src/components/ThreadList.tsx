import { useEffect, useRef, useCallback } from "react";
import { ThreadSide } from "@/components/ThreadSide";
import { PostThread } from "@/components/PostThread";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { GetThread } from "@/hooks/threadSlice";
import type { IThreadProps } from "@/types/types";
import { ThreadSkeleton } from "@/components/Skeleton";

export function ThreadList() {
  const dispatch = useAppDispatch();
  const threadState = useAppSelector((state) => state.thread);
  const profileState = useAppSelector((state) => state.profile);
  const observerTarget = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(() => {
    if (!threadState.loading && threadState.pagination) {
      const { currentPage, totalPages } = threadState.pagination;
      if (currentPage < totalPages) {
        dispatch(GetThread(currentPage + 1));
      }
    }
  }, [dispatch, threadState.loading, threadState.pagination]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 },
    );

    const target = observerTarget.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [loadMore]);

  if (profileState.profileLoading || !profileState.profile) {
    return (
      <div className="flex flex-col">
        {[1, 2, 3, 4, 5].map((key) => (
          <ThreadSkeleton key={key} />
        ))}
      </div>
    );
  }

  return (
    <>
      <PostThread
        avatar={profileState.profile.avatar}
        name={profileState.profile.name}
      />

      {threadState.loading &&
      (!threadState.data || threadState.data.length === 0) ? (
        <div className="flex flex-col">
          {[1, 2, 3, 4, 5].map((key) => (
            <ThreadSkeleton key={key} />
          ))}
        </div>
      ) : (
        <>
          {threadState.data &&
            Array.isArray(threadState.data) &&
            threadState.data.map((thread: IThreadProps) => (
              <ThreadSide
                key={thread.id}
                id={thread.id}
                image={thread.image}
                content={thread.content}
                user={thread.user}
                createdAt={thread.createdAt}
                likes={thread.likes}
                reply={thread.reply}
                isliked={thread.isliked}
                likeId={thread.likeId}
              />
            ))}

          {/* Scroll observer target */}
          <div
            ref={observerTarget}
            className="py-6 flex justify-center border-t border-gray-200 dark:border-gray-800"
          >
            {threadState.loading &&
              threadState.data &&
              threadState.data.length > 0 && (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500"></div>
              )}
            {!threadState.loading &&
              threadState.pagination &&
              threadState.pagination.currentPage >=
                threadState.pagination.totalPages && (
                <span className="text-sm text-gray-500">
                  You've reached the end
                </span>
              )}
          </div>
        </>
      )}
    </>
  );
}
