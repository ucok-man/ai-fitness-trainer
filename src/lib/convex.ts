import { ConvexReactClient } from "convex/react";

export const convexclient = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL || ""
);
