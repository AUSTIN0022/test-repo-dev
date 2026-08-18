import { Pool } from 'pg'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false },
})

async function main() {
  console.log('Connecting to database and running schema migrations...')
  const client = await pool.connect()
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS organizations (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL DEFAULT 'agency',
        logo_url TEXT,
        email TEXT,
        phone TEXT,
        website TEXT,
        country TEXT,
        region TEXT,
        city TEXT,
        address TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        phone TEXT,
        role TEXT NOT NULL DEFAULT 'owner',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS broker_profiles (
        id TEXT PRIMARY KEY,
        organization_id TEXT,
        full_name TEXT NOT NULL,
        agency_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        bio TEXT NOT NULL,
        license_number TEXT NOT NULL,
        avatar_url TEXT,
        logo_url TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS properties (
        id TEXT PRIMARY KEY,
        organization_id TEXT,
        title TEXT NOT NULL,
        slug TEXT NOT NULL,
        status TEXT NOT NULL,
        property_type TEXT NOT NULL,
        listing_type TEXT NOT NULL,
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        postal_code TEXT NOT NULL,
        latitude DOUBLE PRECISION,
        longitude DOUBLE PRECISION,
        public_location_precision TEXT NOT NULL DEFAULT 'approximate',
        price INTEGER NOT NULL,
        currency TEXT NOT NULL DEFAULT 'USD',
        bedrooms INTEGER NOT NULL,
        bathrooms NUMERIC NOT NULL,
        sqft INTEGER NOT NULL,
        lot_sqft INTEGER,
        year_built INTEGER,
        description TEXT NOT NULL DEFAULT '',
        public_notes TEXT NOT NULL DEFAULT '',
        internal_notes TEXT NOT NULL DEFAULT '',
        contact_name TEXT,
        contact_phone TEXT,
        contact_email TEXT,
        featured BOOLEAN NOT NULL DEFAULT FALSE,
        archived_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `)

    const alterStatements = [
      `ALTER TABLE properties ADD COLUMN IF NOT EXISTS organization_id TEXT`,
      `ALTER TABLE properties ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION`,
      `ALTER TABLE properties ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION`,
      `ALTER TABLE properties ADD COLUMN IF NOT EXISTS public_location_precision TEXT NOT NULL DEFAULT 'approximate'`,
      `ALTER TABLE properties ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT 'USD'`,
      `ALTER TABLE properties ADD COLUMN IF NOT EXISTS contact_name TEXT`,
      `ALTER TABLE properties ADD COLUMN IF NOT EXISTS contact_phone TEXT`,
      `ALTER TABLE properties ADD COLUMN IF NOT EXISTS contact_email TEXT`,
      `ALTER TABLE broker_profiles ADD COLUMN IF NOT EXISTS organization_id TEXT`,
    ]

    for (const stmt of alterStatements) {
      try {
        await client.query(stmt)
      } catch (err) {
        console.error('Alter stmt error:', err)
      }
    }

    await client.query(`
      CREATE TABLE IF NOT EXISTS property_images (
        id TEXT PRIMARY KEY,
        property_id TEXT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
        pathname TEXT NOT NULL,
        alt_text TEXT NOT NULL DEFAULT '',
        sort_order INTEGER NOT NULL DEFAULT 0,
        is_cover BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS property_documents (
        id TEXT PRIMARY KEY,
        property_id TEXT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
        pathname TEXT NOT NULL,
        filename TEXT NOT NULL,
        document_type TEXT NOT NULL DEFAULT 'document',
        is_public BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS property_features (
        id TEXT PRIMARY KEY,
        property_id TEXT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
        feature TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS property_shares (
        id TEXT PRIMARY KEY,
        token TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        expires_at TIMESTAMPTZ,
        revoked_at TIMESTAMPTZ
      );
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS share_properties (
        id TEXT PRIMARY KEY,
        share_id TEXT NOT NULL REFERENCES property_shares(id) ON DELETE CASCADE,
        property_id TEXT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT unique_share_property UNIQUE (share_id, property_id)
      );
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS share_views (
        id TEXT PRIMARY KEY,
        share_id TEXT NOT NULL,
        property_id TEXT NOT NULL,
        session_id TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS property_interest (
        id TEXT PRIMARY KEY,
        share_id TEXT NOT NULL,
        property_id TEXT NOT NULL,
        session_id TEXT NOT NULL,
        response TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT unique_share_property_session UNIQUE (share_id, property_id, session_id)
      );
    `)

    console.log('✅ Database migration completed successfully!')

    // Check if initial broker profile exists, if not seed default profile
    const profileRes = await client.query('SELECT count(*) FROM broker_profiles;')
    if (parseInt(profileRes.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO broker_profiles (id, full_name, agency_name, email, phone, bio, license_number, created_at, updated_at)
        VALUES ('default-broker', 'Alex Morgan', 'Haven Real Estate Group', 'alex@havenrealestate.com', '+1 (555) 234-5678', 'Premier real estate advisor specializing in luxury modern properties and residential homes.', 'RE-987654321', NOW(), NOW());
      `)
      console.log('✅ Seeded default broker profile.')
    }

    // Check if properties exist, if not seed initial properties with coordinates
    const propRes = await client.query('SELECT count(*) FROM properties;')
    if (parseInt(propRes.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO properties (id, title, slug, status, property_type, listing_type, address, city, state, postal_code, latitude, longitude, price, bedrooms, bathrooms, sqft, description, public_notes, internal_notes, featured, created_at, updated_at)
        VALUES
        ('1', 'The Fern House', 'the-fern-house-1', 'published', 'Single family', 'For sale', '1842 Fern Dell Dr', 'Silver Lake', 'CA', '90026', 34.0867, -118.2706, 1485000, 3, 2, 1842, 'A tranquil architectural retreat nestled in the hills of Silver Lake with expansive city views and lush gardens.', 'Quiet neighborhood, walking distance to reservoir.', 'Seller open to quick 30-day escrow.', true, NOW(), NOW()),
        ('2', 'Casa Mariposa', 'casa-mariposa-2', 'published', 'Desert home', 'For sale', '6214 Mariposa Ave', 'Joshua Tree', 'CA', '92252', 34.1347, -116.3131, 895000, 2, 2, 1214, 'Minimalist desert modern residence featuring floor-to-ceiling glass, custom cedar soaking tub, and stargazing deck.', 'Off-grid capabilities available.', 'High short-term rental yields.', true, NOW(), NOW()),
        ('3', 'Oak & Olive', 'oak-and-olive-3', 'published', 'Single family', 'For sale', '412 Olive St', 'Austin', 'TX', '78704', 30.2500, -97.7500, 1125000, 4, 3, 2308, 'Contemporary South Austin masterpiece with heritage oak trees, chef kitchen, and private backyard pool.', 'Top rated school district.', 'Pre-inspected.', true, NOW(), NOW());
      `)
      console.log('✅ Seeded default property listings.')
    }
  } catch (err) {
    console.error('❌ Database migration error:', err)
  } finally {
    client.release()
    await pool.end()
  }
}

main()
