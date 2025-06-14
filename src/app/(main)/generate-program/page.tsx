"use client";

/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { vapiclient } from "@/lib/vapi";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const showErrorToast = () =>
  toast("Sorry we have problem in our server", {
    description:
      "Please try again! if you see this message frequently, contact our support",
  });

export default function ProgramPage() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isCallEnded, setIsCallEnded] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );

  const { user } = useUser();
  const router = useRouter();
  const messageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleCallStart = () => {
      setIsCallActive(true);
      setIsConnecting(false);
      setIsCallEnded(false);
    };

    const handleCallEnd = () => {
      setIsCallEnded(true);
      setIsCallActive(false);
      setIsConnecting(false);
      setIsSpeaking(false);
    };

    const handleSpeechStart = () => setIsSpeaking(true);
    const handleSpeechEnd = () => setIsSpeaking(false);

    const handleMessage = (msg: any) => {
      if (msg?.type === "transcript" && msg.transcriptType === "final") {
        setMessages((prev) => [
          ...prev,
          { content: msg.transcript, role: msg.role },
        ]);
      }
    };

    const handleError = (error: any) => {
      if (error?.errorMsg?.includes("Meeting has ended")) return;
      console.error("Vapi error:", error);
      setIsConnecting(false);
      setIsCallActive(false);
      showErrorToast();
    };

    const events = [
      ["call-start", handleCallStart],
      ["call-end", handleCallEnd],
      ["speech-start", handleSpeechStart],
      ["speech-end", handleSpeechEnd],
      ["message", handleMessage],
      ["error", handleError],
    ] as const;

    for (const [event, handler] of events) {
      vapiclient.on(event, handler);
    }

    return () => {
      for (const [event, handler] of events) {
        vapiclient.off(event, handler);
      }
    };
  }, []);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!isCallEnded) return;
    const timer = setTimeout(() => router.push("/profile"), 1500);
    return () => clearTimeout(timer);
  }, [isCallEnded, router]);

  useEffect(() => {
    const originalError = console.error;
    console.error = function (msg, ...args) {
      if (
        msg?.includes("Meeting has ended") ||
        args[0]?.toString().includes("Meeting has ended")
      ) {
        console.log("Ignoring known error: Meeting has ended");
        return;
      }
      return originalError.call(console, msg, ...args);
    };
    return () => {
      console.error = originalError;
    };
  }, []);

  const toggleCall = async () => {
    if (isCallActive) return vapiclient.stop();

    try {
      setIsConnecting(true);
      setIsCallEnded(false);
      setMessages([]);

      await vapiclient.start(
        undefined,
        undefined,
        undefined,
        process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID,
        {
          variableValues: {
            full_name: `${user?.firstName?.trim()} ${user?.lastName?.trim()}`,
            user_id: user?.id,
          },
        }
      );
    } catch (error) {
      console.error("Failed to start call: ", error);
      setIsConnecting(false);
      showErrorToast();
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-foreground overflow-hidden  pb-6 pt-24">
      <div className="container mx-auto px-4 h-full max-w-5xl">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-mono">
            <span>Generate Your </span>
            <span className="text-primary uppercase">Fitness Program</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Have a voice conversation with our AI assistant to create your
            personalized plan
          </p>
        </div>

        {/* VIDEO CALL AREA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* AI ASSISTANT CARD */}
          <Card className="bg-card/90 backdrop-blur-sm border border-border overflow-hidden relative">
            <div className="aspect-video flex flex-col items-center justify-center p-6 relative">
              {/* AI VOICE ANIMATION */}
              <div
                className={`absolute inset-0 ${
                  isSpeaking ? "opacity-30" : "opacity-0"
                } transition-opacity duration-300`}
              >
                {/* Voice wave animation when speaking */}
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-center items-center h-20">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`mx-1 h-16 w-1 bg-primary rounded-full ${
                        isSpeaking ? "animate-sound-wave" : ""
                      }`}
                      style={{
                        animationDelay: `${i * 0.1}s`,
                        height: isSpeaking
                          ? `${Math.random() * 50 + 20}%`
                          : "5%",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* AI IMAGE */}
              <div className="relative size-32 mb-4">
                <div
                  className={`absolute inset-0 bg-primary opacity-10 rounded-full blur-lg ${
                    isSpeaking ? "animate-pulse" : ""
                  }`}
                />

                <div className="relative w-full h-full rounded-full bg-card flex items-center justify-center border border-border overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-secondary/10"></div>
                  <img
                    src="/avatar-ai.png"
                    alt="AI Assistant"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <h2 className="text-xl font-bold text-foreground">Trainer</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Fitness & Diet Coach
              </p>

              {/* SPEAKING INDICATOR */}

              <div
                className={`mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border ${
                  isSpeaking ? "border-primary" : ""
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    isSpeaking ? "bg-primary animate-pulse" : "bg-muted"
                  }`}
                />

                <span className="text-xs text-muted-foreground">
                  {isSpeaking
                    ? "Speaking..."
                    : isCallActive
                      ? "Listening..."
                      : isCallEnded
                        ? "Redirecting to profile..."
                        : "Waiting..."}
                </span>
              </div>
            </div>
          </Card>

          {/* USER CARD */}
          <Card
            className={`bg-card/90 backdrop-blur-sm border overflow-hidden relative`}
          >
            <div className="aspect-video flex flex-col items-center justify-center p-6 relative">
              {/* User Image */}
              <div className="relative size-32 mb-4">
                <img
                  src={user?.imageUrl}
                  alt="User"
                  className="size-full object-cover rounded-full"
                />
              </div>

              <h2 className="text-xl font-bold text-foreground">You</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {user
                  ? (user.firstName + " " + (user.lastName || "")).trim()
                  : "Guest"}
              </p>

              {/* User Ready Text */}
              <div
                className={`mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-card border`}
              >
                <div className={`w-2 h-2 rounded-full bg-muted`} />
                <span className="text-xs text-muted-foreground">Ready</span>
              </div>
            </div>
          </Card>
        </div>

        {/* MESSAGE COINTER  */}
        {messages.length > 0 && (
          <div
            ref={messageContainerRef}
            className="w-full bg-card/90 backdrop-blur-sm border border-border rounded-xl p-4 mb-8 h-64 overflow-y-auto transition-all duration-300 scroll-smooth"
          >
            <div className="space-y-3">
              {messages.map((msg, index) => (
                <div key={index} className="message-item animate-fadeIn">
                  <div className="font-semibold text-xs text-muted-foreground mb-1">
                    {msg.role === "assistant" ? "CodeFlex AI" : "You"}:
                  </div>
                  <p className="text-foreground">{msg.content}</p>
                </div>
              ))}

              {isCallEnded && (
                <div className="message-item animate-fadeIn">
                  <div className="font-semibold text-xs text-primary mb-1">
                    System:
                  </div>
                  <p className="text-foreground">
                    Your fitness program has been created! Redirecting to your
                    profile...
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CALL CONTROLS */}
        <div className="w-full flex justify-center gap-4">
          <Button
            className={`w-40 text-xl rounded-3xl ${
              isCallActive
                ? "bg-destructive hover:bg-destructive/90"
                : isCallEnded
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-primary hover:bg-primary/90"
            } text-white relative`}
            onClick={toggleCall}
            disabled={isConnecting || isCallEnded}
          >
            {isConnecting && (
              <span className="absolute inset-0 rounded-full animate-ping bg-primary/50 opacity-75"></span>
            )}

            <span>
              {isCallActive
                ? "End Call"
                : isConnecting
                  ? "Connecting..."
                  : isCallEnded
                    ? "View Profile"
                    : "Start Call"}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
