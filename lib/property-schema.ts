import { boolean, doublePrecision, integer, numeric, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const organizations = pgTable('organizations', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type').notNull().default('agency'),
  logoUrl: text('logo_url'),
  email: text('email'),
  phone: text('phone'),
  website: text('website'),
  country: text('country'),
  region: text('region'),
  city: text('city'),
  address: text('address'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
})

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull(),
  phone: text('phone'),
  role: text('role').notNull().default('owner'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
})

export const brokerProfiles = pgTable('broker_profiles', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id'),
  fullName: text('full_name').notNull(),
  agencyName: text('agency_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  bio: text('bio').notNull(),
  licenseNumber: text('license_number').notNull(),
  avatarUrl: text('avatar_url'),
  logoUrl: text('logo_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
})

export const properties = pgTable('properties', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id'),
  title: text('title').notNull(),
  slug: text('slug').notNull(),
  status: text('status').notNull(),
  propertyType: text('property_type').notNull(),
  listingType: text('listing_type').notNull(),
  address: text('address').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  postalCode: text('postal_code').notNull(),
  latitude: doublePrecision('latitude'),
  longitude: doublePrecision('longitude'),
  publicLocationPrecision: text('public_location_precision').notNull().default('approximate'),
  price: integer('price').notNull(),
  currency: text('currency').notNull().default('USD'),
  bedrooms: integer('bedrooms').notNull(),
  bathrooms: numeric('bathrooms').notNull(),
  sqft: integer('sqft').notNull(),
  lotSqft: integer('lot_sqft'),
  yearBuilt: integer('year_built'),
  description: text('description').notNull(),
  publicNotes: text('public_notes').notNull(),
  internalNotes: text('internal_notes').notNull(),
  contactName: text('contact_name'),
  contactPhone: text('contact_phone'),
  contactEmail: text('contact_email'),
  featured: boolean('featured').notNull(),
  archivedAt: timestamp('archived_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
})

export const propertyImages = pgTable('property_images', {
  id: text('id').primaryKey(),
  propertyId: text('property_id').notNull(),
  pathname: text('pathname').notNull(),
  altText: text('alt_text').notNull(),
  sortOrder: integer('sort_order').notNull(),
  isCover: boolean('is_cover').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
})

export const propertyDocuments = pgTable('property_documents', {
  id: text('id').primaryKey(),
  propertyId: text('property_id').notNull(),
  pathname: text('pathname').notNull(),
  filename: text('filename').notNull(),
  documentType: text('document_type').notNull(),
  isPublic: boolean('is_public').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
})

export const propertyFeatures = pgTable('property_features', {
  id: text('id').primaryKey(),
  propertyId: text('property_id').notNull(),
  feature: text('feature').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
})


