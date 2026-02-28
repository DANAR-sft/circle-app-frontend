export function ReplyCol({ content, image, user, createdAt }: any) {
  const formatTimeAgo = (dateString: string | Date) => {
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  };

  return (
    <div className="flex gap-3 py-4 border-b border-gray-200 dark:border-gray-700">
      {/* Profile Picture */}
      <img
        src={
          user?.photo_profile
            ? (user.photo_profile?.startsWith('http') ? user.photo_profile : `http://localhost:4000/uploads/${user.photo_profile}`)
            : `https://ui-avatars.com/api/?name=${user?.fullname}`
        }
        alt={user?.fullname}
        className="w-10 h-10 rounded-full object-cover shrink-0"
      />

      {/* Content */}
      <div className="flex-1">
        {/* Header - Username & Time */}
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-black dark:text-white text-sm">
            {user?.fullname}
          </span>
          <span className="text-zinc-500 dark:text-zinc-400 text-sm">
            @{user?.username}
          </span>
          <span className="text-zinc-500 dark:text-zinc-400 text-[10px]">
            •
          </span>
          <span className="text-zinc-500 dark:text-zinc-400 text-sm">
            {formatTimeAgo(createdAt)}
          </span>
        </div>

        {/* Reply Content */}
        <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap mb-2">
          {content}
        </p>

        {/* Image (if any) */}
        {image && (
          <img
            src={(image?.startsWith('http') ? image : `http://localhost:4000/uploads/${image}`)}
            alt="Reply image"
            className="rounded-lg max-w-full max-h-60 object-cover mb-2"
          />
        )}
      </div>
    </div>
  );
}
