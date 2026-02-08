# PotenHire - Product Requirements Document

## Overview
PotenHire is a job hiring platform designed for Korean-speaking foreigners. It connects foreign talent who can speak Korean with verified job postings from employers in Korea.

## Target Users
1. **Job Seekers (Seekers)**: Foreigners who speak Korean and are looking for employment
2. **Employers**: Companies looking to hire Korean-speaking foreign workers

## Core Features

### 1. Authentication
- **Google OAuth Login**: Users can sign in using their Google account
- Single sign-on experience via Supabase Auth
- Automatic profile creation flow after first login

### 2. Landing Page
- Hero section with platform introduction
- Statistics showing member count and employer count
- "How it works" section explaining the platform
- Preview of latest job postings
- Call-to-action sections for both seekers and employers

### 3. Onboarding Flow
After first login, users choose their role:
- **Seeker Onboarding**:
  - Select nationality
  - Enter TOPIK (Korean language proficiency) level
  - Select occupation
  - Choose referral source
- **Employer Onboarding**:
  - Enter company name
  - Choose referral source

### 4. Job Listings
- Browse all published job postings
- Filter by:
  - Target nationality (e.g., Vietnamese, Chinese, etc.)
  - Work location type (on-site, remote, hybrid)
  - Location country
- Sort by: Latest or Popular (view count)
- Pagination for large result sets

### 5. Job Detail Page
- Full job description
- Company information
- Apply or save/like functionality
- Share options

### 6. My Page (User Profile)
- View and edit profile information
- View liked/saved jobs
- Manage account settings

### 7. Employer Features
- Create new job postings
- Manage existing posts
- Toggle hiring status
- View submission statistics

## User Flows

### Flow 1: New User Registration
1. User visits homepage
2. Clicks "Login" or "Get Started"
3. Redirected to login page
4. Clicks "Continue with Google" button
5. Authenticates with Google
6. Redirected to onboarding page
7. Selects role (Seeker or Employer)
8. Fills out profile form
9. Redirected to homepage as logged-in user

### Flow 2: Browse and Apply for Jobs
1. User navigates to /jobs
2. Uses filters to narrow down results
3. Clicks on job listing to view details
4. If interested, clicks apply or saves job

### Flow 3: Employer Posts a Job
1. Employer logs in
2. Navigates to "New Post" (/employer/new-post)
3. Fills out job posting form
4. Submits for review
5. Admin approves post
6. Post becomes visible to seekers

## Technical Stack
- Frontend: Next.js 15, React 19, TypeScript
- Styling: Tailwind CSS 4, Radix UI
- Backend: Supabase (PostgreSQL, Auth, Storage)
- Deployment: Vercel
