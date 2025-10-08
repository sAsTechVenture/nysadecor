import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

// GET /api/v1/blogs/[id] - Get a single blog by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const blog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await prisma.blog.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog' },
      { status: 500 }
    );
  }
}

// PUT /api/v1/blogs/[id] - Update a blog
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Handle both JSON and FormData
    let body;
    const contentType = request.headers.get('content-type');
    
    if (contentType?.includes('multipart/form-data')) {
      // Handle FormData
      const formData = await request.formData();
      body = {
        title: formData.get('title'),
        slug: formData.get('slug'),
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
      slug,
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

    // Check if blog exists
    const existingBlog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!existingBlog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Check if slug already exists (excluding current blog)
    if (slug && slug !== existingBlog.slug) {
      const slugExists = await prisma.blog.findUnique({
        where: { slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: 'Blog with this slug already exists' },
          { status: 400 }
        );
      }
    }

     // Handle image field - ensure it's a string or null
     let imageUrl = undefined;
     if (image !== undefined) {
       if (typeof image === 'string') {
         imageUrl = image;
       } else if (image instanceof File) {
         // For now, use a placeholder - in production you'd upload to cloud storage
         imageUrl = '/api/placeholder/800/600';
       } else if (image === null) {
         imageUrl = null;
       }
     }

     // Update blog
     const updatedBlog = await prisma.blog.update({
       where: { id },
       data: {
         ...(title && { title }),
         ...(slug && { slug }),
         ...(category && { category }),
         ...(author && { author }),
         ...(excerpt && { excerpt }),
         ...(content !== undefined && { content }),
         ...(imageUrl !== undefined && { image: imageUrl }),
         ...(isPublished !== undefined && { isPublished }),
         ...(isFeatured !== undefined && { isFeatured }),
         ...(tags !== undefined && { tags }),
         ...(metaTitle !== undefined && { metaTitle }),
         ...(metaDescription !== undefined && { metaDescription }),
       },
     });

    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { error: 'Failed to update blog' },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/blogs/[id] - Delete a blog
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if blog exists
    const existingBlog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!existingBlog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Delete blog
    await prisma.blog.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog' },
      { status: 500 }
    );
  }
}
