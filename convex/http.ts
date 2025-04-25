import { WebhookEvent } from "@clerk/nextjs/server";
import { httpRouter } from "convex/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();
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

    return new Response(`Webhook ${eventType} processed successfully`, {
      status: 200,
    });
  }),
});

export default http;
