import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createPlan = mutation({
  args: {
    userId: v.id("users"),
    name: v.string(),
    workoutPlan: v.object({
      schedule: v.array(v.string()),
      exercises: v.array(
        v.object({
          day: v.string(),
          routines: v.array(
            v.object({
              name: v.string(),
              sets: v.number(),
              reps: v.number(),
            })
          ),
        })
      ),
    }),
    dietPlan: v.object({
      dailyCalories: v.number(),
      meals: v.array(
        v.object({
          name: v.string(),
          foods: v.array(v.string()),
        })
      ),
    }),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const activePlans = await ctx.db
      .query("plans")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    for (const plan of activePlans) {
      await ctx.db.patch(plan._id, { isActive: false });
    }

    const planId = await ctx.db.insert("plans", args);

    return planId;
  },
});

export const getPlansByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) throw new Error(`No user found with clerkId ${args.clerkId}`);

    const plans = await ctx.db
      .query("plans")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    return plans;
  },
});

export const removePlanById = mutation({
  args: { planId: v.id("plans"), clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) throw new Error(`No user found with clerkId ${args.clerkId}`);

    const plan = await ctx.db
      .query("plans")
      .filter((q) =>
        q.and(
          q.eq(q.field("_id"), args.planId),
          q.eq(q.field("userId"), user._id)
        )
      )
      .first();

    if (!plan) throw new Error(`No plan found with clerkId ${args.planId}`);
    if (plan.isActive) {
      const planToBeActive = await ctx.db
        .query("plans")
        .withIndex("by_user_id", (q) => q.eq("userId", user._id))
        .filter((q) => q.not(q.eq(q.field("_id"), plan._id)))
        .order("desc")
        .first();

      if (planToBeActive) {
        await ctx.db.patch(planToBeActive?._id, { isActive: true });
      }
    }

    return await ctx.db.delete(plan._id);
  },
});
