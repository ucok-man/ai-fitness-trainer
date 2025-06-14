import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative z-10 py-24 grow">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative max-lg:gap-12">
          {/* CORNER DECARATION */}
          <div className="absolute -top-10 left-0 w-40 h-40 border-l-2 border-t-2" />

          {/* LEFT SIDE CONTENT */}
          <div className="lg:col-span-7 space-y-8 relative">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <div>
                <span className="text-foreground">Transform</span>
              </div>
              <div>
                <span className="text-primary">Your Body</span>
              </div>
              <div className="pt-2">
                <span className="text-foreground">With Advanced</span>
              </div>
              <div className="pt-2">
                <span className="text-foreground">AI</span>
                <span className="text-primary"> Technology</span>
              </div>
            </h1>

            {/* SEPERATOR LINE */}
            <div className="h-px w-full bg-gradient-to-r from-primary via-secondary to-primary opacity-50"></div>

            <p className="text-xl text-muted-foreground w-2/3">
              Talk to our AI assistant and get personalized diet plans and
              workout routines designed just for you
            </p>

            {/* STATS */}
            <div className="flex items-center gap-10 py-6 font-mono">
              <div className="flex flex-col">
                <div className="text-2xl text-primary">500+</div>
                <div className="text-xs uppercase tracking-wider">
                  ACTIVE USERS
                </div>
              </div>
              <div className="h-12 w-px bg-gradient-to-b from-transparent via-border to-transparent"></div>
              <div className="flex flex-col">
                <div className="text-2xl text-primary">3min</div>
                <div className="text-xs uppercase tracking-wider">
                  GENERATION
                </div>
              </div>
              <div className="h-12 w-px bg-gradient-to-b from-transparent via-border to-transparent"></div>
              <div className="flex flex-col">
                <div className="text-2xl text-primary">100%</div>
                <div className="text-xs uppercase tracking-wider">
                  PERSONALIZED
                </div>
              </div>
            </div>

            {/* BUTTON */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                size="lg"
                asChild
                className="overflow-hidden bg-primary text-primary-foreground px-8 py-6 text-lg font-medium"
              >
                <Link
                  href={"/generate-program"}
                  className="flex items-center font-mono max-sm:text-base"
                >
                  Build Your Program
                  <ArrowRightIcon className="ml-2 size-5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* RIGHT SIDE CONTENT */}
          <div className="lg:col-span-5 relative">
            {/* CORNER DECORATION */}
            <div className="absolute -inset-4 pointer-events-none">
              <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-border" />
              <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-border" />
              <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-border" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-border" />
            </div>

            {/* IMAGE CONTANINER */}
            <div className="relative aspect-square max-w-lg mx-auto">
              <div className="relative overflow-hidden rounded-lg bg-cyber-black">
                <img
                  src="/hero.png"
                  alt="AI Fitness Coach"
                  className="size-full object-cover object-center"
                />

                {/* SCAN LINE */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,transparent_calc(50%-1px),var(--cyber-glow-primary)_50%,transparent_calc(50%+1px),transparent_100%)] bg-[length:100%_8px] animate-scanline pointer-events-none" />

                {/* DECORATIONS ON TOP THE IMAGE */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/3 left-1/3 w-1/3 h-1/3 border border-primary/40 rounded-full" />

                  {/* Targeting lines */}
                  <div className="absolute top-1/2 left-0 w-1/4 h-px bg-primary/50" />
                  <div className="absolute top-1/2 right-0 w-1/4 h-px bg-primary/50" />
                  <div className="absolute top-0 left-1/2 h-1/4 w-px bg-primary/50" />
                  <div className="absolute bottom-0 left-1/2 h-1/4 w-px bg-primary/50" />
                </div>

                {/* Backdrop Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              </div>

              {/* TERMINAL OVERLAY */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="relative bg-cyber-terminal-bg backdrop-blur-sm border border-border rounded-lg p-3 overflow-hidden font-mono">
                  {/* Status bar */}
                  <div className="flex items-center justify-between mb-2 border-b border-border pb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                      <p className="text-xs text-primary">SYSTEM ACTIVE</p>
                    </div>
                    <p className="text-xs text-muted-foreground">ID:78412.93</p>
                  </div>

                  <p className="text-sm text-foreground mb-2 tracking-tight">
                    <span className="text-primary">/</span> WORKOUT ANALYSIS
                    COMPLETE
                  </p>

                  <div className="space-y-1.5 text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <div className="text-primary mr-2">01</div>
                      <span>30 min strength training (upper body)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="text-primary mr-2">02</div>
                      <span>20 min cardio (moderate intensity)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="text-primary mr-2">03</div>
                      <span>10 min flexibility (recovery)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
