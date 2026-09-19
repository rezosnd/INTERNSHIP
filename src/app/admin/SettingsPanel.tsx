"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Save } from "lucide-react";

export function SettingsPanel({ initialFeeAmount }: { initialFeeAmount: number }) {
  const [fee, setFee] = useState(initialFeeAmount.toString());
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSave = async () => {
    setIsLoading(true);
    setMessage("");
    setError("");

    const feeNumber = parseInt(fee, 10);
    if (isNaN(feeNumber) || feeNumber < 0) {
      setError("Please enter a valid positive number.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feeAmount: feeNumber }),
      });

      if (!res.ok) {
        throw new Error("Failed to update settings");
      }

      setMessage("Platform fee updated successfully!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-border shadow-sm max-w-md">
      <CardHeader>
        <CardTitle>Platform Pricing</CardTitle>
        <CardDescription>Configure the global internship registration fee.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {message && (
          <div className="p-3 bg-emerald-500/10 text-emerald-600 text-sm rounded-md border border-emerald-500/20">
            {message}
          </div>
        )}
        {error && (
          <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md border border-destructive/20">
            {error}
          </div>
        )}
        
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Internship Fee Amount (INR)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-muted-foreground">₹</span>
            <Input 
              type="number" 
              value={fee} 
              onChange={(e) => setFee(e.target.value)} 
              className="pl-7"
              min="0"
            />
          </div>
          <p className="text-[0.8rem] text-muted-foreground">
            This amount will be applied instantly to all new checkouts.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={isLoading} className="w-full">
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
}
