export interface PublishedWork {
  id: string;
  authorId: string;
  authorName: string;
  authorDisplayName?: string;
  title: string;
  description: string;
  content: string;
  wordCount: number;
  createdAt: number;
  updatedAt: number;
  isPublic: boolean;
  tags: string[];
  likes: number;
  likedBy: string[];
  comments: Comment[];
  favorites: number;
  favoritedBy: string[];
  views: number;
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: number;
}

export interface UserProfile {
  id: string;
  displayName: string;
  characterName: string;
  bio: string;
  avatar?: string;
  characterClass?: string;
  followers: string[];
  following: string[];
  totalLikes: number;
  totalWorks: number;
  totalWords: number;
  joinedAt: number;
}

export interface DraftWork {
  id: string;
  title?: string;
  description?: string;
  content: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export type WorkSortType = 'latest' | 'popular' | 'random' | 'wordCount';

export type LeaderboardType = 'works' | 'authors';
