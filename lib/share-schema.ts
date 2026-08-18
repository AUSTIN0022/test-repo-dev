import { boolean, integer, pgTable, text, timestamp, unique } from 'drizzle-orm/pg-core'

export const propertyShares = pgTable('property_shares', {
  id: text('id').primaryKey(),
  token: text('token').notNull().unique(),
  title: text('title').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  revokedAt: timestamp('revoked_at', { withTimezone: true }),
})

export const shareProperties = pgTable('share_properties', {
  id: text('id').primaryKey(),
  shareId: text('share_id').notNull(),
  propertyId: text('property_id').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
}, (table) => ({ pair: unique().on(table.shareId, table.propertyId) }))

export const shareViews = pgTable('share_views', {
  id: text('id').primaryKey(),
  shareId: text('share_id').notNull(),
  propertyId: text('property_id').notNull(),
  sessionId: text('session_id').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
})

export const propertyInterest = pgTable('property_interest', {
  id: text('id').primaryKey(),
  shareId: text('share_id').notNull(),
  propertyId: text('property_id').notNull(),
  sessionId: text('session_id').notNull(),
  response: text('response').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
}, (table) => ({ responseKey: unique().on(table.shareId, table.propertyId, table.sessionId) }))

export type InterestResponse = 'interested' | 'maybe' | 'not_for_me'
