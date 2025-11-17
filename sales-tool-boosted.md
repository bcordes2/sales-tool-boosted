IMPORTANT
Always read project-name.md before writing any code (I have created this)
After adding a major feature or completing a milestone, update project-name.md
Document the entire database schema in project-name.md
For new migrations, make sure to add them to the migrations directory

## Project Overview
Sales Tool Boosted is a Next.js application that allows Metal America sales team members to search for metal building partners by zip code and width, or filter by specific manufacturers. The application displays partner information including pricing, ratings, coverage maps, and contact details.

## Environment Variables (.env.local)

### Supabase 
NEXT_PUBLIC_SUPABASE_URL=########
NEXT_PUBLIC_SUPABASE_ANON_KEY=#######

### Firebase 
NEXT_PUBLIC_FIREBASE_API_KEY=########
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=########
NEXT_PUBLIC_FIREBASE_PROJECT_ID=########
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=########
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=########
NEXT_PUBLIC_FIREBASE_APP_ID=########
NEXT_PUBLIC_MEASUREMENT_ID=########

## Database Schema

### Table: manufcover
Stores manufacturer coverage information by zip code.

**Columns:**
- `manufacturer` (string) - Manufacturer name
- `areacode` (number) - Zip code for coverage area
- `delivery` (string, nullable) - Lead time/delivery information
- `city` (string, nullable) - City name
- `state1` (string, nullable) - State abbreviation

**Purpose:** Maps which manufacturers service which zip codes, along with delivery information.

### Table: manufinfo
Stores detailed manufacturer information.

**Columns:**
- `key` (number) - Primary key
- `manufacturer` (string) - Manufacturer name
- `website` (string, nullable) - Manufacturer website URL
- `margin` (string, nullable) - Commission/margin information
- `designtool` (string, nullable) - Design tool URL
- `logininfo` (string, nullable) - Manufacturer discount/login information
- `coveragemap` (string, nullable) - Coverage map URL
- `primaryrto` (string, nullable) - Primary RTO partner name
- `primaryrtolink` (string, nullable) - Primary RTO information URL
- `phonenumber` (string, nullable) - Contact phone number
- `rating` (number, nullable) - Star rating (0-5)

**Purpose:** Central repository of manufacturer details, contact info, and resources.

### Table: trusstypes
Stores pricing information by manufacturer and building width.

**Columns:**
- `manufacturer` (string) - Manufacturer name
- `product` (string) - Width category (e.g., "12-24 Wide", "25-30 Wide", "31+ Wide")
- `price` (number, nullable) - Base price for that width category

**Purpose:** Pricing matrix for different building widths by manufacturer.

## Database Functions (RPC)

### Function: trussfilter
Searches for partners by zip code and width.

**Parameters:**
- `zipcode_input` (integer) - Zip code to search
- `trusstype_input` (text) - Width category (e.g., "12-24 Wide")

**Returns:** Array of objects containing:
- All manufcover fields (c_manufacturer, c_city, c_state, c_leadTime, c_zipcode)
- All manufinfo fields (p_margin, p_primaryrto, p_primaryrtolink, p_phonenumber, p_coverage, p_website, p_tool, p_login, p_rating)
- All trusstypes fields (pt_product, pt_price)

**SQL Logic:**
Joins manufcover, manufinfo, and trusstypes tables where:
- manufcover.areacode matches zipcode_input
- trusstypes.product matches trusstype_input
- All tables joined on manufacturer name

### Function: manufacturerfilter
Filters manufacturers by name or returns all manufacturers.

**Parameters:**
- `manufacturer_input` (text) - Manufacturer name or "All"

**Returns:** Array of manufinfo table rows

**SQL Logic:**
- If manufacturer_input = "All", returns all rows from manufinfo
- Otherwise, returns rows where manufacturer = manufacturer_input

## Application Architecture

### Tech Stack
- **Framework:** Next.js 15.5+ (App Router)
- **UI:** React 19+, Tailwind CSS
- **Authentication:** Firebase Authentication (Email/Password)
- **Database:** Supabase (PostgreSQL with RLS enabled)
- **Deployment:** Railway

### Directory Structure
```
app/
├── api/
│   ├── get-partners/route.ts       # API route for zip + width search
│   └── get-manufacturers/route.ts  # API route for manufacturer search
├── components/
│   ├── auth/
│   │   └── ProtectedRoute.tsx      # Route protection wrapper
│   ├── form/
│   │   └── Form.tsx                # Search form component
│   ├── layout/
│   │   ├── Header.tsx              # App header with logout
│   │   └── Footer.tsx              # App footer with social links
│   ├── results/
│   │   └── Results.tsx             # Results display (3-col grid)
│   └── ui/
│       ├── Button.tsx              # Reusable button component
│       ├── Input.tsx               # Reusable input component
│       └── Select.tsx              # Reusable select component
├── contexts/
│   └── AuthContext.tsx             # Firebase auth state management
├── hooks/
│   └── useAuth.ts                  # Auth hook for components
├── lib/
│   ├── firebase/
│   │   └── config.ts               # Firebase initialization
│   ├── supabase/
│   │   ├── clients.ts              # Supabase client setup
│   │   └── database.types.ts       # TypeScript database types
│   └── utils/
│       └── constants.ts            # Width options & manufacturers
├── login/
│   └── page.tsx                    # Login page
├── globals.css                     # Global styles
├── layout.tsx                      # Root layout
└── page.tsx                        # Home page (main app)

public/                             # Static assets (logos, icons)
```

### Authentication Flow
1. User visits application → Redirected to `/login` (if not authenticated)
2. User clicks "Sign in with Google" → Google OAuth popup appears
3. User selects Google account → Firebase authenticates
4. Email domain validated (must be @metalbuildingsnorthamerica.com)
5. Email must be verified
6. On success → Redirected to home page
7. User info displayed in header with logout button

### Data Flow
1. **Zip Code + Width Search:**
   - User enters zip code and selects width
   - Form submits to `/api/get-partners` (POST)
   - API uses service role key to call `trussfilter` RPC
   - Results returned and displayed in 3-column grid

2. **Manufacturer Search:**
   - User clicks dropdown (▼) and selects manufacturer
   - Form submits to `/api/get-manufacturers` (POST)
   - API uses service role key to call `manufacturerfilter` RPC
   - Results returned and displayed in 3-column grid

### Security Model
- **RLS Enabled:** All Supabase tables have Row Level Security enabled
- **API Routes:** Use service role key to bypass RLS (server-side only)
- **Client:** Uses anon key (no direct database access)
- **Authentication:** Firebase protects all routes except `/login`

## Brand Colors
- **Primary:** Red (#ff2400)
- **Neutral:** Black (#000000), White (#ffffff)
- **Action Buttons:**
  - Coverage Map: Green (#4CAF50)
  - Website: Blue (#2196F3)
  - Design Tool: Purple (#9C27B0)
  - REID Manu Info: Orange-Red (#FF5722)
  - View Design: Orange (#FF9800)

## Responsive Design
- **Desktop (lg):** 3 result cards per row
- **Tablet (md):** 2 result cards per row
- **Mobile:** 1 result card per row
- Forms and layouts stack appropriately on mobile

## External Links
- **Sales Tax Calculator:** https://metalbuildingsnorthamerica.com/sales-tax-calculator/
- **Customer Service Tickets:** https://supportmia.metalbuildingsnorthamerica.com/login

## Deployment Notes

### Railway Deployment
1. Connect GitHub repository to Railway
2. Add environment variables in Railway dashboard:
   - All Supabase variables (URL, anon key, service role key)
   - All Firebase variables (API key, auth domain, project ID, etc.)
3. Railway will auto-detect Next.js and configure build commands
4. Add Railway domain to Firebase authorized domains

### Build Commands
- **Install:** `npm install`
- **Build:** `npm run build`
- **Start:** `npm start`
- **Dev:** `npm run dev`

## Key Features
✅ Firebase Google OAuth authentication
✅ Protected routes with automatic redirect
✅ Dual search modes (zip+width or manufacturer)
✅ Secure API routes with service role key
✅ Responsive 3-column card grid
✅ Star ratings with visual display
✅ Color-coded action buttons
✅ External link integration
✅ Mobile-first responsive design
✅ Brand-consistent styling

## Future Enhancements
- Add search history/favorites
- Export results to PDF/CSV
- Advanced filtering (by state, rating, price range)
- User role management (admin vs. sales rep)
- Analytics dashboard
