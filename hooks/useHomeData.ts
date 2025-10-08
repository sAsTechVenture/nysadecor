import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  isBestSeller: boolean;
  isComingSoon: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  gallery: string[];
  category: string;
  completedDate: string;
  client: string;
  createdAt: string;
  updatedAt: string;
}

interface Blog {
  id: string;
  title: string;
  slug: string;
  category: string;
  date: string;
  author: string;
  excerpt: string;
  content?: string;
  image?: string;
  isPublished: boolean;
  isFeatured: boolean;
  viewCount: number;
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

interface HomeData {
  bestSellers: Product[];
  comingSoon: Product[];
  featuredProjects: Project[];
  featuredBlogs: Blog[];
}

export const useHomeData = () => {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/v1/home');
        
        if (!response.ok) {
          throw new Error('Failed to fetch home data');
        }
        
        const homeData = await response.json();
        setData(homeData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return { data, loading, error };
};
