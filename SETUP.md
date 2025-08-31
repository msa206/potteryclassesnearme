# Pottery Classes Directory - Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Supabase

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Update `.env.local` with your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Run Database Migrations

In your Supabase SQL editor:
1. Execute `supabase/migrations/001_initial_schema.sql`
2. Import your CSV data to `providers_raw` table
3. Execute `supabase/migrations/002_transform_data.sql`

### 4. Start Development
```bash
npm run dev
```

## Project Features

✅ **100% Server-Side Rendered** - No client components  
✅ **SEO Optimized** - SSG with ISR (24h revalidation)  
✅ **Pottery Theme** - Custom Tailwind colors  
✅ **MDX Content** - Dynamic city content  
✅ **Search** - Server actions with redirects  
✅ **Complete Routing** - Cities, states, ZIPs, providers  

## Build for Production
```bash
npm run build
```

The build includes a guard script that prevents any "use client" directives.