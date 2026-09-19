import { z } from "zod";

export const onboardingSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().regex(/^[0-9]{10}$/, "Must be a valid 10-digit phone number"),
  instituteName: z.string().min(3, "Institute name must be at least 3 characters"),
  course: z.string().min(2, "Course must be at least 2 characters"),
  branch: z.string().min(2, "Branch must be at least 2 characters"),
  graduationYear: z.string().regex(/^[0-9]{4}$/, "Must be a valid year"),
  studentId: z.string().optional(),
});

export const applicationSchema = z.object({
  domainId: z.string().min(1, "Please select a domain"),
  durationWeeks: z.number().min(2, "Duration must be at least 2 weeks"),
  projectTitle: z.string().min(5, "Title must be at least 5 characters").max(100, "Title is too long"),
  projectDescription: z.string().min(20, "Please provide a detailed description").max(1000),
  githubLink: z.string().url("Must be a valid URL"),
  liveLink: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  techStack: z.string().min(2, "Please provide the tech stack used"),
});
