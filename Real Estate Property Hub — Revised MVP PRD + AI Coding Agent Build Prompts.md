# Real Estate Property Hub
## Revised MVP Product Requirements Document + AI Coding Agent Implementation Prompts

**Version:** MVP v1.1  
**Platform:** Progressive Web App (PWA)  
**Primary Users:** Real Estate Brokers, Agents, and Real Estate Companies  
**Primary Purpose:** Centralized property inventory, fast property discovery, map-based inventory visualization, shareable property presentations, and lightweight buyer-interest analytics.

---

# PART I — MVP PRD ADDITIONS

The following requirements are additions to the existing PRD and should be treated as part of the MVP specification.

All other requirements from the original PRD remain unchanged.

---

# 1. Updated MVP Product Concept

The MVP now has **three core workflows**:

```text
1. STORE
Property + Photos + Documents + Details
              ↓
2. DISCOVER
Search + Filters + Map
              ↓
3. SHARE & MEASURE
Share Property
      ↓
Recipient Views Property
      ↓
Interested / Maybe / Not Interested
      ↓
Broker Sees Demand Analytics
```

The product therefore becomes more than a property-storage application.

It becomes a lightweight:

> **Property inventory + sharing + buyer-interest intelligence platform for brokers.**

---

# 2. New Feature: Buyer Interest Feedback

## 2.1 Overview

When a recipient opens a shared property page, the application should display a lightweight feedback module asking the recipient how they feel about the property.

The recipient sees three choices:

```text
Are you interested in this property?

[ Interested ]   [ Maybe ]   [ Not Interested ]
```

The purpose is not to create a full CRM workflow.

The purpose is to capture a **simple demand signal** for the broker.

---

# 3. Feedback Placement

The feedback module should appear naturally on the public property page.

Recommended placement:

```text
Property Photos

Property Name
Price
Location

Property Details
Bedrooms • Bathrooms • Area

Description

Features

────────────────────────────

Interested in this property?

[ Interested ]
[ Maybe ]
[ Not Interested ]

────────────────────────────

Contact Broker

────────────────────────────

Location
```

On mobile, the feedback module can also appear as a sticky/bottom card after the user has spent some time viewing the property.

Do not make it obstructive.

---

# 4. Feedback Behavior

When the recipient selects:

### Interested

Record:

```text
interest_status = interested
```

### Maybe

Record:

```text
interest_status = maybe
```

### Not Interested

Record:

```text
interest_status = not_interested
```

After selection, show confirmation:

> Thanks for your feedback.

The user should be able to change their response.

Example:

```text
Your response: Interested

[Change response]
```

---

# 5. No Recipient Account Required

The recipient should **not need to create an account**.

The recipient is accessing the property through a public share link.

The system should associate the feedback with the share/session using a privacy-conscious anonymous identifier.

For example:

```text
share_id
+
anonymous_session_id
+
property_id
```

Do not require:

- phone number
- email
- WhatsApp authentication
- account creation

for MVP feedback.

---

# 6. Feedback Deduplication

The system should avoid counting the same recipient repeatedly as multiple people simply because they clicked multiple times.

For MVP, use an anonymous browser/session identifier.

Example:

```text
Recipient opens share link
        ↓
Anonymous session generated
        ↓
Views property
        ↓
Clicks Interested
        ↓
Feedback recorded
```

If they later change:

```text
Interested → Maybe
```

the system updates the existing response instead of creating another person.

---

# 7. Feedback Analytics

The broker should see:

```text
Interested
Maybe
Not Interested
```

for each property.

Example:

```text
Manhattan 3BR Apartment

Views              87
Shares             21

Interested          9
Maybe               7
Not Interested      3
```

The numbers should be clearly separated.

Do not simply show "19 interested users" if the underlying data represents responses rather than verified unique people.

---

# 8. Property Demand Indicator

Introduce a simple demand indicator.

Example:

```text
Demand

🔥 High Interest
```

or:

```text
Demand

Moderate Interest
```

or:

```text
Demand

Low Interest
```

The exact calculation can remain simple for MVP.

Suggested logic:

```text
Interested Rate =
Interested Responses / Total Responses
```

Possible interpretation:

```text
High:
> 50% interested

Medium:
25–50%

Low:
< 25%
```

However, the dashboard should still expose the raw numbers.

The demand label is only a convenience indicator.

---

# 9. Property Card Analytics

Property cards can display a small demand indicator.

Example:

```text
┌───────────────────────────────┐
│        PROPERTY IMAGE         │
├───────────────────────────────┤
│ Manhattan 3BR Apartment       │
│                               │
│ $1,250,000                    │
│ Manhattan, New York           │
│                               │
│ 3 Beds · 2 Baths · 1450 ft²  │
│                               │
│ 👁 87 views                   │
│ ♥ 9 interested                │
│                               │
│ [ View ] [ Share ]            │
└───────────────────────────────┘
```

Keep this visually subtle.

---

# 10. Dashboard Demand Analytics

Add a section:

## Property Demand

Example:

```text
Most Requested Properties

1. Manhattan 3BR Apartment
   87 Views
   9 Interested
   7 Maybe

2. Brooklyn Townhouse
   61 Views
   12 Interested
   4 Maybe

3. Queens Condo
   43 Views
   3 Interested
   8 Maybe
```

This allows the broker to understand which properties generate the most interest.

---

# 11. New Data Model — Interest Response

Add:

```text
InterestResponse

- id
- property_id
- share_id
- anonymous_session_id
- response
- created_at
- updated_at
```

Where:

```text
response:
  interested
  maybe
  not_interested
```

---

# 12. Multi-Property Share Feedback

For a multi-property share page, each property should independently support feedback.

Example:

```text
You received 3 properties

────────────────────────

Property A

[ Interested ] [ Maybe ] [ Not Interested ]

────────────────────────

Property B

[ Interested ] [ Maybe ] [ Not Interested ]

────────────────────────

Property C

[ Interested ] [ Maybe ] [ Not Interested ]
```

This is important because a client may like one property but reject the others.

The broker should therefore be able to see:

```text
Share Collection

Property A
Interested

Property B
Maybe

Property C
Not Interested
```

---

# 13. Broker Analytics — Interest Funnel

A property can have a simple funnel:

```text
Shares
  ↓
Views
  ↓
Responses
  ↓
Interested
```

Example:

```text
Manhattan Apartment

21 Shares
87 Views
19 Responses
9 Interested
```

This creates a much stronger product story than simply storing properties.

---

# 14. New Feature: Map View

## 14.1 Overview

The broker should have an optional **Map View** of their property inventory.

Instead of only viewing properties as cards/listings, the broker can see their properties plotted geographically.

Example:

```text
┌─────────────────────────────────────────┐
│ Search properties...                    │
│                                         │
│ [List] [Map]                            │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │                                     │ │
│ │       ● Property A                  │ │
│ │                  ● Property B       │ │
│ │                                     │ │
│ │   ● Property C                      │ │
│ │                         ● Property D│ │
│ │                                     │ │
│ │             ● Property E            │ │
│ │                                     │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

# 15. Map Purpose

The map is primarily for **inventory visualization**.

It should allow brokers to answer:

> "Where are my properties located?"

and:

> "What properties do I have around this area?"

It is not intended to become a full GIS application.

---

# 16. Map Interactions

The broker should be able to:

- Zoom in/out
- Pan
- Click property markers
- View property preview
- Open property detail
- Search an area
- Filter properties
- Switch between list and map

---

# 17. Property Marker

Each property should appear as a marker.

Clicking a marker opens a small preview card.

Example:

```text
┌──────────────────────────────┐
│ [Property Image]             │
│                              │
│ Manhattan 3BR Apartment      │
│ $1,250,000                   │
│ 3 Bed · 2 Bath               │
│                              │
│ [View Property]              │
└──────────────────────────────┘
```

---

# 18. Marker Clustering

If many properties are located close together, markers should be clustered.

Example:

```text
        ● 12
```

Clicking the cluster zooms into the area.

This prevents the map from becoming visually unusable.

---

# 19. Map Filters

The existing property filters should also apply to the map.

For example:

```text
Type: Apartment
Price: <$2M
Bedrooms: 3+
Status: Available
```

The map should only display properties matching those filters.

This is an important requirement.

---

# 20. Map/List Synchronization

Map and list views must represent the same dataset.

Example:

```text
Property List
     ↕
Map
```

If the broker filters the list:

```text
3 bedrooms
```

the map should immediately update.

If the broker clicks a map marker, the corresponding property should be identifiable/openable.

---

# 21. Lightweight Map API Strategy

The MVP does **not** need a paid enterprise mapping system.

The implementation should use a lightweight map provider with a free/limited usage tier appropriate for an MVP/demo.

Recommended architectural approach:

```text
Map UI
  ↓
Map rendering library
  ↓
Configurable map provider
  ↓
Tile / geocoding provider
```

The provider must be abstracted behind a small service/module so it can be replaced later.

Possible implementation options include:

- MapLibre GL JS
- Leaflet
- OpenStreetMap-compatible tiles
- A configurable free-tier commercial map provider

The exact provider should be selected based on current free-tier limits and usage terms during implementation.

Do not tightly couple the entire application to a single map vendor.

---

# 22. Address → Coordinates

When a broker enters:

```text
Manhattan, New York
```

the system should obtain:

```text
latitude
longitude
```

where possible.

The property should store coordinates.

Example:

```text
latitude: 40.xxxxx
longitude: -73.xxxxx
```

The map should preferably use stored coordinates rather than geocoding every time the map loads.

---

# 23. Location Privacy

The system should support a distinction between:

### Internal Broker Location

Exact property coordinates.

### Public Share Location

Potentially:

- exact location
- approximate location
- neighborhood only

depending on the broker's sharing preference.

For MVP, the property should have a setting:

```text
Public Location

○ Exact location
○ Approximate area
```

If implementation complexity is too high, default to approximate location on public pages.

---

# 24. Updated Property Data Model

Add:

```text
Property
- latitude
- longitude
- public_location_precision
```

Example:

```text
public_location_precision:
  exact
  approximate
  hidden
```

---

# 25. Updated MVP Navigation

Desktop:

```text
Dashboard
Properties
Map
Analytics
Profile
Settings
```

Mobile:

```text
Home
Properties
Map
Add
Analytics
Profile
```

The Map item should be easy to access but should not overpower the primary property workflow.

---

# 26. Updated MVP Screens

The MVP now includes:

### Public

1. Landing Page
2. Login
3. Registration
4. Public Property Page
5. Public Multi-Property Share Page

### Authenticated

6. Onboarding
7. Dashboard
8. Property List
9. Property Map
10. Add Property
11. Edit Property
12. Property Detail
13. Property Gallery
14. Analytics
15. Profile
16. Settings

---

# 27. Updated Analytics Model

The analytics system now contains:

```text
Property
   │
   ├── Shares
   │
   ├── Views
   │
   └── Interest Responses
          ├── Interested
          ├── Maybe
          └── Not Interested
```

The broker should be able to understand:

> Which properties are being shared?

> Which properties are being viewed?

> Which properties are generating interest?

> Which properties are being rejected?

---

# 28. Updated Dashboard

Recommended dashboard:

```text
┌───────────────────────────────────────────────┐
│ Good afternoon                                │
│ Manage and share your property inventory.     │
│                                               │
│ [+ Add Property]                              │
├───────────┬───────────┬───────────┬───────────┤
│ Properties│ Shares    │ Views     │ Interested│
│    128    │   421     │  1,248    │    96     │
├───────────┴───────────┴───────────┴───────────┤
│                                               │
│ Search properties...                          │
│                                               │
│ [All] [Available] [For Sale] [For Rent]      │
│                                               │
├───────────────────────────────────────────────┤
│                                               │
│ Most Interested Properties                    │
│                                               │
│ Manhattan Apartment      9 Interested         │
│ Brooklyn Townhouse      12 Interested         │
│ Queens Condo             3 Interested         │
│                                               │
├───────────────────────────────────────────────┤
│                                               │
│ Recent Properties                             │
│                                               │
└───────────────────────────────────────────────┘
```

---

# 29. Updated Analytics Acceptance Criteria

The system must:

- Record property shares.
- Record property page views.
- Record interest responses.
- Prevent simple duplicate responses from the same browser/session.
- Allow the recipient to change their response.
- Display interested count.
- Display maybe count.
- Display not-interested count.
- Display response rate.
- Display most-interested properties.
- Display these metrics at property level.
- Display aggregate metrics at dashboard level.

---

# 30. Updated Map Acceptance Criteria

The system must:

- Display properties with valid coordinates.
- Allow map/list switching.
- Allow marker clicking.
- Show property preview.
- Open property detail from marker.
- Respect active filters.
- Support zoom/pan.
- Cluster dense markers.
- Work responsively.
- Gracefully handle properties without coordinates.
- Avoid exposing private/exact public locations unless permitted.

---

# PART II — AI CODING AGENT IMPLEMENTATION PLAN

The application should **not** be built using one giant AI prompt.

The coding agent should receive the prompts sequentially.

Each prompt assumes that:

> **The complete PRD is already available in the AI agent's context.**

Every prompt below explicitly tells the agent to refer back to that PRD.

The agent must treat the PRD as the source of truth.

---

# PROMPT 1 — Project Scaffolding & Architecture

## Objective

Build the complete technical foundation of the application without attempting to fully implement every feature.

## Prompt

```text
You are building the Real Estate Property Hub MVP.

IMPORTANT:
The complete Product Requirements Document (PRD) is already provided in your context. Treat that PRD as the single source of truth for product requirements, architecture, UX behavior, data relationships, and MVP boundaries.

Do not invent features outside the PRD.

For this task, focus ONLY on scaffolding and establishing the application's foundation.

Do NOT attempt to fully implement every product feature yet.

Build a production-quality foundation for the application.

Requirements:

1. Create the application structure.
2. Configure the frontend framework and TypeScript.
3. Configure the backend/API architecture if the selected stack uses a separate backend.
4. Configure database access.
5. Create the initial database schema.
6. Establish User and Organization models.
7. Establish Property, PropertyImage, PropertyDocument, Feature, PropertyFeature, Share, ShareProperty, ViewEvent, and InterestResponse models according to the PRD.
8. Establish organization-level data isolation.
9. Configure authentication architecture.
10. Configure object/file storage architecture for property images and documents.
11. Configure PWA support.
12. Configure routing.
13. Create the global application layout.
14. Create desktop and mobile navigation shells.
15. Create reusable UI primitives.
16. Create environment variable handling.
17. Create basic API/service abstractions.
18. Create a clean folder/component architecture.
19. Establish error handling and loading-state patterns.
20. Establish database migrations/seeding strategy.
21. Establish map-provider abstraction so the map provider can be changed later.
22. Establish analytics/event architecture.
23. Establish public share-token architecture.

IMPORTANT DATA REQUIREMENTS:

Every property must belong to an organization.

Every authenticated request involving private data must verify that the resource belongs to the authenticated user's organization.

Do NOT rely only on frontend filtering for security.

IMPORTANT DESIGN REQUIREMENT:

The initial UI must be BLACK AND WHITE.

Use:
- black
- white
- grayscale
- borders
- subtle shadows
- neutral surfaces

Do NOT use:
- purple
- pink
- blue/purple gradients
- shiny gradients
- neon gradients
- excessive colors

Only reserve small accent colors for semantic states or very limited interactive emphasis.

Allowed subtle accent colors include:
- electric yellow
- electric blue
- electric red
- electric green

These should be used sparingly and preferably as small indicators, badges, icons, or buttons rather than large backgrounds.

The design should feel:
- premium
- minimal
- modern
- editorial
- professional
- real-estate/SaaS
- mobile-first

At the end of this task:

1. Verify the project runs.
2. Verify the database connection works.
3. Verify authentication architecture works.
4. Verify migrations work.
5. Verify the PWA shell works.
6. Verify the routing structure works.
7. Verify the organization data model exists.
8. Verify the application can be started locally without errors.

Do not move to advanced feature implementation until the foundation is stable.

Before making architectural decisions, re-read the PRD and make sure the architecture supports all MVP requirements and the future AI-agent direction without over-engineering.
```

---

# PROMPT 2 — Authentication, Onboarding & Business Profile

## Objective

Build authentication and onboarding completely.

## Prompt

```text
Refer to the complete Real Estate Property Hub PRD already provided in your context.

Continue from the existing project.

For this task, implement ONLY the authentication, onboarding, organization/business profile, and authenticated application-shell functionality.

Do not jump ahead and partially implement unrelated features.

Build this end-to-end.

FEATURES:

1. User registration.
2. User login.
3. Logout.
4. Session persistence.
5. Authentication guards.
6. Forgot-password architecture if supported by the selected auth provider.
7. Organization/business creation.
8. Individual broker profile.
9. Company profile.
10. Profile editing.
11. Profile photo/logo upload architecture.
12. Organization-level ownership.
13. Role foundation:
   - Owner
   - Agent
14. Authenticated dashboard shell.

ONBOARDING:

Create a short onboarding flow based on the PRD.

Step 1:
Ask whether the user is:
- Independent Broker
- Real Estate Company
- Agent

Step 2:
Collect:
- Name
- Business/company name
- Phone
- Email
- Country
- Region/state
- City
- Website where applicable
- Logo/profile photo

Step 3:
Allow the user to either:
- Add their first property
OR
- Skip and enter the dashboard.

Do not make onboarding unnecessarily long.

SECURITY:

Every private page must require authentication.

Every organization-specific resource must be scoped to the authenticated organization.

A user from Organization A must never be able to access Organization B's private data.

DESIGN:

Continue the black-and-white visual system from the PRD.

No purple/pink/blue gradients.

Use grayscale as the dominant visual language.

Use only subtle accent colors for semantic states.

MOBILE:

The entire onboarding flow must work exceptionally well on mobile because this is a PWA.

EXPECTED OUTPUT:

At the end:

- A new user can register.
- The user can log in.
- The user is associated with an organization.
- The user can complete onboarding.
- The user can edit their profile.
- The user can log out.
- Private routes are protected.
- Organization isolation is enforced.
- The authenticated application shell works.
- No major console/runtime errors remain.

Do not start implementing the property CRUD system in this prompt.
```

---

# PROMPT 3 — Property Creation, Media & Documents

## Objective

Build the property management system completely.

## Prompt

```text
Refer to the complete Real Estate Property Hub PRD.

Continue from the existing implementation.

For this task, build the PROPERTY MANAGEMENT SYSTEM end-to-end.

Do not implement analytics, advanced map functionality, AI functionality, or CRM functionality yet.

Build the property creation and editing workflow completely and make it production-quality.

IMPLEMENT:

1. Add Property page.
2. Edit Property page.
3. Property CRUD.
4. Property title.
5. Description.
6. Property type.
7. Listing type.
8. Status.
9. Price.
10. Currency.
11. Bedrooms.
12. Bathrooms.
13. Property size.
14. Size unit.
15. Lot size.
16. Floor.
17. Total floors.
18. Year built.
19. Parking.
20. Furnished status.
21. Country.
22. Region/state.
23. City.
24. Area/neighborhood.
25. Address.
26. Postal code.
27. Latitude/longitude.
28. Property features.
29. Contact information.
30. Internal notes.
31. Property images.
32. Cover image.
33. Image ordering.
34. Image deletion.
35. Property documents.
36. Shareable-document flag.
37. Property status management.
38. Archive functionality.

IMAGE UPLOAD:

Support:
- multiple image selection
- mobile camera where browser-supported
- gallery/file upload
- upload progress
- preview
- reordering
- delete
- cover-image selection

DOCUMENT UPLOAD:

Support:
- PDF
- JPG
- PNG
- WebP

Display:
- filename
- file type
- file size
- upload status
- shareable/private status

IMPORTANT:

Images and documents must use object storage.

Do not store binary files directly in PostgreSQL.

PROPERTY FORM UX:

Use logical sections:

1. Basic Information
2. Photos
3. Property Details
4. Location
5. Features
6. Documents
7. Contact
8. Sharing Settings

On mobile, make the form easy to navigate.

VALIDATION:

Required:
- title
- property type
- listing type
- price
- currency
- country
- city
- at least one image

Add appropriate validation for numeric and contact fields.

INTERNAL NOTES:

Internal notes must NEVER appear on public share pages.

DESIGN:

Continue the existing black/white design system.

Property images should be visually dominant.

Use grayscale UI.

Allowed small semantic accents:
- green for successful states
- red for destructive/error states
- yellow for warnings
- blue only as a small informational accent

No gradients.

EXPECTED OUTPUT:

A broker should be able to:

Create a property
→ upload photos
→ reorder photos
→ set cover photo
→ enter property details
→ add features
→ add documents
→ add contact
→ save property
→ edit property
→ archive property

Verify all of these workflows end-to-end before finishing.

Do not leave placeholder buttons for functionality that is part of this prompt.
```

---

# PROMPT 4 — Property Inventory, Search & Filtering

## Objective

Build the main property discovery experience.

## Prompt

```text
Refer to the complete Real Estate Property Hub PRD.

Continue from the existing project.

Now build the PROPERTY INVENTORY AND DISCOVERY EXPERIENCE completely.

The goal is to make finding an existing property extremely fast.

IMPLEMENT:

1. Property dashboard/list.
2. Property cards.
3. Grid view.
4. List view.
5. Grid/list toggle.
6. Search.
7. Filters.
8. Sorting.
9. Property status filtering.
10. Property detail page.
11. Selection mode for bulk actions.
12. Archive filtering.
13. Empty states.
14. Loading skeletons.
15. Error states.

PROPERTY CARD:

Display:
- cover image
- property title
- price
- currency
- location
- bedrooms
- bathrooms
- size
- important features
- status
- view/share metrics where available
- View action
- Share action placeholder/connection for later sharing implementation

SEARCH:

Search across relevant structured fields:
- title
- property ID
- city
- area
- country
- address
- property type
- features

FILTERS:

Location:
- country
- region
- city
- area

Property:
- property type
- listing type
- status

Specifications:
- bedrooms
- bathrooms
- property size

Price:
- min
- max
- currency

Features:
- parking
- pool
- gym
- furnished
- etc.

SORTING:

- recently added
- recently updated
- price low-high
- price high-low
- property name

PERFORMANCE:

The application should remain usable with 1,000+ properties.

Use:
- pagination or infinite scrolling
- lazy-loaded images
- optimized thumbnails
- backend filtering/search where appropriate

PROPERTY DETAIL:

Create a polished property detail screen containing:
- gallery
- title
- price
- location
- specifications
- description
- features
- documents
- contact
- internal notes
- edit
- archive
- share action

MOBILE:

On mobile, prioritize:
Search
→ Filter
→ Open property
→ Share

DESIGN:

Black-and-white dominant UI.

No purple/pink gradients.

No large colorful surfaces.

Use subtle accents only for:
- status
- warnings
- success
- demand indicators later

EXPECTED OUTPUT:

A broker with hundreds of properties should be able to find a specific property in seconds.

All search and filtering should work with real database data.

Do not use fake/mock data for the final implementation.
```

---

# PROMPT 5 — Public Property Pages & Sharing

## Objective

Build the entire sharing workflow.

## Prompt

```text
Refer to the complete Real Estate Property Hub PRD.

Continue from the existing project.

Now implement the COMPLETE PROPERTY SHARING SYSTEM end-to-end.

This is one of the most important features of the product.

The primary workflow must be:

Open Property
→ Tap Share
→ Generate Share Link
→ Native Share Sheet where supported
→ Recipient opens public property page

IMPLEMENT:

1. Share button.
2. Share record creation.
3. Secure non-guessable share token.
4. Public property URL.
5. Public property page.
6. Public branding.
7. Shareable documents.
8. Copy-link fallback.
9. Web Share API integration.
10. Share analytics event creation.

PUBLIC PROPERTY PAGE:

The recipient must NOT need an account.

Display:
- broker/company logo
- broker/company name
- property photos
- title
- price
- location
- bedrooms
- bathrooms
- size
- description
- features
- shareable documents
- broker contact details

Never expose:
- internal notes
- private documents
- organization-private information
- private analytics

PUBLIC PAGE DESIGN:

It should feel like a premium digital property brochure rather than an internal admin page.

Use:
- large photography
- strong typography
- whitespace
- black/white design
- subtle semantic accents

SHARING:

Preferred:
navigator.share()

Fallback:
Copy Link

Do NOT integrate:
- WhatsApp API
- WhatsApp Cloud API
- Telegram API
- SMS API
- email API

The application only invokes the device/browser's native sharing capabilities.

SHARE MESSAGE:

Generate a useful share title/text containing:
- property title
- location
- price
- key specifications
- public URL

The user can then select WhatsApp, Messages, Telegram, Mail, etc. from their device's native share sheet.

PUBLIC URL:

Use a secure tokenized URL.

Do not use sequential IDs.

ANALYTICS:

When the public page is opened:
- create a view event
- associate it with the share
- associate it with the property
- record timestamp
- use privacy-conscious anonymous/session information

EXPECTED OUTPUT:

The entire workflow must work:

Broker
→ Property
→ Share
→ Public URL
→ Open URL in incognito browser
→ See polished property page
→ View event recorded

Test the public page without authentication.

```

---

# PROMPT 6 — Multi-Property Sharing + Interested/Maybe/Not Interested

## Objective

Build the buyer-interest mechanism and multi-property sharing together.

## Prompt

```text
Refer to the complete Real Estate Property Hub PRD.

Continue from the existing project.

Now implement TWO connected features completely:

1. Multi-property sharing.
2. Recipient interest feedback.

Do not implement the map yet.

==================================================
PART 1 — MULTI-PROPERTY SHARING
==================================================

Allow brokers to enter selection mode in the property inventory.

Example:

☑ Manhattan Apartment
☑ Brooklyn Townhouse
☐ Queens Condo

Then show:

3 selected

[ Share Selected ]

When clicked:

1. Create a share record.
2. Associate multiple properties with that share.
3. Generate a secure share token.
4. Open native share functionality.
5. Provide copy-link fallback.

PUBLIC MULTI-PROPERTY PAGE:

Display:

Broker branding

"3 Properties Shared With You"

Then each property should have:
- cover image
- title
- price
- location
- specifications
- short description
- Open Property action

Each property must retain independent interest feedback.

==================================================
PART 2 — INTEREST FEEDBACK
==================================================

On every public property page show:

"Are you interested in this property?"

Buttons:

[ Interested ]
[ Maybe ]
[ Not Interested ]

The recipient does not need to create an account.

When selected:
- record the response
- associate it with property
- associate it with share
- associate it with an anonymous session identifier
- record created_at
- record updated_at

The same browser/session should not create unlimited duplicate responses.

If the recipient changes their choice:

Interested
→ Maybe

update the existing response.

Do not create a second person.

MULTI-PROPERTY:

Each property gets its own response.

Example:

Property A → Interested
Property B → Maybe
Property C → Not Interested

BROKER ANALYTICS DATA:

Store:
- interested count
- maybe count
- not interested count
- total responses
- response rate
- interest rate

IMPORTANT:

Do not claim these are verified unique human identities.

They are anonymous share/session-level feedback signals.

UI:

The feedback module should be visually prominent enough to discover but not annoying.

After selection show:

"Thanks for your feedback."

Then:

"Your response: Interested"

[Change response]

DESIGN:

Black/white base.

Use only subtle semantic colors:
- green = interested
- yellow = maybe
- red = not interested

Do not use gradients.

Do not use large neon surfaces.

EXPECTED OUTPUT:

Test the complete flow:

Broker selects 3 properties
→ generates one share
→ recipient opens link
→ recipient views properties
→ recipient selects different feedback for each
→ responses are stored
→ duplicate response is prevented
→ response can be changed

All functionality must be real, not mocked.
```

---

# PROMPT 7 — Analytics Dashboard & Demand Intelligence

## Objective

Build the broker-side analytics experience.

## Prompt

```text
Refer to the complete Real Estate Property Hub PRD.

Continue from the existing project.

Now build the BROKER ANALYTICS SYSTEM completely.

Use the actual share, view, and interest-response data already implemented.

Do not use mock analytics data in the final application.

CORE METRICS:

Dashboard-level:

- Total properties
- Active properties
- Total shares
- Total views
- Total interested
- Total maybe
- Total not interested

PROPERTY-LEVEL:

For each property show:

- shares
- views
- interested
- maybe
- not interested
- total responses
- response rate
- interest rate
- last viewed
- last shared

PROPERTY DEMAND:

Create a lightweight demand indicator.

Possible states:

High Interest
Moderate Interest
Low Interest

Base this on real response data.

Do not hide the raw counts behind the label.

Example:

High Interest
9 Interested
7 Maybe
3 Not Interested
87 Views

MOST INTERESTED:

Create a section:

"Most Interested Properties"

Sort based on interested responses.

MOST VIEWED:

Create:

"Most Viewed Properties"

Sort based on view events.

RECENT ACTIVITY:

Show recent:
- property shared
- property viewed
- interest response received

Example:

"Someone viewed Manhattan Apartment"

"Manhattan Apartment received an Interested response"

PRIVACY:

Do not expose recipient identity.

Do not show phone numbers or emails.

Do not claim exact unique people unless the data actually supports that claim.

DESIGN:

Keep analytics visually premium but minimal.

Use:
- black
- white
- grayscale
- subtle borders

Use accent colors only for:
- Interested = subtle green
- Maybe = subtle yellow
- Not Interested = subtle red

Avoid:
- colorful dashboards
- rainbow charts
- purple gradients
- pink
- excessive charts

Prefer simple metric cards, tables, and small visual indicators.

EXPECTED OUTPUT:

The broker should be able to answer:

Which properties are being shared?

Which are being viewed?

Which are generating interest?

Which properties have the highest demand?

Which properties have low interest?

All metrics must come from real stored events.
```

---

# PROMPT 8 — Property Map Experience

## Objective

Build the map-based property inventory.

## Prompt

```text
Refer to the complete Real Estate Property Hub PRD.

Continue from the existing project.

Now implement the PROPERTY MAP EXPERIENCE completely.

The map is an inventory visualization tool, not a complex GIS system.

OBJECTIVE:

Allow a broker to visually see all their properties on a map.

IMPLEMENT:

1. Map page.
2. Map/list toggle.
3. Property markers.
4. Marker clustering.
5. Marker preview card.
6. Open property from marker.
7. Search.
8. Existing property filters.
9. Map synchronization with filters.
10. Zoom.
11. Pan.
12. Empty map state.
13. Properties-without-coordinates handling.

MAP ARCHITECTURE:

Use a lightweight map rendering solution.

Prefer a solution such as:
- MapLibre GL JS
OR
- Leaflet

Use a configurable tile/map provider.

Do not hardwire the application architecture to one vendor.

The map provider must be replaceable later.

If using a free/open map provider, respect its usage policy and rate limits.

GEOCODING:

When property location information is available, convert it into coordinates.

Store:
latitude
longitude

Do not repeatedly geocode every property whenever the map opens.

Use stored coordinates.

MAP MARKER:

Each property with coordinates should appear as a marker.

Click marker:

Show:

Property image
Property title
Price
Location
Key specifications
[View Property]

CLUSTERING:

If many properties are close together:
show a cluster.

Example:

● 14

Click cluster:
zoom into area.

FILTER SYNCHRONIZATION:

If the broker applies:

Apartment
3+ bedrooms
Under $2M

the map must show only those properties.

The map and property list should use the same filter state.

LOCATION PRIVACY:

For internal broker map:
show the stored property coordinates.

Public property pages are controlled separately by public location settings.

PROPERTIES WITHOUT COORDINATES:

Do not crash.

Display a useful state such as:

"12 properties don't have map coordinates."

Optionally provide:

[Add Location]

DESIGN:

The surrounding UI must remain black and white.

The actual map naturally contains geographic imagery/colors because it is third-party map content.

Do not add colorful dashboard chrome around it.

The map should feel like a secondary productivity tool.

MOBILE:

Map must be responsive.

Provide:
- full-width map
- bottom/side property preview
- easy return to list

EXPECTED OUTPUT:

A broker can:

Open Map
→ see property markers
→ zoom
→ click a marker
→ preview property
→ open property
→ apply filters
→ see markers update

Verify it with real property coordinates.
```

---

# PROMPT 9 — PWA, Mobile UX, Native Features & Visual Polish

## Objective

Turn the application into a polished mobile-first PWA.

## Prompt

```text
Refer to the complete Real Estate Property Hub PRD.

Continue from the existing project.

At this stage the major product functionality exists.

Now focus on making the application feel like a polished, premium, mobile-first PWA.

Do NOT add new product features.

Improve the existing features.

==================================================
PWA
==================================================

Verify:

- Web App Manifest
- installability
- icons
- responsive viewport
- service worker
- application shell
- standalone mode where supported
- correct mobile behavior

==================================================
MOBILE UX
==================================================

Optimize:

Dashboard
Property List
Search
Filters
Add Property
Image Upload
Property Detail
Share
Public Property Page
Analytics
Map

The most important mobile workflow is:

Open App
→ Search
→ Find Property
→ Share

This should require minimal interaction.

==================================================
CAMERA
==================================================

Where browser-supported:

Allow the property image workflow to access:
- camera
- gallery/file picker

Do not force the user through a desktop-style upload experience on mobile.

==================================================
NATIVE SHARE
==================================================

Verify:

navigator.share()

where supported.

Fallback:

Copy Link

Do not add WhatsApp APIs.

==================================================
VISUAL SYSTEM
==================================================

IMPORTANT:

The entire product should use a BLACK AND WHITE base design.

Dominant:
- black
- white
- off-white
- grayscale

Use:
- thin borders
- subtle shadows
- restrained radius
- strong typography
- generous whitespace
- large property photography

Accent colors should be extremely limited.

Allowed:
- electric yellow
- electric blue
- electric green
- electric red

Use them only as:
- small buttons
- status indicators
- badges
- feedback states
- icons

DO NOT USE:
- purple
- pink
- blue/purple gradients
- shiny gradients
- glassmorphism-heavy styling
- rainbow UI
- excessive colored backgrounds

The application should look:
minimal
premium
professional
editorial
modern
expensive

==================================================
UX STATES
==================================================

Every major screen must have:

- loading state
- empty state
- error state
- success state

Avoid blank screens.

==================================================
RESPONSIVENESS
==================================================

Test at:

- mobile portrait
- mobile landscape
- tablet
- laptop
- desktop

No horizontal scrolling.

Touch targets must be mobile-friendly.

==================================================
FINAL POLISH
==================================================

Fix:
- inconsistent spacing
- typography
- button sizing
- alignment
- responsive issues
- overflowing text
- broken images
- loading jumps
- awkward forms
- modal sizing
- map mobile layout

Do not change the underlying product requirements.

EXPECTED OUTPUT:

The application should now feel like one coherent product rather than a collection of independently generated pages.
```

---

# PROMPT 10 — Full End-to-End QA, Security, Performance & Production Readiness

## Objective

Perform final product verification rather than adding new features.

## Prompt

```text
Refer to the complete Real Estate Property Hub PRD.

The MVP implementation is now substantially complete.

Do NOT add unrelated features.

Your job is to perform a full end-to-end audit, QA pass, security review, performance review, and production-readiness pass.

Treat the PRD as the acceptance specification.

==================================================
1. AUTHENTICATION QA
==================================================

Verify:

- registration
- login
- logout
- session persistence
- protected routes
- invalid credentials
- expired sessions
- organization isolation

==================================================
2. PROPERTY QA
==================================================

Verify:

- create
- read
- update
- archive
- status changes
- search
- filters
- sorting
- image upload
- image ordering
- cover image
- image deletion
- documents
- shareable documents
- contact information
- internal notes

==================================================
3. SHARING QA
==================================================

Verify:

Property
→ Share
→ Share token
→ Public URL
→ Public page
→ View event

Verify:

- native share
- copy-link fallback
- secure token
- unauthenticated public access
- private data protection

==================================================
4. MULTI-PROPERTY QA
==================================================

Verify:

Select multiple
→ Share Selected
→ Collection share
→ Public collection page
→ Individual property pages

==================================================
5. INTEREST FEEDBACK QA
==================================================

Verify:

Interested
Maybe
Not Interested

Verify:

- response stored
- duplicate prevented
- response can be changed
- property-level counts
- multi-property independent responses
- analytics updated correctly

==================================================
6. ANALYTICS QA
==================================================

Verify:

- views
- shares
- interested
- maybe
- not interested
- response rates
- demand indicators
- most viewed
- most interested

Make sure analytics are based on actual database records.

==================================================
7. MAP QA
==================================================

Verify:

- properties with coordinates appear
- markers work
- clusters work
- marker preview works
- property opens correctly
- filters affect map
- list/map state remains consistent
- missing coordinates do not crash
- mobile map works

==================================================
8. SECURITY AUDIT
==================================================

Check for:

- cross-organization data access
- insecure IDs
- authorization bypass
- exposed private documents
- exposed internal notes
- insecure public share tokens
- unrestricted file upload
- invalid file types
- oversized files
- injection vulnerabilities
- missing backend validation

Do not trust frontend authorization.

==================================================
9. PERFORMANCE
==================================================

Test:

- 100 properties
- 500 properties
- 1,000+ properties

Check:

- property list
- search
- filters
- images
- map
- dashboard

Use:
- pagination/infinite scrolling
- image optimization
- lazy loading
- caching where appropriate

==================================================
10. MOBILE/PWA
==================================================

Test:

- iPhone-sized viewport
- Android-sized viewport
- tablet
- desktop

Verify:
- installability
- camera
- file upload
- native share
- responsive layout

==================================================
11. DESIGN QA
==================================================

The final design must remain:

BLACK + WHITE + GRAYSCALE

Only small semantic accents are allowed.

Absolutely avoid:

- purple
- pink
- blue/purple gradients
- shiny gradients
- excessive colors
- rainbow dashboards

Fix visual inconsistencies across pages.

==================================================
12. PRD COMPLIANCE
==================================================

Go through the PRD section by section.

Create an internal implementation checklist.

For every MVP requirement:

PASS
FAIL
PARTIAL

Fix all P0 failures.

Do not declare completion while P0 functionality is broken.

==================================================
13. FINAL OUTPUT
==================================================

At the end, provide:

1. What was tested.
2. What was fixed.
3. Any remaining limitations.
4. Any environment variables required.
5. Any third-party API configuration required.
6. Any deployment requirements.
7. Any known browser compatibility limitations.

Most importantly:

Do not simply say "everything works."

Actually inspect the implementation and verify the critical workflows.

The final MVP should be demonstrable to a real estate client from start to finish.
```

---

# PART III — RECOMMENDED EXECUTION ORDER

The prompts should be given to the AI coding agent **one at a time**, in this exact order:

```text
PROMPT 1
Foundation / Architecture
        ↓
PROMPT 2
Authentication + Onboarding
        ↓
PROMPT 3
Property Creation + Media
        ↓
PROMPT 4
Property Inventory + Search
        ↓
PROMPT 5
Public Pages + Sharing
        ↓
PROMPT 6
Multi-Property + Interest Feedback
        ↓
PROMPT 7
Analytics + Demand Intelligence
        ↓
PROMPT 8
Map Experience
        ↓
PROMPT 9
PWA + Mobile + Visual Polish
        ↓
PROMPT 10
QA + Security + Production Readiness
```

The important principle is:

> **Do not give all ten prompts to the coding agent at once.**

Give it **Prompt 1**, let it implement and verify the foundation, then provide **Prompt 2**, and continue sequentially.

---

# PART IV — FINAL MVP FEATURE TREE

After all ten prompts are completed, the application should have this structure:

```text
REAL ESTATE PROPERTY HUB
│
├── AUTHENTICATION
│   ├── Register
│   ├── Login
│   └── Session
│
├── ORGANIZATION
│   ├── Broker Profile
│   ├── Company Profile
│   └── Agents
│
├── PROPERTY INVENTORY
│   ├── Property Cards
│   ├── Grid
│   ├── List
│   ├── Search
│   ├── Filters
│   ├── Sorting
│   └── Status
│
├── PROPERTY
│   ├── Details
│   ├── Photos
│   ├── Documents
│   ├── Features
│   ├── Contact
│   ├── Location
│   └── Internal Notes
│
├── MAP
│   ├── Property Markers
│   ├── Clusters
│   ├── Search
│   ├── Filters
│   └── Property Preview
│
├── SHARING
│   ├── Single Property
│   ├── Multiple Properties
│   ├── Public Link
│   ├── Native Share
│   └── Copy Link
│
├── RECIPIENT EXPERIENCE
│   ├── Property Page
│   ├── Gallery
│   ├── Broker Details
│   └── Interest Feedback
│       ├── Interested
│       ├── Maybe
│       └── Not Interested
│
├── ANALYTICS
│   ├── Shares
│   ├── Views
│   ├── Interested
│   ├── Maybe
│   ├── Not Interested
│   ├── Demand
│   └── Top Properties
│
└── PWA
    ├── Installable
    ├── Camera
    ├── File Picker
    └── Native Share
```

# PART V — THE MVP STORY FOR THE CLIENT

The strongest way to position the MVP is no longer simply:

> "A place to store property listings."

Instead:

> **"A digital property inventory that lets brokers organize every property, find the right one instantly, share it with a client in one tap, and understand which properties the client is actually interested in."**

The complete loop is:

```text
BROKER
   │
   │ uploads
   ▼
PROPERTY LIBRARY
   │
   ├──────────────┐
   │              │
   ▼              ▼
SEARCH          MAP
   │              │
   └──────┬───────┘
          ▼
       PROPERTY
          │
          │ Share
          ▼
      CLIENT
          │
          ▼
    PUBLIC PAGE
          │
          ▼
  ┌───────────────────┐
  │ Interested        │
  │ Maybe             │
  │ Not Interested    │
  └─────────┬─────────┘
            ▼
       ANALYTICS
            │
            ▼
     PROPERTY DEMAND
```

That makes the MVP substantially more compelling because it demonstrates the foundation of the **future AI real-estate agent** without prematurely trying to build the AI agent itself.

The future AI layer can eventually sit directly on top of this structured system:

```text
             FUTURE AI AGENT
                   │
       ┌───────────┼───────────┐
       ▼           ▼           ▼
   AI Search   Voice Agent  Calling Agent
       │           │           │
       └───────────┼───────────┘
                   ▼
          PROPERTY KNOWLEDGE
              DATABASE
                   │
        ┌──────────┼──────────┐
        ▼          ▼          ▼
     Listings    Clients   Analytics
```

So the MVP remains **small enough to build**, but the underlying data model and workflows are deliberately designed to become the foundation of the larger product.