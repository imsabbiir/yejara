import dbConnect from '@/lib/mongoose';
import Products from '@/models/products';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { categorySlug, subCategorySlug } = params;
  const url = new URL(request.url);
  const excludeId = url.searchParams.get('excludeId');

  if (!categorySlug || !subCategorySlug) {
    return NextResponse.json({ message: 'Missing params' }, { status: 400 });
  }

  await dbConnect();

  const products = await Products.find({
    categorySlug,
    subCategorySlug,
    _id: { $ne: excludeId },
  })
    .limit(5)
    .lean();

  return NextResponse.json(products);
}
