"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function SendOfferButton({ applicationId }: { applicationId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSendOffer = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/application/${applicationId}/offer`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to send offer letter");
      }

      toast.success("Offer letter sent successfully!");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while sending the offer letter");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleSendOffer} 
      disabled={loading}
      size="sm" 
      className="h-8 bg-blue-600 hover:bg-blue-700 text-white"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Send className="w-4 h-4 mr-2" />
      )}
      Send Offer
    </Button>
  );
}
