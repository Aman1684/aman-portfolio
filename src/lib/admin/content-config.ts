export const adminCollections = [
  "projects",
  "experiences",
  "education",
  "skills",
  "research",
  "posts",
  "contact_messages",
  "profiles",
] as const;

export type AdminCollection = (typeof adminCollections)[number];

export type AdminField = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "url" | "date" | "email" | "number" | "checkbox" | "list" | "select";
  required?: boolean;
  options?: readonly string[];
  hint?: string;
  readOnly?: boolean;
};

export const adminCollectionConfig: Record<AdminCollection, { title: string; description: string; fields: readonly AdminField[] }> = {
  projects: {
    title: "Projects",
    description: "Manage published work and detailed case studies.",
    fields: [
      { name: "title", label: "Title", required: true },
      { name: "slug", label: "URL slug", required: true },
      { name: "description", label: "Short description", type: "textarea" },
      { name: "category", label: "Category" },
      { name: "tech_stack", label: "Technologies", type: "list", hint: "One item per line or comma-separated." },
      { name: "cover_image", label: "Cover image URL", type: "url" },
      { name: "github_url", label: "GitHub URL", type: "url" },
      { name: "live_url", label: "Live URL", type: "url" },
      { name: "problem", label: "Problem", type: "textarea" },
      { name: "approach", label: "Approach", type: "textarea" },
      { name: "implementation", label: "Implementation", type: "textarea" },
      { name: "results", label: "Results (verified only)", type: "textarea" },
      { name: "learnings", label: "Learnings", type: "textarea" },
      { name: "start_date", label: "Start date", type: "date" },
      { name: "end_date", label: "End date", type: "date" },
      { name: "featured", label: "Featured", type: "checkbox" },
      { name: "status", label: "Status", type: "select", options: ["draft", "published"] },
    ],
  },
  experiences: {
    title: "Experience",
    description: "Manage internships and other verified professional experience.",
    fields: [
      { name: "company", label: "Organization", required: true },
      { name: "role", label: "Role", required: true },
      { name: "employment_type", label: "Type" },
      { name: "location", label: "Location" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "achievements", label: "Responsibilities / achievements", type: "list", hint: "Only include claims you can substantiate." },
      { name: "technologies", label: "Technologies", type: "list" },
      { name: "start_date", label: "Start date", type: "date" },
      { name: "end_date", label: "End date", type: "date" },
      { name: "is_current", label: "Current role", type: "checkbox" },
    ],
  },
  education: {
    title: "Education",
    description: "Manage academic history.",
    fields: [
      { name: "institution", label: "Institution", required: true },
      { name: "degree", label: "Degree" },
      { name: "field_of_study", label: "Field of study" },
      { name: "grade", label: "Grade (optional)" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "start_date", label: "Start date", type: "date" },
      { name: "end_date", label: "End date", type: "date" },
    ],
  },
  skills: {
    title: "Skills",
    description: "Manage technical skills and display order.",
    fields: [
      { name: "name", label: "Skill", required: true },
      { name: "category", label: "Category" },
      { name: "proficiency", label: "Proficiency label" },
      { name: "sort_order", label: "Sort order", type: "number" },
    ],
  },
  research: {
    title: "Research",
    description: "Manage research notes. Publish only completed, verified work.",
    fields: [
      { name: "title", label: "Title", required: true },
      { name: "slug", label: "URL slug", required: true },
      { name: "abstract", label: "Abstract", type: "textarea" },
      { name: "methodology", label: "Methodology", type: "textarea" },
      { name: "findings", label: "Findings", type: "textarea" },
      { name: "category", label: "Topic" },
      { name: "technologies", label: "Methods / tools", type: "list" },
      { name: "paper_url", label: "Paper URL", type: "url" },
      { name: "github_url", label: "Code URL", type: "url" },
      { name: "dataset_url", label: "Dataset URL", type: "url" },
      { name: "status", label: "Status", type: "select", options: ["draft", "published"] },
    ],
  },
  posts: {
    title: "Blog",
    description: "Write and publish articles. Content is stored as plain text/Markdown source.",
    fields: [
      { name: "title", label: "Title", required: true },
      { name: "slug", label: "URL slug", required: true },
      { name: "excerpt", label: "Excerpt", type: "textarea" },
      { name: "content", label: "Article content (Markdown source)", type: "textarea" },
      { name: "cover_image", label: "Cover image URL", type: "url" },
      { name: "tags", label: "Tags", type: "list" },
      { name: "status", label: "Status", type: "select", options: ["draft", "published"] },
      { name: "published_at", label: "Published at", type: "date" },
    ],
  },
  contact_messages: {
    title: "Messages",
    description: "Review contact submissions, update their status, or delete them.",
    fields: [
      { name: "name", label: "Sender name", required: true, readOnly: true },
      { name: "email", label: "Sender email", type: "email", required: true, readOnly: true },
      { name: "subject", label: "Subject", readOnly: true },
      { name: "message", label: "Message", type: "textarea", required: true, readOnly: true },
      { name: "status", label: "Status", type: "select", options: ["unread", "read", "replied", "archived"] },
    ],
  },
  profiles: {
    title: "Profile",
    description: "Edit public profile details, links, photograph URL, and resume URL.",
    fields: [
      { name: "full_name", label: "Full name", required: true },
      { name: "headline", label: "Headline" },
      { name: "bio", label: "Biography", type: "textarea" },
      { name: "location", label: "Location" },
      { name: "email", label: "Public email", type: "email" },
      { name: "github_url", label: "GitHub URL", type: "url" },
      { name: "linkedin_url", label: "LinkedIn URL", type: "url" },
      { name: "website_url", label: "Website URL", type: "url" },
      { name: "avatar_url", label: "Profile photograph URL", type: "url" },
      { name: "resume_url", label: "Resume URL", type: "url" },
    ],
  },
};
