import { WebhookEvent } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { httpRouter } from "convex/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";
import { httpAction } from "./_generated/server";
import { generateDietPrompt, generateWorkoutPrompt } from "./helpers/prompt";
import {
  DietPlanSchema,
  VapiPayloadSchema,
  WorkoutPlanSchema,
} from "./helpers/zod-schema";

const http = httpRouter();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable");
    }
    const svix_id = req.headers.get("svix-id");
    const svix_signature = req.headers.get("svix-signature");
    const svix_timestamp = req.headers.get("svix-timestamp");

    if (!svix_id || !svix_signature || !svix_timestamp) {
      return new Response("No svix headers found", {
        status: 400,
      });
    }

    const payload = await req.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(webhookSecret);
    let whevent: WebhookEvent;

    try {
      whevent = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (error) {
      console.error("Error verifying webhook:", error);
      return new Response("Webhook event error", { status: 400 });
    }

    const eventType = whevent.type;

    if (eventType === "user.created") {
      const { id, first_name, last_name, image_url, email_addresses } =
        whevent.data;
      const email = email_addresses[0].email_address;
      const name = `${first_name?.trim()} ${last_name?.trim()}`;
      try {
        await ctx.runMutation(api.users.syncUser, {
          email,
          name,
          image: image_url,
          clerkId: id,
        });
      } catch (error) {
        console.error("Webhook error creating user:", error);
        return new Response("Webhook error creating user", { status: 500 });
      }
    }

    if (eventType === "user.updated") {
      const { id, first_name, last_name, image_url, email_addresses } =
        whevent.data;
      const email = email_addresses[0].email_address;
      const name = `${first_name?.trim()} ${last_name?.trim()}`;

      try {
        await ctx.runMutation(api.users.updateUser, {
          email,
          name,
          image: image_url,
          clerkId: id,
        });
      } catch (error) {
        console.error("Webhook error updating user:", error);
        return new Response("Webhook error updating user", { status: 500 });
      }
    }

    return new Response(
      JSON.stringify({
        message: `Webhook ${eventType} processed successfully`,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }),
});

http.route({
  path: "/vapi/generate-program",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    try {
      // Get payload from vapi
      const payload = VapiPayloadSchema.parse(await req.json());

      // Initialize Gemini Model
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-001",
        generationConfig: {
          temperature: 0.4, // lower temperature for more predictable outputs
          topP: 0.9,
          responseMimeType: "application/json",
        },
      });

      // Generate workout prompt
      const workoutPrompt = generateWorkoutPrompt({
        age: payload.age,
        height: payload.height,
        weight: payload.weight,
        injuries: payload.injuries,
        workout_days: payload.workout_days,
        fitness_goal: payload.fitness_goal,
        fitness_level: payload.fitness_level,
      });

      // Send to gemini and parse the response
      const workoutJSON = (
        await model.generateContent(workoutPrompt)
      ).response.text();

      const workoutPlan = WorkoutPlanSchema.parse(JSON.parse(workoutJSON));

      // Generate diet prompt
      const dietPrompt = generateDietPrompt({
        age: payload.age,
        height: payload.height,
        weight: payload.weight,
        fitness_goal: payload.fitness_goal,
        dietary_restrictions: payload.dietary_restrictions,
      });

      // Send to gemini and parse the response
      const dietJSON = (
        await model.generateContent(dietPrompt)
      ).response.text();

      const dietPlan = DietPlanSchema.parse(JSON.parse(dietJSON));

      const user = await ctx.runQuery(api.users.getByClerkId, {
        clerkId: payload.user_id,
      });
      if (!user)
        throw new Error(`User not found with clerkId ${payload.user_id}`);

      const planId = await ctx.runMutation(api.plans.createPlan, {
        userId: user._id,
        dietPlan,
        isActive: true,
        workoutPlan,
        name: `${payload.fitness_goal} Plan - ${new Date().toLocaleDateString()}`,
      });

      return new Response(
        JSON.stringify({
          planId,
          workoutPlan,
          dietPlan,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );

      // Save to DB;
    } catch (error) {
      console.error("Webhook error generate program:", error);
      return new Response(
        JSON.stringify({ message: "Webhook error generate program" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }),
});

export default http;
