import { z } from "zod";

export const BUDGETS = ["Under $1,000", "$1,000 – $3,000", "$3,000 – $7,000", "$7,000+", "Not sure yet"] as const;
export const TIMELINES = ["ASAP", "Within 1 month", "1 – 3 months", "Flexible"] as const;
export const SERVICES = [
  "3D / immersive website",
  "Landing page",
  "Company website",
  "E-commerce",
  "Web app",
  "Redesign",
] as const;
export const STATUSES = ["new", "contacted", "in_progress", "won", "lost"] as const;
export type InquiryStatus = (typeof STATUSES)[number];

export const inquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  email: z.string().trim().email("Please enter a valid email").max(200),
  phone: z
    .string()
    .trim()
    .min(6, "Please enter a valid phone number")
    .max(40)
    .regex(/^[+()\d\s-]+$/, "Use digits, spaces, + ( ) or - only"),
  project_name: z.string().trim().min(2, "Please name your project").max(160),
  requirements: z.string().trim().min(10, "Tell us a little more (10+ characters)").max(5000),
  budget: z.enum(BUDGETS).optional().or(z.literal("")),
  timeline: z.enum(TIMELINES).optional().or(z.literal("")),
  services: z.array(z.enum(SERVICES)).max(SERVICES.length).optional(),
  // honeypot: real people never fill this hidden field
  website: z.string().max(0).optional(),
});

export type InquiryInput = z.infer<typeof inquirySchema>;

export type Inquiry = {
  id: string;
  created_at: string;
  name: string;
  company: string | null;
  email: string;
  phone: string;
  project_name: string;
  requirements: string;
  budget: string | null;
  timeline: string | null;
  services: string[] | null;
  status: InquiryStatus;
  notes: string | null;
};
