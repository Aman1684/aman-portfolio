-- ============================================
-- AMAN PORTFOLIO: INITIAL CONTENT SCHEMA
-- Existing admin_users and is_admin() preserved
-- ============================================

-- 1. PROFILES
create table if not exists public.profiles (
    id uuid primary key default gen_random_uuid(),
    full_name text not null default 'Aman Kumar',
    headline text,
    bio text,
    location text,
    email text,
    github_url text,
    linkedin_url text,
    website_url text,
    avatar_url text,
    resume_url text,
    updated_at timestamptz not null default now()
);

-- 2. PROJECTS
create table if not exists public.projects (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    slug text not null unique,
    description text,
    problem text,
    approach text,
    implementation text,
    results text,
    learnings text,
    category text,
    tech_stack text[] not null default '{}',
    cover_image text,
    github_url text,
    live_url text,
    featured boolean not null default false,
    status text not null default 'draft'
        check (status in ('draft', 'published')),
    start_date date,
    end_date date,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- 3. PROJECT IMAGES
create table if not exists public.project_images (
    id uuid primary key default gen_random_uuid(),
    project_id uuid not null references public.projects(id) on delete cascade,
    image_url text not null,
    alt_text text,
    sort_order integer not null default 0,
    created_at timestamptz not null default now()
);

-- 4. EXPERIENCES
create table if not exists public.experiences (
    id uuid primary key default gen_random_uuid(),
    company text not null,
    role text not null,
    employment_type text,
    location text,
    description text,
    achievements text[] not null default '{}',
    technologies text[] not null default '{}',
    start_date date,
    end_date date,
    is_current boolean not null default false,
    created_at timestamptz not null default now()
);

-- 5. EDUCATION
create table if not exists public.education (
    id uuid primary key default gen_random_uuid(),
    institution text not null,
    degree text,
    field_of_study text,
    grade text,
    description text,
    start_date date,
    end_date date,
    created_at timestamptz not null default now()
);

-- 6. SKILLS
create table if not exists public.skills (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    category text,
    proficiency text,
    sort_order integer not null default 0,
    created_at timestamptz not null default now()
);

-- 7. RESEARCH
create table if not exists public.research (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    slug text not null unique,
    abstract text,
    methodology text,
    findings text,
    category text,
    technologies text[] not null default '{}',
    paper_url text,
    github_url text,
    dataset_url text,
    status text not null default 'draft'
        check (status in ('draft', 'published')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- 8. POSTS / BLOG
create table if not exists public.posts (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    slug text not null unique,
    excerpt text,
    content text,
    cover_image text,
    tags text[] not null default '{}',
    status text not null default 'draft'
        check (status in ('draft', 'published')),
    published_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- 9. CONTACT MESSAGES
create table if not exists public.contact_messages (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    email text not null,
    subject text,
    message text not null,
    status text not null default 'unread'
        check (status in ('unread', 'read', 'replied', 'archived')),
    created_at timestamptz not null default now()
);

-- ============================================
-- INDEXES
-- ============================================

create index if not exists idx_projects_status
    on public.projects(status);

create index if not exists idx_projects_featured
    on public.projects(featured);

create index if not exists idx_project_images_project
    on public.project_images(project_id);

create index if not exists idx_research_status
    on public.research(status);

create index if not exists idx_posts_status
    on public.posts(status);

create index if not exists idx_experiences_start_date
    on public.experiences(start_date);

create index if not exists idx_contact_messages_status
    on public.contact_messages(status);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_images enable row level security;
alter table public.experiences enable row level security;
alter table public.education enable row level security;
alter table public.skills enable row level security;
alter table public.research enable row level security;
alter table public.posts enable row level security;
alter table public.contact_messages enable row level security;

-- ============================================
-- PROFILES POLICIES
-- ============================================

create policy "Public can read profiles"
on public.profiles for select
to anon, authenticated
using (true);

create policy "Admins manage profiles"
on public.profiles for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

-- ============================================
-- PROJECTS POLICIES
-- ============================================

create policy "Public can read published projects"
on public.projects for select
to anon, authenticated
using (status = 'published');

create policy "Admins manage projects"
on public.projects for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

-- ============================================
-- PROJECT IMAGES POLICIES
-- ============================================

create policy "Public can read published project images"
on public.project_images for select
to anon, authenticated
using (
    exists (
        select 1
        from public.projects
        where projects.id = project_images.project_id
          and projects.status = 'published'
    )
);

create policy "Admins manage project images"
on public.project_images for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

-- ============================================
-- EXPERIENCES POLICIES
-- ============================================

create policy "Public can read experiences"
on public.experiences for select
to anon, authenticated
using (true);

create policy "Admins manage experiences"
on public.experiences for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

-- ============================================
-- EDUCATION POLICIES
-- ============================================

create policy "Public can read education"
on public.education for select
to anon, authenticated
using (true);

create policy "Admins manage education"
on public.education for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

-- ============================================
-- SKILLS POLICIES
-- ============================================

create policy "Public can read skills"
on public.skills for select
to anon, authenticated
using (true);

create policy "Admins manage skills"
on public.skills for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

-- ============================================
-- RESEARCH POLICIES
-- ============================================

create policy "Public can read published research"
on public.research for select
to anon, authenticated
using (status = 'published');

create policy "Admins manage research"
on public.research for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

-- ============================================
-- POSTS POLICIES
-- ============================================

create policy "Public can read published posts"
on public.posts for select
to anon, authenticated
using (status = 'published');

create policy "Admins manage posts"
on public.posts for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

-- ============================================
-- CONTACT MESSAGE POLICIES
-- ============================================

create policy "Anyone can submit contact messages"
on public.contact_messages for insert
to anon, authenticated
with check (true);

create policy "Admins manage contact messages"
on public.contact_messages for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

-- ============================================
-- TABLE PERMISSIONS
-- ============================================

grant usage on schema public to anon, authenticated;

grant select on
    public.profiles,
    public.projects,
    public.project_images,
    public.experiences,
    public.education,
    public.skills,
    public.research,
    public.posts
to anon, authenticated;

grant insert on public.contact_messages
to anon, authenticated;

grant select, insert, update, delete on
    public.profiles,
    public.projects,
    public.project_images,
    public.experiences,
    public.education,
    public.skills,
    public.research,
    public.posts,
    public.contact_messages
to authenticated;