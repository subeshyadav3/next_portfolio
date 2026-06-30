export interface Post {
  slug: string;
  title: string;
  description: string;
  content: string;
  published: string;
  updated: string;
  category: string;
  tags: string[];
  author: string;
  authorUrl: string;
  image: string;
  readingTime: number;
  featured: boolean;
  language: "en" | "ne";
}

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  published: string;
  updated: string;
  category: string;
  tags: string[];
  author: string;
  authorUrl: string;
  image: string;
  readingTime: number;
  featured: boolean;
  language: "en" | "ne";
}

export interface Category {
  name: string;
  slug: string;
  count: number;
}

export interface Tag {
  name: string;
  slug: string;
  count: number;
}

export interface ArchiveYear {
  year: string;
  count: number;
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}
