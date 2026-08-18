import { db } from '@/lib/db'
import { properties, propertyDocuments, propertyFeatures, propertyImages } from '@/lib/property-schema'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const [property] = await db.select().from(properties).where(eq(properties.id, id)).limit(1)

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    const images = await db.select().from(propertyImages).where(eq(propertyImages.propertyId, id))
    const documents = await db.select().from(propertyDocuments).where(eq(propertyDocuments.propertyId, id))
    const features = await db.select().from(propertyFeatures).where(eq(propertyFeatures.propertyId, id))

    const propData = {
      ...property,
      images: images.sort((a, b) => a.sortOrder - b.sortOrder),
      documents,
      features: features.map((f) => f.feature),
    }

    return NextResponse.json({
      success: true,
      property: propData,
      ...propData,
    })
  } catch (error) {
    console.error('Error fetching single property:', error)
    return NextResponse.json({ error: 'Failed to fetch property' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const now = new Date()

    const [existing] = await db.select().from(properties).where(eq(properties.id, id)).limit(1)
    if (!existing) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    const [updated] = await db
      .update(properties)
      .set({
        title: body.title !== undefined ? body.title.trim() : existing.title,
        status: body.status !== undefined ? body.status : existing.status,
        propertyType: body.propertyType !== undefined ? body.propertyType : existing.propertyType,
        listingType: body.listingType !== undefined ? body.listingType : existing.listingType,
        address: body.address !== undefined ? body.address.trim() : existing.address,
        city: body.city !== undefined ? body.city.trim() : existing.city,
        state: body.state !== undefined ? body.state.trim() : existing.state,
        postalCode: body.postalCode !== undefined ? body.postalCode.trim() : existing.postalCode,
        latitude: body.latitude !== undefined ? (body.latitude !== null ? Number(body.latitude) : null) : existing.latitude,
        longitude: body.longitude !== undefined ? (body.longitude !== null ? Number(body.longitude) : null) : existing.longitude,
        price: body.price !== undefined ? Number(body.price) : existing.price,
        bedrooms: body.bedrooms !== undefined ? Number(body.bedrooms) : existing.bedrooms,
        bathrooms: body.bathrooms !== undefined ? String(body.bathrooms) : existing.bathrooms,
        sqft: body.sqft !== undefined ? Number(body.sqft) : existing.sqft,
        lotSqft: body.lotSqft !== undefined ? (body.lotSqft ? Number(body.lotSqft) : null) : existing.lotSqft,
        yearBuilt: body.yearBuilt !== undefined ? (body.yearBuilt ? Number(body.yearBuilt) : null) : existing.yearBuilt,
        description: body.description !== undefined ? body.description : existing.description,
        publicNotes: body.publicNotes !== undefined ? body.publicNotes : existing.publicNotes,
        internalNotes: body.internalNotes !== undefined ? body.internalNotes : existing.internalNotes,
        featured: body.featured !== undefined ? Boolean(body.featured) : existing.featured,
        updatedAt: now,
      })
      .where(eq(properties.id, id))
      .returning()

    // Update images if provided
    if (Array.isArray(body.images)) {
      await db.delete(propertyImages).where(eq(propertyImages.propertyId, id))
      if (body.images.length > 0) {
        const imageRecords = body.images.map((img: any, index: number) => ({
          id: crypto.randomUUID(),
          propertyId: id,
          pathname: typeof img === 'string' ? img : img.pathname,
          altText: img.altText || `${updated.title} image ${index + 1}`,
          sortOrder: index,
          isCover: index === 0,
          createdAt: now,
        }))
        await db.insert(propertyImages).values(imageRecords)
      }
    }

    // Update documents if provided
    if (Array.isArray(body.documents)) {
      await db.delete(propertyDocuments).where(eq(propertyDocuments.propertyId, id))
      if (body.documents.length > 0) {
        const docRecords = body.documents.map((doc: any) => ({
          id: crypto.randomUUID(),
          propertyId: id,
          pathname: typeof doc === 'string' ? doc : doc.pathname,
          filename: doc.filename || 'Document',
          documentType: doc.documentType || 'document',
          isPublic: doc.isPublic !== false,
          createdAt: now,
        }))
        await db.insert(propertyDocuments).values(docRecords)
      }
    }

    // Update features if provided
    if (Array.isArray(body.features)) {
      await db.delete(propertyFeatures).where(eq(propertyFeatures.propertyId, id))
      if (body.features.length > 0) {
        const featureRecords = body.features.map((feat: string) => ({
          id: crypto.randomUUID(),
          propertyId: id,
          feature: feat,
          createdAt: now,
        }))
        await db.insert(propertyFeatures).values(featureRecords)
      }
    }

    const images = await db.select().from(propertyImages).where(eq(propertyImages.propertyId, id))
    const documents = await db.select().from(propertyDocuments).where(eq(propertyDocuments.propertyId, id))
    const features = await db.select().from(propertyFeatures).where(eq(propertyFeatures.propertyId, id))

    return NextResponse.json({
      ...updated,
      images,
      documents,
      features: features.map((f) => f.feature),
    })
  } catch (error) {
    console.error('Error updating property:', error)
    return NextResponse.json({ error: 'Failed to update property' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await db.delete(properties).where(eq(properties.id, id))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting property:', error)
    return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 })
  }
}
