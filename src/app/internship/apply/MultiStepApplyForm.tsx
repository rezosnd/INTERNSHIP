"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { applicationSchema } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";

type Domain = { id: string; name: string; };
type Profile = { fullName: string; email?: string; phone: string; instituteName: string; course: string; branch: string; graduationYear: string; };

const steps = [
  { id: 1, title: "Personal" },
  { id: 2, title: "Academic" },
  { id: 3, title: "Internship" },
  { id: 4, title: "Project" },
  { id: 5, title: "Review" }
];

export default function MultiStepApplyForm({ domains, profile, feeAmount }: { domains: Domain[], profile: Profile, feeAmount: number }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const form = useForm<z.infer<typeof applicationSchema>>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      domainId: "",
      durationWeeks: 4,
      projectTitle: "",
      projectDescription: "",
      githubLink: "",
      liveLink: "",
      techStack: "",
    },
  });

  const validateCurrentStep = async () => {
    let fieldsToValidate: any[] = [];
    if (currentStep === 3) fieldsToValidate = ["domainId", "durationWeeks"];
    if (currentStep === 4) fieldsToValidate = ["projectTitle", "projectDescription", "techStack", "githubLink", "liveLink"];
    
    if (fieldsToValidate.length > 0) {
      const isValid = await form.trigger(fieldsToValidate as any);
      if (!isValid) return false;
    }
    return true;
  };

  const nextStep = async () => {
    if (await validateCurrentStep()) {
      setCurrentStep(s => Math.min(s + 1, steps.length));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    setCurrentStep(s => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (values: z.infer<typeof applicationSchema>) => {
    setIsLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/internship/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        throw new Error("Failed to submit application");
      }

      const application = await res.json();
      router.push(`/payment?applicationId=${application.id}`);
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-border p-6 md:p-12">
      {/* Progress Indicator */}
      <div className="mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-muted -translate-y-1/2 z-0" />
        <div 
          className="absolute top-1/2 left-0 h-[2px] bg-primary -translate-y-1/2 z-0 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />
        
        <div className="relative z-10 flex justify-between">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center gap-2 bg-white px-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-500 ${
                step.id < currentStep ? "bg-primary text-white" :
                step.id === currentStep ? "bg-[#07111F] text-white ring-4 ring-primary/20" :
                "bg-muted text-muted-foreground"
              }`}>
                {step.id < currentStep ? <CheckCircle2 className="w-5 h-5" /> : step.id}
              </div>
              <span className={`text-xs font-semibold hidden md:block uppercase tracking-wider ${
                step.id <= currentStep ? "text-[#07111F]" : "text-muted-foreground"
              }`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-[#07111F]">
          {steps[currentStep - 1].title} Details
        </h2>
        <p className="text-muted-foreground mt-2">
          {currentStep === 1 && "Verify your personal profile information."}
          {currentStep === 2 && "Review your academic background."}
          {currentStep === 3 && "Select your desired internship domain."}
          {currentStep === 4 && "Tell us about the project you plan to build."}
          {currentStep === 5 && "Review your application before proceeding to payment."}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm">
          {error}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 min-h-[300px]">
          
          {/* Step 1: Personal (Read-only from profile) */}
          <div className={currentStep === 1 ? "block" : "hidden"}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <FormLabel>Full Name</FormLabel>
                <Input value={profile.fullName} disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <FormLabel>Phone Number</FormLabel>
                <Input value={profile.phone} disabled className="bg-muted" />
              </div>
            </div>
          </div>

          {/* Step 2: Academic (Read-only from profile) */}
          <div className={currentStep === 2 ? "block" : "hidden"}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <FormLabel>Institute Name</FormLabel>
                <Input value={profile.instituteName} disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <FormLabel>Course</FormLabel>
                <Input value={profile.course} disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <FormLabel>Branch / Specialization</FormLabel>
                <Input value={profile.branch} disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <FormLabel>Graduation Year</FormLabel>
                <Input value={profile.graduationYear} disabled className="bg-muted" />
              </div>
            </div>
          </div>

          {/* Step 3: Internship */}
          <div className={currentStep === 3 ? "block" : "hidden"}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="domainId"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Internship Domain</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select a domain" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {domains.map((domain) => (
                          <SelectItem key={domain.id} value={domain.id}>
                            {domain.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="durationWeeks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Duration (Weeks)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={2} 
                        max={24} 
                        className="h-12"
                        {...field} 
                        onChange={e => field.onChange(parseInt(e.target.value, 10))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Step 4: Project */}
          <div className={currentStep === 4 ? "block" : "hidden"}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="projectTitle"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Project Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Enterprise E-Commerce Platform" className="h-12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="projectDescription"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Project Description & Features</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Detail the architecture, features, and your specific contribution..." 
                        className="resize-none h-32" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="techStack"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Technology Stack Used</FormLabel>
                    <FormControl>
                      <Input placeholder="Next.js, Tailwind, PostgreSQL, etc." className="h-12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="githubLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub Repository URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://github.com/..." className="h-12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="liveLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Live Demo URL (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." className="h-12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Step 5: Review */}
          <div className={currentStep === 5 ? "block" : "hidden"}>
            <div className="bg-muted p-6 rounded-xl space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1 uppercase tracking-wider text-xs font-bold">Domain</p>
                  <p className="font-medium">{domains.find(d => d.id === form.getValues().domainId)?.name || "Not selected"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1 uppercase tracking-wider text-xs font-bold">Duration</p>
                  <p className="font-medium">{form.getValues().durationWeeks} Weeks</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground mb-1 uppercase tracking-wider text-xs font-bold">Project Title</p>
                  <p className="font-medium">{form.getValues().projectTitle || "Not provided"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground mb-1 uppercase tracking-wider text-xs font-bold">Tech Stack</p>
                  <p className="font-medium">{form.getValues().techStack || "Not provided"}</p>
                </div>
              </div>
              
              <div className="border-t border-border pt-6 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-[#07111F]">Internship & Processing Fee</h4>
                  <p className="text-sm text-muted-foreground">One-time payment</p>
                </div>
                <div className="text-2xl font-black text-[#07111F]">₹{feeAmount}</div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="pt-8 border-t border-border flex justify-between items-center mt-12">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={prevStep}
              className={`h-12 px-6 ${currentStep === 1 ? "invisible" : "visible"}`}
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Back
            </Button>

            {currentStep < steps.length ? (
              <Button type="button" size="lg" onClick={nextStep} className="h-12 px-8">
                Continue
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <Button type="submit" size="lg" disabled={isLoading} className="h-12 px-8 bg-primary hover:bg-primary/90 text-white">
                {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                Continue to Secure Payment
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
