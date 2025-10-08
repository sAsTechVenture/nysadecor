import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

// GET /api/v1/home - Get all data needed for homepage
export async function GET() {
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

    // Serialize the data to ensure proper JSON formatting
    const serializedData = {
      bestSellers: bestSellers.map(product => ({
        ...product,
        price: Number(product.price),
        category: product.category as string,
      })),
      comingSoon: comingSoon.map(product => ({
        ...product,
        price: Number(product.price),
        category: product.category as string,
      })),
      featuredProjects: featuredProjects.map(project => ({
        ...project,
        category: project.category as string,
      })),
      featuredBlogs,
    };

    return NextResponse.json(serializedData);
  } catch (error) {
    console.error('Error fetching home data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch home data' },
      { status: 500 }
    );
  }
}
