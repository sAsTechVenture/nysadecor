import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

// Helper function to ensure unique slug
async function ensureUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  
  while (true) {
    const existingBlog = await prisma.blog.findUnique({
      where: { slug },
    });
    
    if (!existingBlog) {
      return slug;
    }
    
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

// GET /api/v1/blogs - List blogs with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const published = searchParams.get('published') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (published !== '') {
      where.isPublished = published === 'true';
    }

    // Get blogs and total count
    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.blog.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: blogs,
      total,
      totalPages,
      page,
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

// POST /api/v1/blogs - Create a new blog
export async function POST(request: NextRequest) {
  try {
    // Handle both JSON and FormData
    let body;
    const contentType = request.headers.get('content-type');
    
    if (contentType?.includes('multipart/form-data')) {
      // Handle FormData
      const formData = await request.formData();
      body = {
        title: formData.get('title'),
        category: formData.get('category'),
        author: formData.get('author'),
        excerpt: formData.get('excerpt'),
        content: formData.get('content'),
        image: formData.get('image'),
        isPublished: formData.get('isPublished') === 'true',
        isFeatured: formData.get('isFeatured') === 'true',
        tags: formData.get('tags') ? (formData.get('tags') as string).split(',').map((tag: string) => tag.trim()) : [],
        metaTitle: formData.get('metaTitle'),
        metaDescription: formData.get('metaDescription'),
      };
    } else {
      // Handle JSON
      body = await request.json();
    }
    
    const {
      title,
      category,
      author,
      excerpt,
      content,
      image,
      isPublished,
      isFeatured,
      tags,
      metaTitle,
      metaDescription,
    } = body;

    // Validate required fields
    if (!title || !category || !author || !excerpt) {
      return NextResponse.json(
        { error: 'Missing required fields: title, category, author, and excerpt are required' },
        { status: 400 }
      );
    }

     // Auto-generate slug from title
     const baseSlug = generateSlug(title);
     const slug = await ensureUniqueSlug(baseSlug);

     // Handle image field - ensure it's a string or null
     let imageUrl = null;
     if (image) {
       if (typeof image === 'string') {
         imageUrl = image;
       } else if (image instanceof File) {
         // For now, use a placeholder - in production you'd upload to cloud storage
         imageUrl = '/api/placeholder/800/600';
       }
     }

     // Create blog
     const blog = await prisma.blog.create({
       data: {
         title,
         slug,
         category,
         author,
         excerpt,
         content,
         image: imageUrl,
         isPublished: isPublished || false,
         isFeatured: isFeatured || false,
         tags: tags || [],
         metaTitle,
         metaDescription,
       },
     });

    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { error: 'Failed to create blog' },
      { status: 500 }
    );
  }
}
