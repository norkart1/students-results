# Result Management System

## Overview
This is a Next.js-based Result Management System for ASAS Maliki Examination. The application allows students to check their examination results and provides an admin panel for managing students, batches, subjects, and results.

## Project Status
Successfully migrated from Vercel to Replit on October 5, 2025.

## Recent Changes
- **2025-10-05**: Migrated from Vercel to Replit
  - Configured Next.js dev and production servers to bind to 0.0.0.0:5000 for Replit compatibility
  - Set up pnpm as the package manager
  - Configured all required environment variables (MONGODB_URI, ADMIN_USERNAME, ADMIN_PASSWORD, SUPABASE_URL, SUPABASE_ANON_KEY)
  - Set up deployment configuration for autoscale deployment
  - Verified application runs successfully on Replit

## Technology Stack
- **Framework**: Next.js 15.2.4 (React 19)
- **Database**: MongoDB (via Mongoose)
- **Storage**: Supabase (for student photos)
- **UI Components**: Radix UI, Tailwind CSS
- **Forms**: React Hook Form with Zod validation
- **Package Manager**: pnpm

## Project Architecture
- **app/**: Next.js App Router structure
  - **admin/**: Admin panel pages (batches, students, subjects, results, reports, settings)
  - **admin-login/**: Admin authentication
  - **api/**: API routes for backend operations
  - **result/[regNumber]/**: Public result viewing page
- **components/**: Reusable UI components
  - **admin/**: Admin-specific components
  - **ui/**: shadcn/ui component library
- **lib/**: Utility functions and database connection
- **models/**: Mongoose database models
- **hooks/**: Custom React hooks

## Environment Variables
Required secrets (configured in Replit Secrets):
- `MONGODB_URI`: MongoDB connection string
- `ADMIN_USERNAME`: Admin login username
- `ADMIN_PASSWORD`: Admin login password
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anonymous key

## Development
- Run development server: `pnpm run dev`
- Build for production: `pnpm run build`
- Start production server: `pnpm run start`
- Server runs on port 5000 and binds to 0.0.0.0 for Replit compatibility

## Deployment
Configured for Replit autoscale deployment:
- Build command: `pnpm run build`
- Start command: `pnpm run start`
- Port: 5000

## Key Features
- Student result lookup by registration number
- Admin panel for managing:
  - Students (with photo upload to Supabase)
  - Batches
  - Subjects
  - Results (with bulk upload support)
  - Reports and analytics
  - User management
- PDF generation for result cards
- Responsive design with dark mode support
