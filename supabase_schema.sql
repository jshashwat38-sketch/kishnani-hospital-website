-- Supabase Database Schema for Kishnani Hospital ERP & Website

-- 1. CLINICAL APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    patient_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    date DATE NOT NULL,
    time TEXT NOT NULL,
    department TEXT NOT NULL,
    doctor TEXT NOT NULL,
    priority TEXT DEFAULT 'Standard'::text, -- Standard, Urgent, Emergency
    status TEXT DEFAULT 'Pending'::text,   -- Pending, Approved, Completed, Cancelled
    notes TEXT
);

-- 2. ENQUIRIES & LEADS TABLE
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'Unread'::text, -- Unread, In Progress, Resolved
    notes TEXT
);

-- 3. EMPANELLED DOCTORS TABLE
CREATE TABLE IF NOT EXISTS public.doctors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    specialty TEXT NOT NULL,
    role TEXT NOT NULL,
    image_url TEXT,
    timing TEXT NOT NULL,
    days TEXT NOT NULL,
    on_call BOOLEAN DEFAULT false,
    patients_today INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Available'::text -- Available, On Leave, In Surgery
);

-- 4. CLINICAL DEPARTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT UNIQUE NOT NULL,
    icon TEXT NOT NULL,
    doctors_count INTEGER DEFAULT 0,
    opd_limit INTEGER DEFAULT 30,
    patients_count INTEGER DEFAULT 0,
    hod TEXT,
    active BOOLEAN DEFAULT true,
    description TEXT
);

-- 5. CMS WEBSITE DATA TABLE (Dynamic content block config)
CREATE TABLE IF NOT EXISTS public.cms_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    section_key TEXT UNIQUE NOT NULL, -- e.g., 'hero', 'about', 'packages'
    content JSONB NOT NULL
);

-- 6. MEDICAL BLOGS TABLE
CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    category TEXT NOT NULL,
    tags TEXT[],
    read_time TEXT DEFAULT '5 min read'::text,
    date TEXT NOT NULL,
    image_url TEXT,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'Published'::text, -- Draft, Published, Scheduled
    seo_keywords TEXT
);

-- 7. PATIENT TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    treatment TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    comment TEXT NOT NULL,
    sentiment TEXT DEFAULT 'Positive'::text, -- Positive, Neutral, Negative
    approved BOOLEAN DEFAULT false
);

-- Enable Row Level Security (RLS) or public access for demo purposes
-- (For this application, we allow public read/write to allow forms and dashboard sync)
ALTER TABLE public.appointments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_data DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials DISABLE ROW LEVEL SECURITY;

-- Turn on Realtime Replication for Appointments & Leads
alter publication supabase_realtime add table appointments;
alter publication supabase_realtime add table leads;
alter publication supabase_realtime add table cms_data;
alter publication supabase_realtime add table doctors;
alter publication supabase_realtime add table testimonials;
