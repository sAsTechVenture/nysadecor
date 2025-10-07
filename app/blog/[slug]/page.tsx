'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/utils/apiClient';
import { HeroSection } from '@/components/common';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User, Eye, Share2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { colors } from '@/config/theme';

interface Blog {
  id: string;
  title: string;
  slug: string;
  category: string;
  date: string;
  author: string;
  excerpt: string;
  content: string;
  image: string;
  isPublished: boolean;
  isFeatured: boolean;
  viewCount: number;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  createdAt: string;
  updatedAt: string;
}

export default function BlogDetailPage() {
  const params = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!params.slug) return;

      try {
        setLoading(true);
        setError(null);
        
        // For now, we'll fetch by slug through the list API
        // In a real app, you'd have a dedicated endpoint for slug-based fetching
        const res = await api.blogs.list(1, 100, undefined, undefined, true);
        const foundBlog = res.data.find((b: Blog) => b.slug === params.slug);
        
        if (foundBlog) {
          setBlog(foundBlog);
          
          // Fetch related blogs (same category, excluding current)
          const relatedRes = await api.blogs.list(1, 3, undefined, foundBlog.category, true);
          setRelatedBlogs(relatedRes.data.filter((b: Blog) => b.id !== foundBlog.id));
        } else {
          setError('Blog post not found');
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [params.slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryLabel = (category: string) => {
    const categories = {
      'WINDOW_TREATMENTS': 'Window Treatments',
      'INTERIOR_DESIGN': 'Interior Design',
      'HOME_DECOR': 'Home Decor',
      'DIY_TIPS': 'DIY Tips',
      'MAINTENANCE': 'Maintenance',
      'TRENDS': 'Trends',
      'PRODUCT_SPOTLIGHT': 'Product Spotlight',
      'CASE_STUDIES': 'Case Studies',
      'NEWS': 'News',
      'LIFESTYLE': 'Lifestyle',
    };
    return categories[category as keyof typeof categories] || category.replace('_', ' ');
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
          <p className="text-gray-600 mb-8">{error || 'The blog post you\'re looking for doesn\'t exist.'}</p>
          <Button asChild>
            <Link href="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title={blog.title}
        paragraph={blog.excerpt}
        badges={[getCategoryLabel(blog.category), formatDate(blog.date), `${blog.viewCount} views`]}
      />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back Button */}
        <Button
          variant="ghost"
          asChild
          className="mb-8 text-gray-600 hover:text-gray-900 p-0"
        >
          <Link href="/blog">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </Button>

        {/* Blog Image */}
        {blog.image && (
          <div className="mb-8">
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}

        {/* Blog Meta */}
        <div className="mb-8 flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {formatDate(blog.date)}
          </div>
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            {blog.author}
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {blog.viewCount} views
          </div>
          <Badge variant="secondary">
            {getCategoryLabel(blog.category)}
          </Badge>
          {blog.isFeatured && (
            <Badge className="bg-yellow-500 text-white">
              Featured
            </Badge>
          )}
        </div>

        {/* Blog Content */}
        <div className="prose prose-lg max-w-none">
          <div 
            className="text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: blog.content || blog.excerpt }}
          />
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Share Buttons */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Share this post</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Related Posts */}
        {relatedBlogs.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold mb-8">Related Posts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedBlogs.map((relatedBlog) => (
                <Card key={relatedBlog.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {relatedBlog.image && (
                    <div className="relative h-48">
                      <Image
                        src={relatedBlog.image}
                        alt={relatedBlog.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <Badge variant="secondary" className="mb-2">
                      {getCategoryLabel(relatedBlog.category)}
                    </Badge>
                    <h4 className="text-lg font-semibold mb-2 line-clamp-2">
                      {relatedBlog.title}
                    </h4>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {relatedBlog.excerpt}
                    </p>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link href={`/blog/${relatedBlog.slug}`}>
                        Read More
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
