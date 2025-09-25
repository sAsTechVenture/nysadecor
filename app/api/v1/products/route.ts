import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { uploadImage } from '@/utils/upload';
import { validateAdminAuth } from '@/utils/auth';

// GET /api/v1/products - List all products with pagination, search and category filter
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
        { name: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } },
      ];
    }
    
    if (category) {
      where.category = category;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: products,
      total,
      totalPages,
      page,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/v1/products - Create new product (admin only)
export async function POST(request: NextRequest) {
  try {
    // Check for admin authentication
    await validateAdminAuth();

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const price = parseFloat(formData.get('price') as string);
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const isBestSeller = formData.get('isBestSeller') === 'true';
    const isComingSoon = formData.get('isComingSoon') === 'true';
    const image = formData.get('image') as File;

    if (!name || !price || !description || !category || !image) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate image file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(image.type) || image.size > maxSize) {
      return NextResponse.json(
        { error: 'Invalid image file. Please upload a valid image (JPEG, PNG, WebP) under 10MB.' },
        { status: 400 }
      );
    }

    // Create product first to get ID
    const product = await prisma.product.create({
      data: {
        name,
        price,
        description,
        category: category as any,
        image: '', // Temporary empty string
        isBestSeller,
        isComingSoon,
      },
    });

    // Upload image using the product ID
    const { publicUrl } = await uploadImage(image, 'products', product.id);

    // Update product with the image URL
    const updatedProduct = await prisma.product.update({
      where: { id: product.id },
      data: { image: publicUrl },
    });

    return NextResponse.json(updatedProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
