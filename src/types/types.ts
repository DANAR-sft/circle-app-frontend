export interface AlertItem {
  id: string;
  title?: string;
  message: string;
  variant: "default" | "destructive" | "success";
}

export interface AlertContextType {
  showAlert: (
    message: string,
    variant?: "default" | "destructive" | "success",
    title?: string,
  ) => void;
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
}

export interface Iitems {
  title: string;
  url: string;
  icon: any;
}

// export interface ISliceSearch {
//   data: [any] | null;
//   loading: boolean;
//   error: string | null;
// }

export interface ISlice {
  data: any | null;
  dataById?: any | null;
  loading: boolean;
  error: string | null;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;
  } | null;
}

export interface ProfileState {
  profile: any;
  allProfiles: any[];
  profileId: any;
  profileLoading: boolean;
  allProfilesLoading: boolean;
  profileIdLoading: boolean;
  profileError: string | null;
  allProfilesError: string | null;
  profileIdError: string | null;
}

export interface IPostRegister {
  fullname: string;
  username: string;
  email: string;
  password: string;
}

export interface IPostLogin {
  email: string;
  password: string;
}

export interface IThread {
  image?: string | string[] | FileList;
  content: string;
}

export interface IThreadProps {
  id: number;
  image?: string[];
  content: string;
  user: {
    id: number;
    password: string;
    username: string;
    fullname: string;
    photo_profile: string | null;
  };
  createdAt: string;
  likes: number;
  reply: number;
  isliked?: boolean;
  likeId?: number; // ID of the like record for unlike functionality
}

export interface IThreadPostProps {
  avatar: string | null;
  name: string;
}

export interface IThreadByIdWithImgProps {
  id: number;
  image?: string[];
  content: string;
  user: {
    id: number;
    password: string;
    username: string;
    fullname: string;
    photo_profile: string | null;
  };
  createdAt: string;
  likes: number;
  replies: number;
}

export interface IThreadByIdNoImgProps {
  id: number;
  content: string;
  user: {
    id: number;
    password: string;
    username: string;
    fullname: string;
    photo_profile: string | null;
  };
  createdAt: string;
  likes: number;
  reply: number;
}

export interface IReplyProps {
  threadId: number;
  content: string;
  image?: FileList | File;
}

export interface IPostReplyProps {
  fullname: string;
  photo_profile: string | null;
  threadId: number;
  onReplySuccess?: () => void;
}

export interface IReplyColProps {
  id: number;
  content: string;
  image: string | null;
  user: {
    id: number;
    username: string;
    fullname: string;
    photo_profile: string | null;
  };
  createdAt: Date;
}

export interface IProfile {
  id: number;
  username: string;
  name: string;
  avatar: string | null;
  cover: string | null;
  bio: string | null;
  follower_count: number;
  following_count: number;
}

export interface IMediaProfile {
  image?: string[];
}

export interface IUpdatedProfile {
  username: string;
  fullname: string;
  avatar: string | null;
  bio: string | null;
}

export interface FormUpdateProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ModalPostThreadProps {
  avatar: string | null;
  name: string;
  isOpen: boolean;
  onClose: () => void;
}

export interface IFollowListProps {
  isActive: string;
}
