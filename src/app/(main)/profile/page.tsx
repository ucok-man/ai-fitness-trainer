"use client";

import { api } from "@/../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import EmptyPlans from "./empty-plans";
import Header from "./header";
import PlansContent from "./plans-content";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();

  const plans = useQuery(api.plans.getPlansByClerkId, {
    clerkId: user?.id || "",
  });

  if (!isLoaded)
    return (
      <div className="w-full min-h-screen flex items-center justify-center z-50">
        <Loader2 className="w-12 h-12 animate-spin text-white/80" />
      </div>
    );
  if (isLoaded && !user) redirect("/sign-in");

  return (
    <section className="relative z-10 pt-12 pb-32 flex-grow container mx-auto px-4 min-h-screen">
      <Header user={user} />

      {plans && plans?.length > 0 ? (
        <PlansContent plans={plans} user={user} />
      ) : (
        <EmptyPlans />
      )}
    </section>
  );
}
