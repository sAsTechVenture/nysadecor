import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { uploadImage, deleteImage } from '@/utils/upload';
import { validateAdminAuth } from '@/utils/auth';

// GET /api/v1/products/[id] - Get single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT /api/v1/products/[id] - Update product (service role only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check for admin authentication
    await validateAdminAuth();

    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const price = parseFloat(formData.get('price') as string);
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const isBestSeller = formData.get('isBestSeller') === 'true';
    const isComingSoon = formData.get('isComingSoon') === 'true';
    const image = formData.get('image') as File;

    if (!name || !price || !description || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Handle image upload if provided
    let imageUrl = product.image;
    if (image) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!allowedTypes.includes(image.type) || image.size > maxSize) {
        return NextResponse.json(
          { error: 'Invalid image file. Please upload a valid image (JPEG, PNG, WebP) under 10MB.' },
          { status: 400 }
        );
      }

      // Delete old image if exists
      if (product.image) {
        const oldImagePath = product.image.split('/').slice(-2).join('/'); // Extract path after bucket
        await deleteImage('products', oldImagePath);
      }

      // Upload new image
      const { publicUrl } = await uploadImage(image, 'products', params.id);
      imageUrl = publicUrl;
    }

    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        price,
        description,
        category: category as any,
        image: imageUrl,
        isBestSeller,
        isComingSoon,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/products/[id] - Delete product (service role only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check for admin authentication
    await validateAdminAuth();

    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Delete image from storage if exists
    if (product.image) {
      const imagePath = product.image.split('/').slice(-2).join('/'); // Extract path after bucket
      await deleteImage('products', imagePath);
    }

    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}

// PATCH /api/v1/products/[id] - Toggle product status (service role only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check for admin authentication
    await validateAdminAuth();

    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { isBestSeller, isComingSoon } = body;

    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: {
        ...(isBestSeller !== undefined && { isBestSeller }),
        ...(isComingSoon !== undefined && { isComingSoon }),
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product status:', error);
    return NextResponse.json(
      { error: 'Failed to update product status' },
      { status: 500 }
    );
  }
}
