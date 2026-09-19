import { prisma } from "@/lib/prisma";
import { PaymentClientContent } from "./PaymentClientContent";

export const dynamic = "force-dynamic";

export default async function PaymentPage() {
  let settings = await prisma.platformSettings.findUnique({
    where: { id: "global" },
  });
  const feeAmount = settings?.feeAmount ?? 349;

  return (
    <div className="min-h-screen bg-background p-4">
      <PaymentClientContent feeAmount={feeAmount} />
    </div>
  );
}
