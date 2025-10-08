import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { uploadImage, deleteImage } from '@/utils/upload';
import { validateAdminAuth } from '@/utils/auth';
import { ProjectCategory } from '@prisma/client';

// GET /api/v1/projects/[id] - Get single project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

// PUT /api/v1/projects/[id] - Update project (service role only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check for admin authentication
    await validateAdminAuth();

    const { id } = await params;
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const completedDate = formData.get('completedDate') as string;
    const client = formData.get('client') as string;
    const image = formData.get('image') as File;
    const galleryFiles = formData.getAll('gallery') as File[];

    if (!title || !description || !category || !completedDate || !client) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Handle image uploads if provided
    let imageUrl = project.image;
    let galleryUrls = project.gallery;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (image) {
      if (!allowedTypes.includes(image.type) || image.size > maxSize) {
        return NextResponse.json(
          { error: 'Invalid main image file. Please upload a valid image (JPEG, PNG, WebP) under 10MB.' },
          { status: 400 }
        );
      }

      // Delete old main image if exists
      if (project.image) {
        const oldImagePath = project.image.split('/').slice(-2).join('/'); // Extract path after bucket
        await deleteImage('projects', oldImagePath);
      }

      // Upload new main image
      const { publicUrl } = await uploadImage(image, 'projects', id);
      imageUrl = publicUrl;
    }

    if (galleryFiles.length > 0) {
      for (const file of galleryFiles) {
        if (!allowedTypes.includes(file.type) || file.size > maxSize) {
          return NextResponse.json(
            { error: 'Invalid gallery image file. Please upload valid images (JPEG, PNG, WebP) under 10MB.' },
            { status: 400 }
          );
        }
      }

      // Delete old gallery images if exists
      for (const oldGalleryUrl of project.gallery) {
        const oldImagePath = oldGalleryUrl.split('/').slice(-2).join('/'); // Extract path after bucket
        await deleteImage('projects', oldImagePath);
      }

      // Upload new gallery images
      const newGalleryUrls: string[] = [];
      for (const file of galleryFiles) {
        const { publicUrl } = await uploadImage(file, 'projects', id);
        newGalleryUrls.push(publicUrl);
      }
      galleryUrls = newGalleryUrls;
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        category: category as ProjectCategory,
        completedDate: new Date(completedDate),
        client,
        image: imageUrl,
        gallery: galleryUrls,
      },
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/projects/[id] - Delete project (service role only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check for admin authentication
    await validateAdminAuth();

    const { id } = await params;
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Delete all images from storage
    if (project.image) {
      const imagePath = project.image.split('/').slice(-2).join('/'); // Extract path after bucket
      await deleteImage('projects', imagePath);
    }

    // Delete gallery images
    for (const galleryUrl of project.gallery) {
      const imagePath = galleryUrl.split('/').slice(-2).join('/'); // Extract path after bucket
      await deleteImage('projects', imagePath);
    }

    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
