export interface Post {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string | null;
  author: Author;
  categories: PostCategory[];
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  readingTime: number;
  seoTitle?: string;
  seoDescription?: string;
}

export interface PostCard {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  featuredImage: string | null;
  author: Author;
  categories: PostCategory[];
  publishedAt: string;
  readingTime: number;
}

export interface Author {
  id: number;
  name: string;
  slug: string;
  avatar?: string;
  bio?: string;
}

export interface PostCategory {
  id: number;
  slug: string;
  name: string;
  parent?: number;
}
