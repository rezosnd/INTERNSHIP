"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle } from "lucide-react";
import Script from "next/script";

function PaymentContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const applicationId = searchParams?.get("applicationId");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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
        <CardHeader>
          <CardTitle>Complete Registration</CardTitle>
          <CardDescription>Pay the registration fee to start your internship.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-lg flex justify-between items-center mb-6">
            <span className="font-medium">Registration Fee</span>
            <span className="text-xl font-bold">₹349</span>
          </div>
          
          {error && (
            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md mb-4">
              {error}
            </div>
          )}
          
          <ul className="space-y-2 text-sm text-muted-foreground mb-6">
            <li className="flex gap-2">✓ Access to project resources</li>
            <li className="flex gap-2">✓ Verified completion certificate</li>
            <li className="flex gap-2">✓ QR code verification for employers</li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            size="lg" 
            onClick={handlePayment}
            disabled={isLoading || status !== "authenticated"}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Pay ₹349 securely
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-background p-4">
      <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="animate-spin w-8 h-8" /></div>}>
        <PaymentContent />
      </Suspense>
    </div>
  );
}
