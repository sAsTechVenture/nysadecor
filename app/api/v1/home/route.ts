import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

// GET /api/v1/home - Get all data needed for homepage
export async function GET(request: NextRequest) {
  try {
    // Fetch best seller products
    const bestSellers = await prisma.product.findMany({
      where: { isBestSeller: true },
      take: 3,
      orderBy: { createdAt: 'desc' },
    });

    // Fetch coming soon products
    const comingSoon = await prisma.product.findMany({
      where: { isComingSoon: true },
      take: 2,
      orderBy: { createdAt: 'desc' },
    });

    // Fetch featured projects for gallery
    const featuredProjects = await prisma.project.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
    });

    // Fetch featured blogs
    const featuredBlogs = await prisma.blog.findMany({
      where: { 
        isPublished: true,
        isFeatured: true 
      },
      take: 3,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      bestSellers,
      comingSoon,
      featuredProjects,
      featuredBlogs,
    });
  } catch (error) {
    console.error('Error fetching home data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch home data' },
      { status: 500 }
    );
  }
}
