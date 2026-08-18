import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/properties
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const propertyType = searchParams.get('type')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const city = searchParams.get('city')

    const where: any = {}
    if (propertyType && propertyType !== 'all') where.propertyType = propertyType
    if (status && status !== 'all') where.status = status
    if (city && city !== 'all') where.city = { contains: city, mode: 'insensitive' }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { developer: { contains: search, mode: 'insensitive' } },
      ]
    }

    const properties = await prisma.property.findMany({
      where,
      include: {
        images: true,
        documents: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, properties })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST /api/properties - Add New Property
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.title || !body.price) {
      return NextResponse.json({ error: 'title and price are required' }, { status: 400 })
    }

    let org = await prisma.organization.findFirst()

    const slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

    const property = await prisma.property.create({
      data: {
        organizationId: org?.id,
        title: body.title,
        slug,
        propertyType: body.propertyType || 'apartment',
        listingType: body.listingType || 'sale',
        price: parseInt(body.price, 10),
        bedrooms: body.bedrooms ? parseInt(body.bedrooms, 10) : 3,
        bathrooms: body.bathrooms ? parseFloat(body.bathrooms) : 2.5,
        sqft: body.sqft ? parseInt(body.sqft, 10) : 1800,
        address: body.address || 'Golf Course Road',
        city: body.city || 'Gurgaon',
        state: body.state || 'Haryana',
        status: body.status || 'available',
        developer: body.developer || 'DLF',
        description: body.description || 'Luxury property listing',
      },
    })

    if (body.imageUrl) {
      await prisma.propertyImage.create({
        data: {
          propertyId: property.id,
          pathname: body.imageUrl,
          altText: property.title,
          isCover: true,
        },
      })
    }

    return NextResponse.json({ success: true, property })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
