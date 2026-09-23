"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import * as z from "zod"
import { useEffect } from "react"
import { useCertificateStore } from "@/store/useCertificateStore"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sparkles,
  Wand2,
  User,
  Building2,
  GraduationCap,
  Calendar,
  Hash,
  Tag,
  Star,
  MessageSquare,
  ChevronDown,
} from "lucide-react"

const formSchema = z.object({
  salutation: z.string().min(2, "Required"),
  studentName: z.string().min(2, "Name is required"),
  collegeName: z.string().min(2, "College name is required"),
  university: z.string().min(2, "University is required"),
  rollNumber: z.string().min(2, "Roll number is required"),
  registrationId: z.string().min(2, "Registration ID is required"),
  certificateId: z.string().min(2, "Certificate ID is required"),
  domain: z.string().min(2, "Domain is required"),
  startDate: z.string().min(2, "Start date is required"),
  endDate: z.string().min(2, "End date is required"),
  issueDate: z.string().min(2, "Issue date is required"),
  grade: z.string().min(1, "Grade is required"),
  mentorName: z.string().min(2, "Mentor name is required"),
  remarks: z.string().optional(),
  skills: z.string().optional(),
})

const domains = [
  "Web Development", "Full Stack", "Frontend", "Backend", "React", "Next.js",
  "Flutter", "Java", "Python", "Machine Learning", "Artificial Intelligence",
  "Cloud Computing", "AWS", "Azure", "DevOps", "Cyber Security", "Data Science",
  "Android", "UI UX", "Graphic Design", "Digital Marketing", "Business Analytics",
  "Operation Intern", "Growth Intern"
]

const grades = [
  { value: "O", label: "O — Outstanding" },
  { value: "A+", label: "A+ — Excellent" },
  { value: "A", label: "A — Very Good" },
  { value: "B+", label: "B+ — Good" },
  { value: "B", label: "B — Satisfactory" },
  { value: "C", label: "C — Average" },
]

const IN = "bg-[#0d1424] border border-[rgba(255,255,255,0.07)] focus-visible:border-[#4F8DFF]/40 focus-visible:ring-[#4F8DFF]/10 text-slate-200 placeholder:text-slate-600 rounded-[9px] shadow-inner h-[42px] text-[13px] transition-all"
const LB = "text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-[5px] flex items-center gap-1.5"

function SectionHeader({ icon, label, onAction, actionLabel }: {
  icon: React.ReactNode
  label: string
  onAction?: () => void
  actionLabel?: string
}) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      paddingBottom: "10px",
      borderBottom: "1px solid rgba(79,141,255,0.1)",
      marginBottom: "16px",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: "7px",
        fontSize: "10px", fontWeight: 800, textTransform: "uppercase",
        letterSpacing: "0.16em", color: "#4F8DFF",
      }}>
        {icon}
        {label}
      </div>
      {onAction && (
        <button
          type="button"
          onClick={onAction}
          style={{
            display: "flex", alignItems: "center", gap: "5px",
            fontSize: "11px", fontWeight: 600, color: "#64748b",
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)",
            padding: "4px 10px", borderRadius: "7px", cursor: "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "#e2e8f0"
            ;(e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.09)"
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "#64748b"
            ;(e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)"
          }}
        >
          <Wand2 size={11} />
          {actionLabel}
        </button>
      )}
    </div>
  )
}

export function CertificateForm({ prefillData }: { prefillData?: any }) {
  const { updateData } = useCertificateStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      salutation: "Mr.",
      studentName: "Prince Kumar",
      collegeName: "KIIT University Bhubaneswar",
      university: "KIIT University Bhubaneswar",
      rollNumber: "",
      registrationId: `VCT-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`,
      certificateId: `VCT-CERT-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`,
      domain: "Consulting Analyst / Business Analyst",
      startDate: "2026-06-01",
      endDate: "2026-08-31",
      issueDate: new Date().toISOString().split('T')[0],
      grade: "A+",
      mentorName: "Rehan Suman",
      remarks: "They have worked on a live project and assisted the technical team in developing the core modules. This project was aimed at building robust software solutions and applications for the company, providing them with hands-on experience in a professional environment.",
      skills: "",
    },
  })

  const formValues = useWatch({ control: form.control })

  // Push local form changes up to the Zustand store
  useEffect(() => {
    updateData(formValues as any)
  }, [formValues, updateData])

  // Sync external prefill data down into the local form ONCE when it loads
  useEffect(() => {
    if (prefillData && prefillData.user) {
      form.reset({
        ...form.getValues(),
        studentName: prefillData.certificate?.studentNameSnapshot || prefillData.user.studentProfile?.fullName || prefillData.user.name || "",
        collegeName: prefillData.certificate?.instituteSnapshot || prefillData.user.studentProfile?.instituteName || "",
        domain: prefillData.certificate?.domainSnapshot || prefillData.domain?.name || "",
        certificateId: prefillData.certificate?.certificateId || form.getValues("certificateId"),
        startDate: prefillData.certificate ? new Date(prefillData.certificate.startDateSnapshot).toISOString().split('T')[0] : new Date(prefillData.startDate).toISOString().split('T')[0],
        endDate: prefillData.certificate ? new Date(prefillData.certificate.endDateSnapshot).toISOString().split('T')[0] : new Date(prefillData.completionDate).toISOString().split('T')[0],
        issueDate: prefillData.certificate ? new Date(prefillData.certificate.issueDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        skills: prefillData.technologies ? prefillData.technologies.join(", ") : "",
      })
    }
  }, [prefillData, form])

  const generateIds = () => {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0")
    const year = new Date().getFullYear()
    form.setValue("registrationId", `VCT-${year}-${timestamp}`)
    form.setValue("certificateId", `VCT-CERT-${year}-${random}`)
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>

      {/* ── Header ── */}
      <div style={{
        padding: "22px 24px 16px",
        borderBottom: "1px solid rgba(79,141,255,0.08)",
        background: "linear-gradient(to bottom, rgba(14,21,40,0.6) 0%, transparent 100%)",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
          <div style={{
            width: "30px", height: "30px", borderRadius: "8px",
            background: "linear-gradient(135deg, rgba(79,141,255,0.25) 0%, rgba(37,99,235,0.15) 100%)",
            border: "1px solid rgba(79,141,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#4F8DFF", flexShrink: 0,
          }}>
            <Sparkles size={14} />
          </div>
          <h2 style={{
            fontSize: "16px", fontWeight: 700, color: "#f1f5f9",
            letterSpacing: "-0.01em", lineHeight: 1.2,
          }}>
            Certificate Editor
          </h2>
        </div>
        <p style={{ fontSize: "12px", color: "#64748b", paddingLeft: "40px", lineHeight: 1.5 }}>
          Updates live in real-time. Fill in all fields to generate.
        </p>
      </div>

      {/* ── Scrollable Form Body ── */}
      <ScrollArea className="flex-1 custom-scrollbar">
        <div style={{ padding: "20px 24px 100px" }}>
          <Form {...form}>
            <form style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

              {/* ───── IDENTIFIERS ───── */}
              <div>
                <SectionHeader
                  icon={<Hash size={11} />}
                  label="Identifiers"
                  onAction={generateIds}
                  actionLabel="Auto Generate"
                />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <FormField control={form.control} name="certificateId" render={({ field }) => (
                    <FormItem>
                      <FormLabel className={LB}><Hash size={9} />Cert ID</FormLabel>
                      <FormControl>
                        <Input className={IN} placeholder="VCT-CERT-..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="registrationId" render={({ field }) => (
                    <FormItem>
                      <FormLabel className={LB}><Hash size={9} />Reg ID</FormLabel>
                      <FormControl>
                        <Input className={IN} placeholder="VCT-2026-..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="rollNumber" render={({ field }) => (
                    <FormItem>
                      <FormLabel className={LB}><Hash size={9} />Roll No.</FormLabel>
                      <FormControl>
                        <Input className={IN} placeholder="20CS1001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="mentorName" render={({ field }) => (
                    <FormItem>
                      <FormLabel className={LB}><User size={9} />Signatory</FormLabel>
                      <FormControl>
                        <Input className={IN} placeholder="Rehan Suman" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </div>

              {/* ───── CANDIDATE PROFILE ───── */}
              <div>
                <SectionHeader icon={<User size={11} />} label="Candidate Profile" />
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 2.5fr", gap: "12px" }}>
                    <FormField control={form.control} name="salutation" render={({ field }) => (
                      <FormItem>
                        <FormLabel className={LB}><User size={9} />Title</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className={IN + " px-3"}>
                              <SelectValue placeholder="Title" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-[#0d1424] border-[rgba(255,255,255,0.08)] text-slate-200">
                            {["Mr.", "Ms.", "Mrs."].map((s) => (
                              <SelectItem key={s} value={s} className="focus:bg-[#4F8DFF]/15 focus:text-white text-[13px]">
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="studentName" render={({ field }) => (
                      <FormItem>
                        <FormLabel className={LB}><User size={9} />Full Name</FormLabel>
                        <FormControl>
                          <Input className={IN} placeholder="e.g. Abhishek Raj Permani" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <FormField control={form.control} name="collegeName" render={({ field }) => (
                      <FormItem>
                        <FormLabel className={LB}><Building2 size={9} />College</FormLabel>
                        <FormControl>
                          <Input className={IN} placeholder="e.g. IIT(ISM) Dhanbad" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="university" render={({ field }) => (
                      <FormItem>
                        <FormLabel className={LB}><GraduationCap size={9} />University</FormLabel>
                        <FormControl>
                          <Input className={IN} placeholder="e.g. IIT" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </div>
              </div>

              {/* ───── INTERNSHIP DETAILS ───── */}
              <div>
                <SectionHeader icon={<Sparkles size={11} />} label="Internship Details" />
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <FormField control={form.control} name="domain" render={({ field }) => (
                      <FormItem style={{ gridColumn: "1 / -1" }}>
                        <FormLabel className={LB}><Tag size={9} />Domain / Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                          <FormControl>
                            <SelectTrigger className={IN + " px-3"}>
                              <SelectValue placeholder="Select Domain" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-[#0d1424] border-[rgba(255,255,255,0.08)] text-slate-200 max-h-[240px]">
                            {domains.map((d) => (
                              <SelectItem key={d} value={d} className="focus:bg-[#4F8DFF]/15 focus:text-white text-[13px]">
                                {d}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="grade" render={({ field }) => (
                      <FormItem style={{ gridColumn: "1 / -1" }}>
                        <FormLabel className={LB}><Star size={9} />Performance Grade</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                          <FormControl>
                            <SelectTrigger className={IN + " px-3"}>
                              <SelectValue placeholder="Select Grade" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-[#0d1424] border-[rgba(255,255,255,0.08)] text-slate-200">
                            {grades.map((g) => (
                              <SelectItem key={g.value} value={g.value} className="focus:bg-[#4F8DFF]/15 focus:text-white text-[13px]">
                                {g.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                    <FormField control={form.control} name="startDate" render={({ field }) => (
                      <FormItem>
                        <FormLabel className={LB}><Calendar size={9} />Start</FormLabel>
                        <FormControl>
                          <Input type="date" className={IN} {...field} />
                        </FormControl>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="endDate" render={({ field }) => (
                      <FormItem>
                        <FormLabel className={LB}><Calendar size={9} />End</FormLabel>
                        <FormControl>
                          <Input type="date" className={IN} {...field} />
                        </FormControl>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="issueDate" render={({ field }) => (
                      <FormItem>
                        <FormLabel className={LB}><Calendar size={9} />Issue</FormLabel>
                        <FormControl>
                          <Input type="date" className={IN} {...field} />
                        </FormControl>
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="skills" render={({ field }) => (
                    <FormItem>
                      <FormLabel className={LB}><Tag size={9} />Skills Acquired</FormLabel>
                      <FormControl>
                        <Input className={IN} placeholder="React, Next.js, Node.js, TypeScript" {...field} />
                      </FormControl>
                      <p style={{ fontSize: "10px", color: "#475569", marginTop: "4px" }}>Comma-separated list</p>
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="remarks" render={({ field }) => (
                    <FormItem>
                      <FormLabel className={LB}><MessageSquare size={9} />Custom Remarks (Optional)</FormLabel>
                      <FormControl>
                        <textarea
                          rows={3}
                          className={IN.replace("h-[42px]", "h-auto") + " py-2 px-3 w-full resize-none"}
                          placeholder="Leave blank for auto-generated remarks..."
                          style={{
                            background: "rgba(13,20,36,0.8)",
                            border: "1px solid rgba(255,255,255,0.07)",
                            borderRadius: "9px",
                            color: "#e2e8f0",
                            fontSize: "13px",
                            padding: "10px 12px",
                            width: "100%",
                            resize: "none",
                            outline: "none",
                            fontFamily: "inherit",
                            transition: "border-color 0.18s",
                          }}
                          onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(79,141,255,0.4)" }}
                          {...field}
                          onBlur={(e) => { 
                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                            field.onBlur();
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )} />
                </div>
              </div>

            </form>
          </Form>
        </div>
      </ScrollArea>

      {/* ── Completion tip at bottom ── */}
      <div style={{
        padding: "14px 24px",
        borderTop: "1px solid rgba(79,141,255,0.06)",
        background: "rgba(8,12,22,0.8)",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}>
        <div style={{
          width: "5px", height: "5px", borderRadius: "50%",
          background: "#22c55e", boxShadow: "0 0 6px #22c55e", flexShrink: 0,
        }} />
        <p style={{ fontSize: "11px", color: "#475569", lineHeight: 1.5 }}>
          Generate IDs first, then fill candidate details. Preview auto-updates.
        </p>
      </div>
    </div>
  )
}
