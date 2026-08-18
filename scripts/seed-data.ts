import { prisma } from '../lib/prisma'

async function main() {
  console.log('🌱 Starting EstateFlow CRM Seed Process...')

  // 1. Create Organization
  const org = await prisma.organization.upsert({
    where: { id: 'org-apex-gurgaon' },
    update: {},
    create: {
      id: 'org-apex-gurgaon',
      name: 'Apex Horizon Realty',
      type: 'agency',
      email: 'contact@apexhorizon.in',
      phone: '+919876543210',
      website: 'https://apexhorizonrealty.in',
      city: 'Gurgaon',
      country: 'India',
      address: 'Suite 402, Two Horizon Center, Golf Course Road, Sector 43, Gurgaon, Haryana 122002',
    },
  })

  console.log('✅ Created Organization:', org.name)

  // 2. Create Users (Roles: Admin, Sales Manager, Sales Agent x 2, Field Executive, Social Media Manager)
  const defaultHash = 'b45c3d2e1f0a9b8c7d6e5f4a3b2c1d0e' // Simple mock hash

  const usersData = [
    {
      id: 'user-admin',
      email: 'admin@apexhorizon.in',
      name: 'Vikramaditya Singhania',
      role: 'admin',
      phone: '+919999000001',
      avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 'user-manager',
      email: 'manager@apexhorizon.in',
      name: 'Ananya Verma',
      role: 'sales_manager',
      phone: '+919999000002',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 'user-agent-1',
      email: 'rohit@apexhorizon.in',
      name: 'Rohit Sharma',
      role: 'sales_agent',
      phone: '+919999000003',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 'user-agent-2',
      email: 'priya@apexhorizon.in',
      name: 'Priya Malhotra',
      role: 'sales_agent',
      phone: '+919999000004',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 'user-field',
      email: 'kabir@apexhorizon.in',
      name: 'Kabir Deshmukh',
      role: 'field_executive',
      phone: '+919999000005',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 'user-social',
      email: 'sneha@apexhorizon.in',
      name: 'Sneha Kapoor',
      role: 'social_media_manager',
      phone: '+919999000006',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    },
  ]

  for (const u of usersData) {
    await prisma.user.upsert({
      where: { id: u.id },
      update: { role: u.role, phone: u.phone, avatarUrl: u.avatarUrl },
      create: {
        id: u.id,
        organizationId: org.id,
        email: u.email,
        name: u.name,
        role: u.role,
        phone: u.phone,
        avatarUrl: u.avatarUrl,
        passwordHash: defaultHash,
      },
    })
  }

  console.log('✅ Created 6 Team Members')

  // 3. Integration Settings
  await prisma.integrationSettings.upsert({
    where: { organizationId: org.id },
    update: { maxCallDurationSeconds: 120, dryRunCall: true, dryRunMessage: true },
    create: {
      organizationId: org.id,
      twilioPhone: '+14155238886',
      whatsappNumber: '+14155238886',
      assignmentMode: 'round_robin',
      maxCallDurationSeconds: 120,
      dryRunCall: true,
      dryRunMessage: true,
      dryRunEmail: true,
    },
  })

  // 4. Create Properties (10 properties in Gurgaon / Delhi NCR)
  const propertiesData = [
    {
      id: 'prop-101',
      title: 'DLF The Aralias Penthouse',
      slug: 'dlf-the-aralias-penthouse',
      propertyType: 'apartment',
      price: 185000000, // 18.5 Cr
      bedrooms: 4,
      bathrooms: 5.0,
      sqft: 5800,
      address: 'Golf Course Road, Sector 42',
      city: 'Gurgaon',
      status: 'available',
      developer: 'DLF Limited',
      description: 'Ultra-luxury golf facing penthouse with private plunge pool, panoramic views of the DLF Golf Course, and bespoke Italian marble finishes.',
      coverImg: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80',
    },
    {
      id: 'prop-102',
      title: 'Emaar MGF Emerald Hills Villa',
      slug: 'emaar-emerald-hills-villa',
      propertyType: 'villa',
      price: 65000000, // 6.5 Cr
      bedrooms: 4,
      bathrooms: 4.5,
      sqft: 3400,
      address: 'Sector 65, Emerald Hills',
      city: 'Gurgaon',
      status: 'available',
      developer: 'Emaar India',
      description: 'Independent 4BHK luxury villa with private landscaped garden, double-height ceiling lounge, smart automation, and private garage.',
      coverImg: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
    },
    {
      id: 'prop-103',
      title: 'M3M Golfestate Sky Residence',
      slug: 'm3m-golfestate-sky-residence',
      propertyType: 'apartment',
      price: 48000000, // 4.8 Cr
      bedrooms: 3,
      bathrooms: 3.5,
      sqft: 2850,
      address: 'Golf Course Extension Road, Sector 65',
      city: 'Gurgaon',
      status: 'available',
      developer: 'M3M India',
      description: 'Resort-style living in Gurgaon. Features 9-hole executive golf course access, 7-tier security, temperature-controlled swimming pool, and sky club.',
      coverImg: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80',
    },
    {
      id: 'prop-104',
      title: 'Godrej Summit 3BHK Residence',
      slug: 'godrej-summit-3bhk',
      propertyType: 'apartment',
      price: 18500000, // 1.85 Cr
      bedrooms: 3,
      bathrooms: 3.0,
      sqft: 1810,
      address: 'Sector 104, Dwarka Expressway',
      city: 'Gurgaon',
      status: 'available',
      developer: 'Godrej Properties',
      description: 'Ready-to-move 3BHK apartment near Dwarka Expressway with modular kitchen, wooden flooring in master bedroom, and clubhouse access.',
      coverImg: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80',
    },
    {
      id: 'prop-105',
      title: 'Sobha City Sector 108 Luxury Flat',
      slug: 'sobha-city-sector-108',
      propertyType: 'apartment',
      price: 24000000, // 2.4 Cr
      bedrooms: 3,
      bathrooms: 3.0,
      sqft: 2073,
      address: 'Sector 108, Near Delhi Border',
      city: 'Gurgaon',
      status: 'hold',
      developer: 'Sobha Limited',
      description: '39-acre grand township with 8.5 acres of urban parkland, 2 clubhouses, half-Olympic size swimming pool, and German construction quality.',
      coverImg: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&auto=format&fit=crop&q=80',
    },
    {
      id: 'prop-106',
      title: 'Cyber City Commercial Executive Suite',
      slug: 'cyber-city-commercial-suite',
      propertyType: 'commercial',
      price: 32000000, // 3.2 Cr
      bedrooms: 0,
      bathrooms: 2.0,
      sqft: 2200,
      address: 'DLF Cyber City, Sector 24',
      city: 'Gurgaon',
      status: 'available',
      developer: 'DLF Limited',
      description: 'Pre-leased grade A commercial office space with 8.5% assured rental yield, fully furnished for MNC tech tenant.',
      coverImg: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80',
    },
    {
      id: 'prop-107',
      title: 'Puri Diplomatic Residences',
      slug: 'puri-diplomatic-residences',
      propertyType: 'apartment',
      price: 39500000, // 3.95 Cr
      bedrooms: 4,
      bathrooms: 4.0,
      sqft: 2950,
      address: 'Sector 111, Dwarka Expressway',
      city: 'Gurgaon',
      status: 'available',
      developer: 'Puri Construction',
      description: 'Air-conditioned luxury apartments with VRV AC, imported marble, oversized balconies, and 25,000 sq.ft. imperial clubhouse.',
      coverImg: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&auto=format&fit=crop&q=80',
    },
    {
      id: 'prop-108',
      title: 'Central Park Resorts Sky Villa',
      slug: 'central-park-resorts-sky-villa',
      propertyType: 'villa',
      price: 110000000, // 11 Cr
      bedrooms: 4,
      bathrooms: 5.0,
      sqft: 4600,
      address: 'Sector 48, Sohna Road',
      city: 'Gurgaon',
      status: 'available',
      developer: 'Central Park',
      description: 'Zero-vehicle ground level resort living with 20-acre lush green park, 5-star concierge services, and private sky elevator.',
      coverImg: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&auto=format&fit=crop&q=80',
    },
    {
      id: 'prop-109',
      title: 'Sushant Lok 1 Gated Plot',
      slug: 'sushant-lok-1-plot',
      propertyType: 'plot',
      price: 52000000, // 5.2 Cr
      bedrooms: 0,
      bathrooms: 0.0,
      sqft: 3600,
      address: 'Phase 1, Near HUDA City Centre',
      city: 'Gurgaon',
      status: 'available',
      developer: 'Ansal API',
      description: '400 sq.yard north-east facing freehold plot in prime Sushant Lok 1. Approved for Stilt + 4 floors construction.',
      coverImg: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop&q=80',
    },
    {
      id: 'prop-110',
      title: 'IEO Grand Hyatt Residences Rental',
      slug: 'grand-hyatt-residences-rental',
      propertyType: 'rental',
      price: 275000, // 2.75 L/month
      bedrooms: 3,
      bathrooms: 3.5,
      sqft: 2600,
      address: 'Golf Course Extension, Sector 58',
      city: 'Gurgaon',
      status: 'available',
      developer: 'IEO & Hyatt',
      description: 'Fully furnished 5-star serviced residence managed by Grand Hyatt. Includes housekeeping, room service, and club membership.',
      coverImg: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop&q=80',
    },
  ]

  for (const p of propertiesData) {
    const prop = await prisma.property.upsert({
      where: { id: p.id },
      update: { title: p.title, price: p.price, status: p.status },
      create: {
        id: p.id,
        organizationId: org.id,
        title: p.title,
        slug: p.slug,
        propertyType: p.propertyType,
        listingType: p.propertyType === 'rental' ? 'rent' : 'sale',
        address: p.address,
        city: p.city,
        state: 'Haryana',
        postalCode: '122001',
        price: p.price,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        sqft: p.sqft,
        status: p.status,
        developer: p.developer,
        description: p.description,
      },
    })

    await prisma.propertyImage.deleteMany({ where: { propertyId: prop.id } })
    await prisma.propertyImage.create({
      data: {
        propertyId: prop.id,
        pathname: p.coverImg,
        altText: p.title,
        isCover: true,
        sortOrder: 0,
      },
    })
  }

  console.log('✅ Created 10 High-Quality Real Estate Properties')

  // 5. Create 20 Leads from 36 Acre, MagicBricks, Housing, Facebook Ads, etc.
  const leadsData = [
    {
      id: 'lead-201',
      fullName: 'Rahul Sharma',
      phone: '+919811223344',
      email: 'rahul.sharma@gmail.com',
      source: '36 Acre',
      propertyType: 'apartment',
      budgetMin: 7500000,
      budgetMax: 12000000,
      preferredLocation: 'Golf Course Road, Gurgaon',
      status: 'new',
      temperature: 'hot',
      assignedAgentId: 'user-agent-1',
      notes: 'Urgent requirement. Looking for 3BHK ready to move near Horizon Center.',
    },
    {
      id: 'lead-202',
      fullName: 'Vikram Oberoi',
      phone: '+919877665544',
      email: 'v.oberoi@yahoo.com',
      source: 'MagicBricks',
      propertyType: 'villa',
      budgetMin: 45000000,
      budgetMax: 70000000,
      preferredLocation: 'Golf Course Extension Road',
      status: 'interested',
      temperature: 'hot',
      assignedAgentId: 'user-agent-2',
      notes: 'Wants independent villa with private lawn. Prefers Emaar or M3M.',
    },
    {
      id: 'lead-203',
      fullName: 'Meera Chawla',
      phone: '+919988776655',
      email: 'meera.chawla@techcorp.io',
      source: 'Housing',
      propertyType: 'apartment',
      budgetMin: 15000000,
      budgetMax: 22000000,
      preferredLocation: 'Dwarka Expressway',
      status: 'site_visit_scheduled',
      temperature: 'hot',
      assignedAgentId: 'user-agent-1',
      notes: 'Site visit booked for Saturday 11 AM at Godrej Summit.',
    },
    {
      id: 'lead-204',
      fullName: 'Amitabh Bansal',
      phone: '+919822334455',
      email: 'bansal.investments@gmail.com',
      source: 'Facebook',
      propertyType: 'commercial',
      budgetMin: 30000000,
      budgetMax: 50000000,
      preferredLocation: 'Cyber City',
      status: 'negotiation',
      temperature: 'hot',
      assignedAgentId: 'user-agent-2',
      notes: 'Commercial investor. Negotiating lease yield on Cyber City executive suite.',
    },
    {
      id: 'lead-205',
      fullName: 'Kavita Sundaram',
      phone: '+919766554433',
      email: 'kavita.sundaram@gmail.com',
      source: 'Instagram',
      propertyType: 'apartment',
      budgetMin: 35000000,
      budgetMax: 45000000,
      preferredLocation: 'Sector 65',
      status: 'contacted',
      temperature: 'warm',
      assignedAgentId: 'user-agent-1',
      notes: 'Saw Instagram Reel for M3M Golfestate. Shared property brochure via WhatsApp.',
    },
    {
      id: 'lead-206',
      fullName: 'Rajesh Mehra',
      phone: '+919833445566',
      email: 'rmehra.delhi@gmail.com',
      source: 'Website',
      propertyType: 'plot',
      budgetMin: 40000000,
      budgetMax: 60000000,
      preferredLocation: 'Sushant Lok 1',
      status: 'interested',
      temperature: 'warm',
      assignedAgentId: 'user-agent-2',
      notes: 'Interested in Sushant Lok 400 sq.yd plot. Asking for clear title docs.',
    },
    {
      id: 'lead-207',
      fullName: 'Siddharth Roy',
      phone: '+919911445566',
      email: 'siddharth.roy@consulting.com',
      source: 'Referral',
      propertyType: 'rental',
      budgetMin: 200000,
      budgetMax: 300000,
      preferredLocation: 'Sector 58',
      status: 'won',
      temperature: 'hot',
      assignedAgentId: 'user-agent-1',
      notes: 'Deal Closed! Leased Hyatt Residence at 2.75L/mo.',
    },
    {
      id: 'lead-208',
      fullName: 'Pooja Gupta',
      phone: '+919844556677',
      email: 'pooja.gupta88@gmail.com',
      source: '36 Acre',
      propertyType: 'apartment',
      budgetMin: 20000000,
      budgetMax: 28000000,
      preferredLocation: 'Sector 108',
      status: 'new',
      temperature: 'warm',
      assignedAgentId: 'user-agent-2',
      notes: 'Inquired from 36 Acre webhook. Instant call bridge scheduled.',
    },
    {
      id: 'lead-209',
      fullName: 'Harish Nambiar',
      phone: '+919711223355',
      email: 'hnambiar@nambiar-group.com',
      source: 'MagicBricks',
      propertyType: 'villa',
      budgetMin: 80000000,
      budgetMax: 120000000,
      preferredLocation: 'Sohna Road',
      status: 'interested',
      temperature: 'hot',
      assignedAgentId: 'user-agent-1',
      notes: 'Looking for Central Park Sky Villa. Wants private weekend viewing.',
    },
    {
      id: 'lead-210',
      fullName: 'Divya Aggarwal',
      phone: '+919877112233',
      email: 'divya.aggarwal@designstudio.in',
      source: 'Housing',
      propertyType: 'apartment',
      budgetMin: 16000000,
      budgetMax: 20000000,
      preferredLocation: 'Dwarka Expressway',
      status: 'not_responding',
      temperature: 'cold',
      assignedAgentId: 'user-agent-2',
      notes: 'Sent 3 WhatsApp follow-ups. No response yet.',
    },
  ]

  for (const l of leadsData) {
    await prisma.lead.upsert({
      where: { id: l.id },
      update: { status: l.status, temperature: l.temperature },
      create: {
        id: l.id,
        organizationId: org.id,
        fullName: l.fullName,
        phone: l.phone,
        email: l.email,
        source: l.source,
        propertyType: l.propertyType,
        budgetMin: l.budgetMin,
        budgetMax: l.budgetMax,
        preferredLocation: l.preferredLocation,
        status: l.status,
        temperature: l.temperature,
        assignedAgentId: l.assignedAgentId,
        notes: l.notes,
        lastContactedAt: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000),
      },
    })

    // Seed Activity log for lead
    await prisma.activity.create({
      data: {
        leadId: l.id,
        userId: l.assignedAgentId,
        type: 'status_change',
        title: `Lead Intake from ${l.source}`,
        details: `Assigned to agent. Status: ${l.status.toUpperCase()}`,
      },
    })
  }

  console.log('✅ Created 10 Realistic Real Estate Leads with Activity Logs')

  // 6. Create Calls, Followups, Attendance, Social Posts
  await prisma.call.create({
    data: {
      organizationId: org.id,
      leadId: 'lead-201',
      agentId: 'user-agent-1',
      status: 'completed',
      duration: 115,
      outcome: 'Connected - Lead confirmed 3BHK requirement on Golf Course Road',
      recordingUrl: 'https://demo-recordings.estateflow.app/samples/call-bridge-201.mp3',
    },
  })

  await prisma.followup.create({
    data: {
      organizationId: org.id,
      leadId: 'lead-203',
      agentId: 'user-agent-1',
      type: 'site_visit',
      note: 'Escort Ms. Meera Chawla for site visit at Godrej Summit',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      status: 'pending',
    },
  })

  await prisma.attendance.create({
    data: {
      organizationId: org.id,
      userId: 'user-agent-1',
      checkInTime: new Date(Date.now() - 4 * 60 * 60 * 1000),
      checkInLatitude: 28.4595,
      checkInLongitude: 77.0266,
      checkInLocation: 'Golf Course Road Office, Gurgaon',
      status: 'present',
      notes: 'Morning site visit prep',
    },
  })

  await prisma.socialPost.create({
    data: {
      organizationId: org.id,
      authorId: 'user-social',
      postType: 'instagram_reel',
      caption: '🔥 5 Luxury Penthouses in Gurgaon under 20 Cr! Tap to watch full walkthrough video 🎬 #EstateFlow #GolfCourseRoad #LuxuryHomes',
      status: 'scheduled',
      scheduledAt: new Date(Date.now() + 12 * 60 * 60 * 1000),
    },
  })

  console.log('🚀 EstateFlow CRM Seed Completed Successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
