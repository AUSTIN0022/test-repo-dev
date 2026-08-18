# Real Estate Property Hub — MVP Product Requirements Document

**Document Type:** Product Requirements Document  
**Product Stage:** MVP  
**Platform:** Progressive Web App (PWA)  
**Primary Users:** Real Estate Brokers, Individual Agents, Real Estate Companies  
**Primary Goal:** Centralize property information and make property sharing dramatically faster and more organized.  
**Future Direction:** AI-powered real estate operating system with agentic workflows, calling agents, voice agents, lead management, and automated follow-ups.

---

# 1. Executive Summary

## 1.1 Product Overview

The product is a **mobile-first Progressive Web App for real estate brokers and real estate companies** that provides a single centralized place to store, organize, manage, and share property listings.

The core problem is simple:

> Real estate professionals have dozens or hundreds of properties distributed across their phone gallery, WhatsApp conversations, PDFs, documents, notes, spreadsheets, and cloud storage.

When a client asks:

> "Do you have a 3-bedroom apartment in New York City with parking?"

The broker often has to manually search through photographs, WhatsApp chats, PDFs, folders, and notes before sending the relevant information.

The MVP turns that fragmented workflow into:

**Store → Organize → Search → Select → Share**

A broker creates an account, creates their business/agent profile, uploads property listings, attaches photos and documents, categorizes the properties, and then shares individual or multiple properties through the device's native sharing mechanism.

The application does **not** directly integrate with WhatsApp, SMS, Telegram, email, or other communication platforms in the MVP.

Instead, it uses the browser/PWA's **native Web Share API** where supported.

The user selects a property and taps:

> **Share**

The operating system's native share sheet opens, allowing the broker to choose WhatsApp, Messages, Telegram, Mail, etc.

---

# 2. Product Vision

## 2.1 Vision

Build the simplest digital property inventory and sharing system for real estate professionals.

The product should eventually evolve from:

**Property storage → Property sharing → Lead management → AI real estate assistant → Agentic real estate operating system**

But the MVP deliberately focuses on the first two stages.

---

# 3. Problem Statement

## 3.1 Current Workflow

A typical broker may currently store:

- Property photographs in their phone gallery
- Property videos in another folder
- Property PDFs in Downloads
- Property documents in Google Drive
- Property details in WhatsApp
- Pricing information in spreadsheets
- Client conversations in WhatsApp
- Contact information in their phone
- Property addresses in Google Maps
- Additional notes in Apple Notes/Google Keep

There is no reliable relationship between these pieces of information.

This creates several problems.

### Problem 1 — Property information is fragmented

A single property may have:

- 20 photographs
- 3 PDFs
- 1 video
- 1 location
- 10 property features
- pricing information
- owner information
- broker information
- contact information

These are frequently stored separately.

### Problem 2 — Finding properties is slow

The broker may remember:

> "There was an apartment somewhere in Manhattan..."

but not remember:

- filename
- folder
- WhatsApp conversation
- exact property name
- date received

### Problem 3 — Sharing is repetitive

The broker repeatedly sends:

- photographs
- address
- price
- specifications
- documents
- contact information

manually.

### Problem 4 — Property context gets lost

Photos without context are useless.

A broker may have:

`IMG_4321.jpg`

but not know whether it belongs to:

- Property A
- Property B
- Property C

### Problem 5 — Multiple property requests are cumbersome

A client may ask:

> "Send me all 2BHK properties around this area."

The broker needs to search through their inventory and send several separate messages.

### Problem 6 — There is little visibility after sharing

After sending a property, the broker often doesn't know:

- whether the client opened it
- whether they viewed the details
- whether they looked at the photos
- which property they were interested in

The MVP introduces lightweight view analytics.

---

# 4. Product Goals

## 4.1 Primary Goals

The MVP must:

1. Allow brokers/companies to create an account.
2. Allow users to create a professional broker/business profile.
3. Allow users to create property listings.
4. Store all property information in one structured record.
5. Upload multiple property images.
6. Upload property-related documents.
7. Organize properties by geographic and property attributes.
8. Search properties quickly.
9. Filter properties quickly.
10. View properties as visually rich cards.
11. Share a property through a shareable link.
12. Share multiple properties together.
13. Use native mobile sharing capabilities.
14. Track basic property-link views.
15. Provide a dashboard showing the user's property inventory.
16. Work well on desktop and mobile.
17. Be installable as a PWA.
18. Establish a technical foundation for future AI/agentic functionality.

---

# 5. Non-Goals for MVP

The following should explicitly **NOT** be implemented in the MVP.

## 5.1 No WhatsApp API

Do not integrate:

- WhatsApp Business API
- WhatsApp Cloud API
- Meta APIs

The application only invokes the device's native share sheet.

## 5.2 No automated messaging

The application must not automatically send messages.

The user chooses the recipient and communication platform.

## 5.3 No AI agent

No:

- AI calling agent
- voice agent
- autonomous agent
- AI lead qualification
- AI property recommendation
- AI chatbot
- AI-generated property descriptions

These are future phases.

## 5.4 No CRM

The MVP does not need:

- full lead CRM
- pipeline management
- automated follow-ups
- deal management
- sales forecasting

## 5.5 No payments

No:

- subscriptions
- invoices
- payment processing
- commission management

## 5.6 No property marketplace

This is **not Zillow/99acres/Airbnb-style public marketplace software**.

The inventory primarily belongs to the broker/company.

## 5.7 No public property discovery

Users should not be able to browse all properties belonging to other organizations.

Every organization's inventory must remain isolated.

---

# 6. Target Users

## 6.1 Individual Broker

A real estate professional managing their own properties.

Example:

> John is an independent broker with 75 active properties.

He needs to quickly find and send properties to clients.

---

## 6.2 Real Estate Agency

A company with multiple brokers/agents.

Example:

> ABC Realty has 15 agents and 1,000 properties.

The MVP should establish the architecture for organization-level property ownership, even if advanced team management is implemented later.

---

## 6.3 Real Estate Agent

An individual agent operating under a brokerage.

The agent needs their own inventory and profile.

---

# 7. Core Product Concept

The fundamental data relationship is:

```text
Organization / Broker
        │
        ├── Profile
        │
        ├── Properties
        │     ├── Images
        │     ├── Documents
        │     ├── Location
        │     ├── Features
        │     └── Contact
        │
        └── Sharing / Analytics
              ├── Share Link
              ├── View Event
              └── View Count
```

---

# 8. MVP User Journey

## 8.1 First-Time User

```text
Landing Page
      ↓
Sign Up
      ↓
Create Broker / Business Profile
      ↓
Dashboard
      ↓
Add First Property
      ↓
Upload Photos + Documents
      ↓
Save Property
      ↓
Property Appears in Inventory
      ↓
Search / Filter
      ↓
Open Property
      ↓
Share
      ↓
Native Share Sheet
```

---

# 9. Authentication

## 9.1 Sign Up

The user should be able to register using:

- Email
- Password

Future authentication methods may include:

- Google
- Apple
- phone number

but these are not mandatory for MVP.

---

## 9.2 Login

Required:

- Email
- Password
- Forgot password

---

## 9.3 Session Management

The application should maintain authenticated sessions securely.

All private API requests must require authentication.

---

# 10. Broker / Business Profile

After registration, the user should create their professional profile.

## 10.1 Required Fields

### Individual Broker

- Full name
- Business/broker name
- Phone number
- Email
- Profile photo/logo
- Country
- Region/state
- City
- Professional designation

### Company

- Company name
- Logo
- Contact person
- Phone number
- Email
- Website
- Country
- Region/state
- City
- Office address

---

# 11. Dashboard

The dashboard is the primary workspace.

## 11.1 Dashboard Layout

Desktop:

```text
┌─────────────────────────────────────────────┐
│ Logo     Search                  Profile    │
├─────────────────────────────────────────────┤
│                                             │
│ Good afternoon, Austin                      │
│ Manage and share your properties.           │
│                                             │
│ [+ Add Property]                            │
│                                             │
├───────────┬───────────┬───────────┬─────────┤
│ Properties│ Active    │ Shared    │ Views   │
│    128    │   103     │   421     │  1,248  │
├───────────┴───────────┴───────────┴─────────┤
│                                             │
│ Search properties...                        │
│                                             │
│ Filters: Country Area Type Price Status     │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│ Property Cards                              │
│                                             │
└─────────────────────────────────────────────┘
```

Mobile:

```text
Header
Search
Quick Filters

Property Cards

Bottom Navigation
Home | Properties | Add | Analytics | Profile
```

---

# 12. Property Management

Property management is the core MVP feature.

## 12.1 Add Property

The user clicks:

**+ Add Property**

The form should be broken into logical sections.

---

# 13. Property Information

## 13.1 Basic Information

Fields:

- Property title
- Property type
- Listing type
- Description
- Status
- Price
- Currency

### Property Types

Initial options:

- Apartment
- House
- Villa
- Condo
- Townhouse
- Land
- Commercial
- Office
- Retail
- Warehouse
- Other

### Listing Types

- For Sale
- For Rent
- Lease
- Off Market

### Status

- Available
- Reserved
- Sold
- Rented
- Draft
- Archived

---

# 14. Property Specifications

Fields:

- Bedrooms
- Bathrooms
- Half bathrooms
- Property size
- Lot size
- Floor number
- Total floors
- Year built
- Parking spaces
- Furnished status

Units must be configurable based on region.

Examples:

- sq ft
- sq m
- acres
- hectares

---

# 15. Location

Location should be structured.

Fields:

- Country
- State / Province / Region
- City
- Area / Neighborhood
- Street address
- Postal/ZIP code
- Latitude
- Longitude

The exact address can optionally be hidden from public sharing if the broker chooses.

---

# 16. Property Features

The broker should be able to add multiple features.

Examples:

- Swimming Pool
- Gym
- Parking
- Security
- Elevator
- Balcony
- Garden
- Terrace
- Air Conditioning
- Furnished
- Pet Friendly
- Smart Home
- Sea View
- Mountain View
- Generator
- Backup Power
- Gated Community

Features should be stored as structured tags rather than one text field.

This enables future filtering and AI search.

---

# 17. Property Images

The image uploader is a critical part of the product.

## 17.1 Requirements

The user can:

- Select multiple images
- Capture images using device camera
- Upload from device
- Reorder images
- Delete images
- Set a cover image

The first/selected cover image appears on the property card.

---

## 17.2 Mobile Camera

Because the product is a PWA, mobile users should be able to use the device camera through browser-supported functionality.

Example:

```text
+ Add Photos

[ Camera ]
[ Gallery ]
```

---

# 18. Property Documents

Users should be able to attach relevant documents.

Examples:

- Property brochure
- Floor plan
- Title document
- Registration document
- Inspection report
- Property PDF
- Legal documentation
- Other supporting documents

Supported MVP formats:

- PDF
- JPG
- PNG
- WebP

Potential file-size limits should be enforced.

---

# 19. Property Contact Information

Each property may have a specific contact.

Fields:

- Contact name
- Phone
- WhatsApp number
- Email
- Designation
- Preferred contact method

Default option:

> Use my business profile contact information.

The user can override this for individual properties.

---

# 20. Property Notes

Internal notes should be supported.

Example:

> Owner is willing to negotiate up to ₹1.85 Cr.

These notes must be private and **must never appear on the public share page** unless explicitly marked shareable.

---

# 21. Property Card

Each property should be visually represented as a card.

Example:

```text
┌───────────────────────────────┐
│                               │
│        PROPERTY IMAGE         │
│                               │
│     FOR SALE                  │
├───────────────────────────────┤
│ Modern 3BR Manhattan Apartment│
│                               │
│ $1,250,000                    │
│                               │
│ Manhattan, New York           │
│                               │
│ 3 Beds  • 2 Baths • 1,450 ft²│
│                               │
│ 🅿 Parking   🏊 Pool   🏋 Gym │
│                               │
│ [ View ] [ Share ]            │
└───────────────────────────────┘
```

---

# 22. Search

Search must be fast and forgiving.

Searchable fields should include:

- Property name
- City
- Area
- Country
- Property type
- Address
- Features
- Property ID
- Contact name

Example:

```text
Search: "Manhattan 3 bedroom"
```

Results should return relevant properties.

---

# 23. Filtering

Filters should include:

### Location

- Country
- State/Region
- City
- Area

### Property

- Property type
- Listing type
- Status

### Specifications

- Bedrooms
- Bathrooms
- Property size

### Price

- Minimum
- Maximum
- Currency

### Features

- Parking
- Pool
- Gym
- Furnished
- etc.

---

# 24. Sorting

Sort options:

- Recently added
- Recently updated
- Price: low → high
- Price: high → low
- Most viewed
- Most shared
- Property name

---

# 25. Property Detail Page

Clicking a property card opens a complete property view.

Structure:

```text
Image Gallery

Property Title
Price
Location

Property Specifications

Description

Features

Location

Contact Information

Documents

Internal Notes

Analytics

[ Edit ]
[ Share ]
```

---

# 26. Shareable Property Page

This is one of the most important MVP features.

Every property should be capable of generating a unique public share URL.

Example concept:

```text
app.com/p/abc123
```

The actual URL structure can be decided during implementation.

---

# 27. Public Share Page

The recipient does not need an account.

The public page should display:

```text
Broker / Company Logo

Property Photos

Modern 3 Bedroom Apartment

$1,250,000

Manhattan, New York

3 Bedrooms
2 Bathrooms
1,450 sq ft

Description

Features

Location

Contact

[ Contact Broker ]
```

Documents marked as shareable may also appear.

Private notes must never appear.

---

# 28. Share Card

The user should have a dedicated share action.

Example:

```text
[ Share Property ]
```

On supported mobile browsers/PWAs:

```text
Share
   ↓
Native OS Share Sheet
   ↓
WhatsApp
Messages
Telegram
Email
AirDrop
Copy Link
etc.
```

The product does not control which applications appear.

---

# 29. Share Message

The application should generate a useful default share payload.

Example:

> Modern 3 Bedroom Apartment  
> Manhattan, New York  
> $1,250,000  
>  
> 3 Bedrooms • 2 Bathrooms • 1,450 sq ft  
>  
> View property details:  
> [share URL]

The user can then choose the communication platform.

The MVP should not attempt to automatically customize messages for WhatsApp.

---

# 30. Multi-Property Sharing

This is an important differentiating feature.

The user can select multiple properties.

Example:

```text
☑ Manhattan 3BR Apartment
☑ Brooklyn Townhouse
☑ Queens Condo
☐ Jersey City Apartment
```

Then:

**Share 3 Properties**

The system generates a combined share page.

Example:

```text
app.com/s/xyz789
```

The recipient sees:

```text
Austin Makasare
3 Properties Shared With You

────────────────

Property 1
Modern Manhattan Apartment

Property 2
Brooklyn Townhouse

Property 3
Queens Condo
```

Each property can be opened individually.

---

# 31. Selection Mode

The inventory should support:

```text
[ Select ]
```

Once activated:

```text
☑ Property A
☑ Property B
☐ Property C
☑ Property D

3 selected

[ Share Selected ]
```

The system should provide:

- Select all visible
- Clear selection
- Share selected

---

# 32. Share Tracking

Every generated share link should have a unique share record.

Example:

```text
Share
  ID: share_123
  Property: property_456
  Created by: broker_001
  Created at: timestamp
  Views: 4
  Last viewed: timestamp
```

For multiple properties:

```text
Share
  ID: share_789
  Properties:
    property_1
    property_2
    property_3
```

---

# 33. View Analytics

When a public share page is opened, the system records a view event.

MVP analytics:

- Total views
- Unique views where reasonably determinable
- Last viewed
- Share count
- Property views
- Multi-property share views

Example dashboard:

```text
Property Performance

Manhattan Apartment

Shares       14
Views        39
Last viewed  12 Aug, 3:42 PM
```

---

# 34. Privacy Considerations for Analytics

The MVP should avoid unnecessarily collecting personal information.

Do not attempt to identify the recipient by:

- phone number
- WhatsApp account
- email address

unless the user explicitly provides that information through a future CRM flow.

The basic MVP only needs to know:

> "This share link was opened."

---

# 35. Dashboard Analytics

The dashboard can show:

```text
Total Properties     128
Active Properties    103
Total Shares         421
Total Views          1,248
```

Additional:

```text
Most Viewed Properties

1. Manhattan Apartment — 142 views
2. Brooklyn Villa — 98 views
3. Queens Condo — 81 views
```

---

# 36. Property Status Management

Users should be able to change status.

Example:

```text
Available
   ↓
Reserved
   ↓
Sold
```

or:

```text
Available
   ↓
Rented
```

When a property is sold/rented, it should remain in the system for historical purposes.

It should simply disappear from the default active inventory.

---

# 37. Archive

Properties should be archivable.

Archived properties:

- remain stored
- are not shown in normal active search
- can be restored
- do not automatically become publicly discoverable

---

# 38. Organization Isolation

This is a critical architectural requirement.

Every property must belong to exactly one organization/account context.

Conceptually:

```text
Organization A
  ├── Property 1
  ├── Property 2
  └── Property 3

Organization B
  ├── Property 4
  └── Property 5
```

Organization A must never be able to access Organization B's private properties.

Authorization must be enforced at the backend/database layer, not merely in frontend UI.

---

# 39. Suggested Data Model

## 39.1 User

```text
User
- id
- email
- password_hash
- name
- phone
- organization_id
- role
- created_at
- updated_at
```

---

## 39.2 Organization

```text
Organization
- id
- name
- type
- logo_url
- email
- phone
- website
- country
- region
- city
- address
- created_at
- updated_at
```

---

## 39.3 Property

```text
Property
- id
- organization_id
- title
- description
- property_type
- listing_type
- status
- price
- currency
- bedrooms
- bathrooms
- size
- size_unit
- lot_size
- lot_size_unit
- floor
- total_floors
- year_built
- parking_spaces
- furnished
- country
- region
- city
- area
- address
- postal_code
- latitude
- longitude
- cover_image_url
- contact_name
- contact_phone
- contact_email
- created_by
- created_at
- updated_at
```

---

## 39.4 Property Image

```text
PropertyImage
- id
- property_id
- url
- storage_key
- sort_order
- is_cover
- created_at
```

---

## 39.5 Property Document

```text
PropertyDocument
- id
- property_id
- name
- file_url
- storage_key
- file_type
- file_size
- is_shareable
- created_at
```

---

## 39.6 Feature

```text
Feature
- id
- name
- category
```

---

## 39.7 Property Feature

```text
PropertyFeature
- property_id
- feature_id
```

---

## 39.8 Share

```text
Share
- id
- organization_id
- created_by
- token
- share_type
- expires_at
- created_at
```

---

## 39.9 Share Property

```text
ShareProperty
- share_id
- property_id
```

---

## 39.10 View Event

```text
ViewEvent
- id
- share_id
- property_id
- timestamp
- user_agent
- referrer
```

Privacy-sensitive fields should be minimized and handled according to applicable privacy requirements.

---

# 40. Suggested Technical Architecture

The MVP should be designed so AI coding agents can implement it efficiently.

Recommended architecture:

```text
                    ┌─────────────────┐
                    │     Browser     │
                    │      / PWA      │
                    └────────┬────────┘
                             │
                       HTTPS / API
                             │
                    ┌────────▼────────┐
                    │    Backend API  │
                    └────────┬────────┘
                             │
             ┌───────────────┼────────────────┐
             │               │                │
       ┌─────▼─────┐   ┌────▼─────┐    ┌─────▼─────┐
       │ PostgreSQL│   │  Object  │    │ Analytics │
       │ Database  │   │ Storage  │    │ / Events  │
       └───────────┘   └──────────┘    └───────────┘
```

---

# 41. Frontend

The frontend should be:

- Responsive
- Mobile-first
- PWA-ready
- Component-driven
- Accessible
- Fast

Possible implementation stack:

- Next.js / React
- TypeScript
- Tailwind CSS
- Component library such as shadcn/ui
- PWA service worker

The exact framework can be chosen based on the AI coding platform being used.

The architecture should not depend heavily on proprietary builder functionality.

---

# 42. Backend

The backend should expose REST or equivalent API endpoints.

Example:

```text
POST   /api/auth/register
POST   /api/auth/login

GET    /api/profile
PATCH  /api/profile

GET    /api/properties
POST   /api/properties
GET    /api/properties/:id
PATCH  /api/properties/:id
DELETE /api/properties/:id

POST   /api/properties/:id/images
DELETE /api/properties/:id/images/:imageId

POST   /api/properties/:id/documents
DELETE /api/properties/:id/documents/:documentId

POST   /api/shares
GET    /api/shares/:token

GET    /api/analytics
```

---

# 43. Storage

Property images and documents should not be stored directly inside the relational database.

Use object storage.

Examples:

- S3-compatible storage
- Supabase Storage
- Cloudflare R2
- Firebase Storage

The database stores metadata and storage references.

---

# 44. Database

PostgreSQL is recommended because the product contains structured relational data:

```text
Organization
   ↓
Property
   ↓
Images
Documents
Features
Shares
Analytics
```

The architecture should support indexing for:

- organization_id
- city
- region
- country
- property_type
- status
- price
- bedrooms
- created_at

---

# 45. Search Architecture

MVP search does not require Elasticsearch.

PostgreSQL search should be sufficient.

Search should initially operate across:

- title
- description
- city
- area
- address
- property type
- features

A future AI search layer can sit above the structured search system.

For example:

> "Show me affordable 3-bedroom apartments near Manhattan with parking."

Future AI:

```text
Natural language
      ↓
AI Query Parser
      ↓
Structured Filters
      ↓
Property Search
```

The MVP should preserve structured fields specifically to make this future capability possible.

---

# 46. PWA Requirements

The application must behave like an installable mobile application.

Required:

- Web App Manifest
- Service Worker
- App icon
- Splash/loading behavior where supported
- Responsive layout
- Installable experience
- Offline-friendly shell where practical

---

# 47. Native Device Capabilities

The PWA should leverage browser-supported native capabilities.

## Camera

Used for:

- Property photographs
- Profile photo

## Native Share

Used for:

- Property links
- Multi-property links

## Clipboard

Used as fallback:

```text
Copy Link
```

## File Picker

Used for:

- images
- PDFs
- documents

No native application is required for MVP.

---

# 48. Sharing Compatibility

The implementation should follow progressive enhancement.

### Preferred

Use:

```text
navigator.share()
```

where supported.

### Fallback

If Web Share is unavailable:

```text
Share Property

[ Copy Link ]
```

Potential secondary fallbacks can include standard browser sharing mechanisms, but the product must not require third-party messaging integrations.

---

# 49. Public Share Security

Share URLs should use non-guessable identifiers/tokens.

Bad:

```text
/p/1
/p/2
/p/3
```

Preferred:

```text
/p/a8Xk92LmQ
```

or UUID/token-based URLs.

A public share URL should expose only information explicitly marked as shareable.

---

# 50. Share Expiration

MVP may support optional expiration.

Example:

```text
Share for:

○ No expiration
○ 7 days
○ 30 days
```

If implementation complexity becomes too high, expiration can be deferred to post-MVP.

---

# 51. Responsive Design

## Desktop

Designed for:

- large inventory management
- bulk selection
- filtering
- editing

## Mobile

Designed primarily for:

- searching
- viewing
- sharing
- adding properties
- camera uploads

The product's most important mobile workflow is:

```text
Open PWA
→ Search
→ Find property
→ Share
```

This should take only a few interactions.

---

# 52. Navigation

Recommended navigation:

### Desktop

```text
Dashboard
Properties
Analytics
Profile
Settings
```

### Mobile

Bottom navigation:

```text
Home
Properties
Add
Analytics
Profile
```

---

# 53. Property List Views

Support:

### Grid

Best for visual browsing.

### List

Best for large inventories.

Example:

```text
[Image] Manhattan Apartment
       $1.2M
       Manhattan
       3BR · 2BA

       [Share]
```

A simple grid/list toggle is sufficient for MVP.

---

# 54. Empty States

The application should have intentional empty states.

Example:

```text
No properties yet.

Your property inventory starts here.

Add your first property and keep
everything you need in one place.

[ + Add Property ]
```

---

# 55. Loading States

Use skeleton loaders for:

- property cards
- image gallery
- dashboard metrics
- analytics

Avoid blank screens.

---

# 56. Error Handling

Examples:

### Upload failure

> "Some images couldn't be uploaded. Retry."

### Network failure

> "You're offline. Check your connection and try again."

### Invalid document

> "This file type isn't supported."

### Unauthorized

> "Your session has expired. Please log in again."

---

# 57. Validation

Required property fields:

- Property title
- Property type
- Listing type
- Price
- Currency
- Country
- City
- At least one image

Recommended validation:

- Valid email
- Valid phone
- Positive price
- Positive property size
- Valid image type
- File size limits

---

# 58. Bulk Operations

MVP should support basic bulk selection.

Possible actions:

- Archive
- Change status
- Share

Do not implement complex bulk editing initially.

---

# 59. Performance Requirements

The property list should remain responsive with at least:

**1,000+ properties per organization**

The UI should use pagination or infinite scrolling.

Images should use:

- thumbnails
- lazy loading
- responsive image sizes

Do not load every full-resolution property image on the dashboard.

---

# 60. Image Optimization

Uploaded images should be processed into optimized versions.

Potential pipeline:

```text
Original Image
      ↓
Upload
      ↓
Optimization
      ↓
Thumbnail
      ↓
Medium
      ↓
Full Resolution
```

The card should use the thumbnail/optimized version.

The gallery can use larger versions.

---

# 61. Security Requirements

Minimum security requirements:

- HTTPS
- Secure authentication
- Password hashing
- Authorization checks
- Organization-level isolation
- Signed/private file URLs where appropriate
- Secure public share tokens
- File-type validation
- File-size validation
- Rate limiting
- Input sanitization
- Protection against unauthorized property access

---

# 62. Authorization Rules

A user should only be able to:

- access their own organization
- create properties within their organization
- edit properties within their organization
- delete/archive properties within their organization
- see analytics belonging to their organization

Public users can only access explicitly shared content.

---

# 63. Roles

MVP can support a minimal role model.

### Owner

Can:

- manage profile
- manage properties
- view analytics
- manage users

### Agent

Can:

- create properties
- edit assigned properties
- share properties
- view relevant analytics

If multi-user organization functionality increases MVP complexity, the database should still include `organization_id` and `role` so the system can expand later.

---

# 64. Analytics Events

At minimum:

```text
PROPERTY_CREATED
PROPERTY_UPDATED
PROPERTY_SHARED
SHARE_VIEWED
PROPERTY_ARCHIVED
PROPERTY_STATUS_CHANGED
```

These events provide the foundation for future analytics.

---

# 65. Analytics Dashboard

MVP analytics should remain intentionally simple.

Example:

```text
Overview

Properties             128
Shares                  421
Views                 1,248

Top Properties

Manhattan Apartment
142 views
38 shares

Brooklyn Townhouse
98 views
24 shares
```

Avoid building a complicated BI dashboard.

---

# 66. Future AI Architecture Considerations

Although AI is not part of the MVP, the data model should be designed to support it.

The future system could become:

```text
                    AI REAL ESTATE AGENT
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
   Search Agent        Calling Agent       Voice Agent
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
                     Property Database
                            │
          ┌─────────────────┼────────────────┐
          │                 │                │
       Listings           Leads          Documents
```

---

# 67. Future AI Search

The structured MVP data should eventually enable queries such as:

> "Find me 3-bedroom apartments in Manhattan under $1.5 million with parking."

The AI layer converts that into:

```json
{
  "city": "Manhattan",
  "bedrooms": 3,
  "max_price": 1500000,
  "features": ["parking"],
  "listing_type": "sale"
}
```

Then the existing search system executes the query.

This means AI becomes an additional interface rather than replacing the underlying property database.

---

# 68. Future Voice Agent

A future broker could say:

> "Find me the three best properties for this client."

The system could:

1. Understand the request.
2. Search inventory.
3. Rank properties.
4. Create a property collection.
5. Prepare a shareable link.
6. Ask the broker for confirmation.
7. Share it.

None of this belongs in MVP.

---

# 69. Future Calling Agent

Future versions may support:

- outbound lead calls
- appointment scheduling
- property recommendations
- lead qualification
- follow-up calls
- call summaries

The MVP should simply ensure property data is structured enough for these systems later.

---

# 70. Future CRM

Potential future entities:

```text
Lead
Client
Conversation
Call
Appointment
Task
Deal
FollowUp
```

The MVP should not implement these.

---

# 71. MVP Screens

The AI coding agent should create the following screens.

## Public

1. Landing Page
2. Login
3. Registration
4. Public Property Page
5. Public Multi-Property Share Page

## Authenticated

6. Onboarding
7. Dashboard
8. Property List
9. Add Property
10. Edit Property
11. Property Detail
12. Property Gallery
13. Analytics
14. Profile
15. Settings

---

# 72. Landing Page

The landing page should communicate the product in one sentence.

Suggested positioning:

> **Your property inventory. Organized, searchable, and ready to share.**

Supporting message:

> Keep every property, photo, document, and detail in one place — then share it with clients in seconds.

Primary CTA:

**Get Started**

Secondary CTA:

**See How It Works**

---

# 73. Onboarding

Onboarding should be short.

Step 1:

```text
Tell us about yourself

○ Independent Broker
○ Real Estate Company
○ Agent
```

Step 2:

```text
Business Information
```

Step 3:

```text
Add Your First Property
```

The user should be able to skip adding a property and enter the dashboard.

---

# 74. Add Property UX

The form should avoid becoming one giant page.

Recommended sections:

```text
1. Basic Information
2. Photos
3. Property Details
4. Location
5. Features
6. Documents
7. Contact
8. Sharing Settings
```

A progress indicator can be used on mobile.

---

# 75. Property Sharing UX

The sharing interaction should be extremely fast.

Target:

```text
Property
   ↓
Share
   ↓
Native Share
```

Ideally no additional configuration is required.

For multi-property:

```text
Select
   ↓
Choose Properties
   ↓
Share Selected
   ↓
Native Share
```

---

# 76. Public Page UX

The recipient should not feel like they are opening an internal dashboard.

The public property page should look like a polished digital property brochure.

Structure:

```text
Broker Branding

Large Hero Image

Property Title
Price
Location

Key Specifications

Gallery

Description

Features

Documents

Contact Broker
```

---

# 77. Branding

The public property page should use the broker/company identity.

Display:

- Company logo
- Business name
- Agent name
- Phone
- Email

This makes every shared link function as a lightweight branded property presentation.

---

# 78. MVP Definition of Done

The MVP is complete when a broker can:

### Account

- [ ] Create an account
- [ ] Log in
- [ ] Create business profile

### Property

- [ ] Create property
- [ ] Add title
- [ ] Add description
- [ ] Add price
- [ ] Add location
- [ ] Add specifications
- [ ] Add features
- [ ] Upload multiple images
- [ ] Reorder images
- [ ] Set cover image
- [ ] Upload documents
- [ ] Add contact information
- [ ] Save property

### Organization

- [ ] View properties belonging to their organization
- [ ] Edit properties
- [ ] Archive properties
- [ ] Change property status

### Search

- [ ] Search properties
- [ ] Filter properties
- [ ] Sort properties

### Sharing

- [ ] Share one property
- [ ] Generate public share URL
- [ ] Open native share sheet
- [ ] Copy share link
- [ ] Select multiple properties
- [ ] Generate combined share page
- [ ] Share combined page

### Analytics

- [ ] Track shares
- [ ] Track public page views
- [ ] Display total views
- [ ] Display share count
- [ ] Display last viewed

### PWA

- [ ] Installable on mobile
- [ ] Responsive
- [ ] Camera upload works where browser-supported
- [ ] Native share works where browser-supported
- [ ] File uploads work
- [ ] Application works on desktop

---

# 79. MVP Success Metrics

The primary metric should be:

## Time to Share

Measure:

> Time from opening the application to successfully sharing a property.

Target:

**< 15 seconds for an existing property**

---

## Secondary Metrics

### Property organization

- Number of properties uploaded
- Percentage with complete metadata
- Number of images/property

### Usage

- Properties viewed
- Properties shared
- Multi-property shares
- Weekly active brokers

### Engagement

- Share → View conversion
- Average views/share
- Most shared properties

---

# 80. Product KPIs

Initial MVP KPIs:

```text
Activation
= User creates first property

Core Usage
= User shares first property

Retention
= User returns to manage/share properties

Value
= Properties shared per active broker

Engagement
= Share links viewed by recipients
```

The most important early signal is not total registrations.

It is:

> **How many brokers repeatedly use the application to find and share properties?**

---

# 81. UX Principles

The product should follow five principles.

## 1. Fast

A broker may be standing in front of a client.

Every common action should require minimal interaction.

## 2. Visual

Real estate is visual.

Photos should dominate property discovery.

## 3. Organized

Every photo/document must belong to a property.

## 4. Share-first

Sharing should be a primary action, not a hidden menu item.

## 5. Mobile-first

The product will primarily be used on phones during real-world sales activity.

---

# 82. Design Direction

The UI should feel like:

**Modern SaaS + premium real estate**

Avoid:

- overly complicated dashboards
- old-fashioned real estate portal aesthetics
- excessive gradients
- excessive animations
- information overload

Use:

- clean cards
- strong typography
- large property imagery
- generous whitespace
- clear hierarchy
- subtle interactions
- premium but functional design

---

# 83. Accessibility

Minimum requirements:

- keyboard navigation
- semantic HTML
- accessible form labels
- sufficient contrast
- focus states
- alt text for property images where appropriate
- screen-reader-friendly controls
- touch targets appropriate for mobile

---

# 84. Internationalization Considerations

The architecture should not hard-code a single country's real estate model.

The system should support:

- multiple countries
- currencies
- regional address structures
- metric/imperial units
- different property terminology

For example:

```text
India:
BHK

United States:
Bedrooms

United Kingdom:
Bedrooms

Other markets:
Different terminology
```

The database should store canonical values while allowing localized presentation.

---

# 85. Currency

A property should have:

```text
price
currency
```

Examples:

```text
INR
USD
GBP
AED
EUR
```

Do not store formatted currency strings as the primary value.

---

# 86. Property IDs

Every property should have a human-readable identifier.

Example:

```text
NYC-APT-00421
```

This allows brokers to search:

> "00421"

and immediately find the property.

---

# 87. File Management

The system should clearly associate files with properties.

Example:

```text
Manhattan Apartment
│
├── Photos
│   ├── exterior.jpg
│   ├── living-room.jpg
│   ├── kitchen.jpg
│   └── bedroom.jpg
│
└── Documents
    ├── floor-plan.pdf
    └── brochure.pdf
```

This is one of the fundamental problems the product solves.

---

# 88. Auditability

Basic timestamps should exist for:

- property creation
- property updates
- image uploads
- document uploads
- shares
- views
- status changes

This will become useful for future CRM and AI systems.

---

# 89. AI Coding Agent Implementation Strategy

Because the product will be built using AI coding tools such as Lovable.dev and v0.dev, the PRD should be implemented incrementally.

Do **not** ask the coding agent to generate the entire application in one uncontrolled prompt.

Recommended implementation sequence:

### Phase 1 — Foundation

- Project setup
- Authentication
- Database
- Organization model
- User model
- Base UI
- PWA configuration

### Phase 2 — Property Inventory

- Property schema
- CRUD
- Image upload
- Document upload
- Property cards
- Property detail page

### Phase 3 — Discovery

- Search
- Filters
- Sorting
- Grid/list views
- Status management

### Phase 4 — Sharing

- Public property pages
- Share tokens
- Native Web Share
- Copy link
- Multi-property collections

### Phase 5 — Analytics

- Share events
- View events
- Dashboard analytics
- Property-level analytics

### Phase 6 — Polish

- Mobile UX
- PWA install flow
- Empty states
- Error states
- Loading states
- Performance optimization
- Security hardening

---

# 90. Recommended AI-Agent Development Rules

The coding agent should follow these principles:

### Rule 1

Do not invent product functionality outside this PRD.

### Rule 2

Do not introduce WhatsApp APIs.

### Rule 3

Do not introduce AI functionality into the MVP.

### Rule 4

Keep organization-level data isolation at the backend/database level.

### Rule 5

Keep property data structured.

### Rule 6

Do not store images directly in the database.

### Rule 7

Do not expose private property information through public share links.

### Rule 8

Build mobile-first.

### Rule 9

Every major feature must have loading, empty, success, and error states.

### Rule 10

Build reusable components rather than page-specific duplicated components.

---

# 91. Recommended Component Architecture

Example:

```text
components/
│
├── auth/
│   ├── LoginForm
│   └── SignupForm
│
├── layout/
│   ├── Navbar
│   ├── Sidebar
│   └── MobileNavigation
│
├── properties/
│   ├── PropertyCard
│   ├── PropertyGrid
│   ├── PropertyList
│   ├── PropertyForm
│   ├── PropertyGallery
│   ├── PropertyFilters
│   ├── PropertySearch
│   ├── PropertyFeatures
│   └── PropertyDocuments
│
├── sharing/
│   ├── ShareButton
│   ├── ShareDialog
│   └── SharePreview
│
├── analytics/
│   ├── MetricCard
│   ├── PropertyAnalytics
│   └── ShareAnalytics
│
└── ui/
    ├── Button
    ├── Dialog
    ├── Input
    ├── Select
    ├── Badge
    └── Card
```

---

# 92. API Design Principles

APIs should be:

- predictable
- RESTful
- authenticated
- organization-aware
- validated
- documented

Every property endpoint should verify:

```text
authenticated user
        ↓
organization
        ↓
property belongs to organization
        ↓
allow operation
```

Never rely exclusively on frontend filtering.

---

# 93. Database Indexing

At minimum:

```text
properties.organization_id
properties.city
properties.region
properties.country
properties.status
properties.property_type
properties.price
properties.created_at
shares.token
shares.organization_id
view_events.share_id
```

Composite indexes should be added where real query patterns justify them.

---

# 94. Future Scalability

The MVP should not over-engineer the system.

Do not begin with:

- microservices
- Kubernetes
- event buses
- complex AI infrastructure
- distributed search
- complicated data warehouses

A modular monolith is sufficient.

Conceptually:

```text
Frontend
    ↓
API
    ↓
PostgreSQL
    ↓
Object Storage
```

This is enough for the MVP.

---

# 95. Acceptance Criteria

## Property Creation

**Given** an authenticated broker,

**When** they create a property with valid information,

**Then** the property is saved under their organization and appears in their inventory.

---

## Image Upload

**Given** a property,

**When** the broker uploads multiple valid images,

**Then** the images are associated with that property and displayed in the correct order.

---

## Search

**Given** 100+ properties,

**When** the broker searches for a city/property name,

**Then** relevant properties should appear without manually browsing all listings.

---

## Filtering

**Given** multiple properties,

**When** the broker filters by city, type, bedrooms, price, or feature,

**Then** only matching properties are displayed.

---

## Sharing

**Given** an existing property,

**When** the broker taps Share,

**Then** a shareable URL is generated and the native share mechanism is invoked where supported.

---

## Public Page

**Given** a valid share URL,

**When** an unauthenticated recipient opens it,

**Then** they can view only the information intended for sharing.

---

## Analytics

**Given** a recipient opens a share link,

**When** the public page loads,

**Then** a view event is recorded and reflected in the broker's analytics.

---

## Multi-Property Sharing

**Given** multiple selected properties,

**When** the broker taps Share Selected,

**Then** the system creates a combined shareable collection containing those properties.

---

# 96. MVP Prioritization

## P0 — Absolutely Required

- Authentication
- Organization/profile
- Property CRUD
- Image uploads
- Document uploads
- Property cards
- Search
- Filters
- Property detail
- Public share page
- Native sharing
- Multi-property sharing
- Basic view tracking
- PWA

## P1 — Important

- Property status
- Archive
- Analytics dashboard
- Grid/list toggle
- Property IDs
- Image reordering
- Cover image
- Shareable documents
- Share expiration

## P2 — Post-MVP

- Team management
- CRM
- Leads
- AI search
- AI recommendations
- Voice assistant
- Calling agent
- Automated follow-up
- AI property descriptions
- WhatsApp API
- Email automation
- Calendar integration
- Payments/subscriptions

---

# 97. Critical Product Boundary

The MVP should be understood as:

> **A private property inventory and sharing workspace for real estate professionals.**

It is **not**:

> A real estate marketplace.

It is **not**:

> A CRM.

It is **not**:

> An AI agent.

It is **not**:

> A WhatsApp automation tool.

It is:

> **A structured digital property library that lets brokers find and share the right property in seconds.**

---

# 98. Core Value Proposition

The entire MVP can be summarized as:

### Before

```text
Client asks for property
        ↓
Search Gallery
        ↓
Search WhatsApp
        ↓
Find PDF
        ↓
Find correct photos
        ↓
Copy details
        ↓
Send everything manually
```

### After

```text
Client asks for property
        ↓
Search Property Hub
        ↓
Select Property
        ↓
Share
        ↓
Done
```

For multiple properties:

```text
Client asks for options
        ↓
Filter inventory
        ↓
Select properties
        ↓
Share collection
        ↓
Done
```

---

# 99. Product North Star

The product should optimize for one experience above everything else:

> **"I need to send this property to my client right now."**

The broker should be able to open the PWA, find the property, tap Share, choose the communication app, and finish the task in seconds.

Every feature in the MVP should support that workflow.

---

# 100. Future Product Evolution

The long-term product can evolve through these stages:

```text
PHASE 1
Property Library
      ↓
PHASE 2
Property Sharing
      ↓
PHASE 3
Client / Lead Management
      ↓
PHASE 4
AI Property Search
      ↓
PHASE 5
AI Sales Assistant
      ↓
PHASE 6
Voice / Calling Agent
      ↓
PHASE 7
Autonomous Real Estate Agent
```

The MVP should therefore be deliberately simple but structurally intelligent.

The most important architectural decision is to make **property information highly structured and reliably connected to its media, documents, location, features, ownership, sharing history, and analytics**.

That structured foundation becomes the knowledge layer that future AI agents can operate on.

---

# 101. Final MVP Definition

The MVP succeeds if a real estate broker can replace their fragmented workflow of:

**Phone Gallery + WhatsApp + PDFs + Notes + Spreadsheets**

with one system:

**Property Hub**

where every property has:

```text
Property
├── Photos
├── Documents
├── Price
├── Location
├── Specifications
├── Features
├── Contact
├── Status
└── Share Link
      └── View Analytics
```

And the core interaction becomes:

> **Find → Select → Share.**

That is the complete MVP.