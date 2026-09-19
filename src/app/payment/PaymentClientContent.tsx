"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, CheckCircle, LogOut } from "lucide-react";
import Script from "next/script";

function PaymentContentInternal({ feeAmount }: { feeAmount: number }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const applicationId = searchParams?.get("applicationId");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (!applicationId) {
    return (
      <div className="p-8 text-center">
        <p className="text-destructive">Application ID is missing.</p>
        <Button className="mt-4" onClick={() => router.push("/dashboard")}>Return to Dashboard</Button>
      </div>
    );
  }

  const handlePayment = async () => {
    setIsLoading(true);
    setError("");

    try {
      // 1. Create order
      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId }),
      });

      if (!orderRes.ok) {
        const errorData = await orderRes.json();
        throw new Error(errorData.error || "Failed to create order");
      }

      const order = await orderRes.json();

      // 2. Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Ensure this is available in .env
        amount: order.amount,
        currency: order.currency,
        name: "VeritasCo.Tech",
        description: "Internship Registration Fee",
        order_id: order.orderId,
        handler: async function (response: any) {
          try {
            // 3. Verify Payment
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                applicationId,
              }),
            });

            if (!verifyRes.ok) {
              throw new Error("Payment verification failed");
            }

            setSuccess(true);
            setTimeout(() => {
              router.push("/dashboard");
              router.refresh();
            }, 3000);

          } catch (err: any) {
            setError(err.message);
          }
        },
        prefill: {
          name: session?.user?.name,
          email: session?.user?.email,
        },
        theme: {
          color: "#2563EB", // Corporate Blue
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      
      razorpay.on("payment.failed", function (response: any) {
        setError(response.error.description);
      });
      
      razorpay.open();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="max-w-md mx-auto mt-20 text-center">
        <CardContent className="pt-6 space-y-4">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
          <h2 className="text-2xl font-bold">Payment Successful!</h2>
          <p className="text-muted-foreground">Your internship is now in progress. Redirecting to dashboard...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <Card className="max-w-md mx-auto mt-20">
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle>Complete Registration</CardTitle>
            <CardDescription>Pay the registration fee to start your internship.</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={() => signOut({ callbackUrl: "/login" })} title="Logout">
            <LogOut className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-lg flex justify-between items-center mb-6">
            <span className="font-medium">Registration Fee</span>
            <span className="text-xl font-bold">₹{feeAmount}</span>
          </div>
          
          {error && (
            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md mb-4">
              {error}
            </div>
          )}
          
          <div className="mb-6">
            <h3 className="font-semibold text-sm mb-2 text-[#07111F]">Terms & Conditions</h3>
            <ScrollArea className="h-48 w-full rounded-md border p-4 bg-slate-50 text-xs text-muted-foreground leading-relaxed">
              <p className="font-bold text-red-600 mb-2 uppercase text-sm">DISCLAIMER – INTERNSHIP PROGRAM FEE & EARLY TERMINATION</p>
              <p className="mb-4">By enrolling in, paying for, or participating in any internship program offered by Veritasco (an MSME Registered enterprise), an early-stage startup, you expressly acknowledge, understand, and agree to the following terms and conditions:</p>
              
              <p className="font-semibold text-[#07111F] mt-2 mb-1">1. Nature and Purpose of the Fee</p>
              <p className="mb-4">The fee charged by Veritasco in connection with its internship program is solely and exclusively for the provision of resources, including but not limited to training materials, mentorship, learning modules, digital tools, platforms, infrastructure, guidance, and other support services made available by Veritasco during the internship period.<br/><br/>This fee does not constitute a salary, stipend, wages, or any form of compensation for work performed by the intern. It is a fee for access to and utilization of Veritasco&apos;s resources and structured learning environment.</p>
              
              <p className="font-semibold text-[#07111F] mt-2 mb-1">2. Early-Stage Nature of Veritasco</p>
              <p className="mb-4">Veritasco is an early-stage startup. As such, the resources, mentorship, and operational capacity provided are subject to the limitations inherent in a developing organization. Enrollment constitutes acceptance of these conditions.</p>
              
              <p className="font-semibold text-[#07111F] mt-2 mb-1">3. Non-Refundable Fee in Case of Early Withdrawal</p>
              <p className="mb-4">In the event that an intern voluntarily withdraws, abandons, discontinues, or otherwise ceases participation in the internship program prior to the completion of the full estimated duration (as communicated at the time of enrollment or as stated in the offer letter/agreement), the entire fee paid shall be non-refundable.<br/><br/>Veritasco reserves the absolute right to retain the full amount, as access to resources and services was made available from the commencement of the program. No pro-rata refund, partial reimbursement, or credit shall be due or payable under any circumstances arising from early departure.</p>
              
              <p className="font-semibold text-[#07111F] mt-2 mb-1">4. No Employment Relationship</p>
              <p className="mb-4">Participation in the internship program does not create an employer-employee relationship between the intern and Veritasco. The intern acknowledges that they are not entitled to any employment benefits, statutory protections applicable to employees, or compensation beyond the educational and resource-based value of the program.</p>
              
              <p className="font-semibold text-[#07111F] mt-2 mb-1">5. Acknowledgment and Acceptance</p>
              <ul className="list-disc pl-4 mb-4 space-y-1">
                <li>You have carefully read, understood, and agreed to this Disclaimer in its entirety;</li>
                <li>You accept that the fee is charged strictly for the resources provided by Veritasco; and</li>
                <li>You waive any claim for refund or reimbursement in the event of early withdrawal or termination of your participation before the estimated completion of the program.</li>
              </ul>
              
              <p className="font-semibold text-[#07111F] mt-2 mb-1">6. Governing Terms</p>
              <p className="mb-4">This Disclaimer forms an integral part of the terms governing your participation in the Veritasco internship program. Veritasco reserves the right to amend these terms at its sole discretion. Continued participation after any amendment shall constitute acceptance of the revised terms.</p>
              
              <p className="font-semibold text-[#07111F] mt-2 mb-1">Important Notice:</p>
              <p>This Disclaimer is provided for informational and contractual clarity purposes only and does not constitute formal legal advice. Veritasco strongly recommends that participants seek independent legal counsel to understand their rights and obligations under applicable laws before enrolling or making any payment.</p>
            </ScrollArea>
          </div>

          <div className="flex items-start space-x-3 mb-6 bg-blue-50 p-3 rounded-lg border border-blue-100">
            <Checkbox 
              id="terms" 
              checked={agreed} 
              onCheckedChange={(checked) => setAgreed(checked as boolean)}
              className="mt-1"
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-tight peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[#07111F] cursor-pointer"
              >
                I agree to the Terms and Conditions
              </label>
              <p className="text-xs text-muted-foreground">
                I have read and understood the disclaimer regarding the non-refundable fee and the nature of the internship program.
              </p>
            </div>
          </div>
          
          <ul className="space-y-2 text-sm text-muted-foreground mb-6">
            <li className="flex gap-2">✓ Access to project resources</li>
            <li className="flex gap-2">✓ Verified completion certificate</li>
            <li className="flex gap-2">✓ QR code verification for employers</li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full h-12 text-md font-bold transition-all" 
            size="lg" 
            onClick={handlePayment}
            disabled={isLoading || status !== "authenticated" || !agreed}
          >
            {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            Pay ₹{feeAmount} securely
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}

export function PaymentClientContent({ feeAmount }: { feeAmount: number }) {
  return (
    <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="animate-spin w-8 h-8" /></div>}>
      <PaymentContentInternal feeAmount={feeAmount} />
    </Suspense>
  );
}
