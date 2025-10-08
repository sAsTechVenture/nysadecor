import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { validateAdminAuth } from '@/utils/auth';

// GET /api/v1/enquiries/[id] - Get single enquiry
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const enquiry = await prisma.enquiryForm.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!enquiry) {
      return NextResponse.json(
        { error: 'Enquiry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(enquiry);
  } catch (error) {
    console.error('Error fetching enquiry:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enquiry' },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/enquiries/[id] - Delete enquiry (service role only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check for admin authentication
    await validateAdminAuth();

    const { id } = await params;
    const enquiry = await prisma.enquiryForm.findUnique({
      where: { id },
    });

    if (!enquiry) {
      return NextResponse.json(
        { error: 'Enquiry not found' },
        { status: 404 }
      );
    }

    await prisma.enquiryForm.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Enquiry deleted successfully' });
  } catch (error) {
    console.error('Error deleting enquiry:', error);
    return NextResponse.json(
      { error: 'Failed to delete enquiry' },
      { status: 500 }
    );
  }
}
