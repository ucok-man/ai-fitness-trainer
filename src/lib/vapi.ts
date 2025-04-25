import Vapi from "@vapi-ai/web";

export const vapiclient = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY || "");
