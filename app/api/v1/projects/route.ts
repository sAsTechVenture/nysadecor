import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { uploadImage } from '@/utils/upload';
import { validateAdminAuth } from '@/utils/auth';

// GET /api/v1/projects - List all projects with pagination, search and category filter
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';

    const skip = (page - 1) * limit;

    // Build where clause for search and category
    const where: any = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } },
        { client: { contains: search, mode: 'insensitive' as const } },
      ];
    }
    
    if (category) {
      where.category = category;
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.project.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: projects,
      total,
      totalPages,
      page,
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST /api/v1/projects - Create new project (service role only)
export async function POST(request: NextRequest) {
  try {
    // Check for admin authentication
    await validateAdminAuth();

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const completedDate = formData.get('completedDate') as string;
    const client = formData.get('client') as string;
    const image = formData.get('image') as File;
    const galleryFiles = formData.getAll('gallery') as File[];

    if (!title || !description || !category || !completedDate || !client || !image) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate main image
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(image.type) || image.size > maxSize) {
      return NextResponse.json(
        { error: 'Invalid main image file. Please upload a valid image (JPEG, PNG, WebP) under 10MB.' },
        { status: 400 }
      );
    }

    // Validate gallery images
    for (const file of galleryFiles) {
      if (!allowedTypes.includes(file.type) || file.size > maxSize) {
        return NextResponse.json(
          { error: 'Invalid gallery image file. Please upload valid images (JPEG, PNG, WebP) under 10MB.' },
          { status: 400 }
        );
      }
    }

    // Create project first to get ID
    const project = await prisma.project.create({
      data: {
        title,
        description,
        category: category as any,
        completedDate: new Date(completedDate),
        client,
        image: '', // Temporary empty string
        gallery: [], // Temporary empty array
      },
    });

    // Upload main image
    const { publicUrl: mainImageUrl } = await uploadImage(image, 'projects', project.id);

    // Upload gallery images
    const galleryUrls: string[] = [];
    for (const file of galleryFiles) {
      const { publicUrl } = await uploadImage(file, 'projects', project.id);
      galleryUrls.push(publicUrl);
    }

    // Update project with image URLs
    const updatedProject = await prisma.project.update({
      where: { id: project.id },
      data: {
        image: mainImageUrl,
        gallery: galleryUrls,
      },
    });

    return NextResponse.json(updatedProject, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
