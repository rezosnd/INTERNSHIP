"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function LogoutButton({ children, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button onClick={() => signOut({ callbackUrl: "/" })} {...props}>
      {children || "Sign Out"}
    </Button>
  );
}
