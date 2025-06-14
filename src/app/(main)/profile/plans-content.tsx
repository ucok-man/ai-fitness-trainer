"use client";

import { Doc } from "@/../convex/_generated/dataModel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserResource } from "@clerk/types";
import { useMutation } from "convex/react";
import { AppleIcon, CalendarIcon, DumbbellIcon, Trash2 } from "lucide-react";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import CornerDecoration from "./corner-decoration";

type Props = {
  user: UserResource;
  plans: Doc<"plans">[];
};

export default function PlansContent({ plans, user }: Props) {
  const removePlan = useMutation(api.plans.removePlanById);
  const [selectedPlanId, setSelectedPlanId] = useState<null | string>(null);
  const activePlan = plans?.find((plan) => plan.isActive);
  const currentPlan = selectedPlanId
    ? plans?.find((plan) => plan._id === selectedPlanId)
    : activePlan;

  return (
    <div className="space-y-8">
      {/* PLAN SELECTOR */}
      <div className="relative backdrop-blur-sm border border-border p-6">
        <CornerDecoration />

        <div className="flex items-center justify-between mb-4 max-[320px]:flex-col">
          <h2 className="text-xl font-bold tracking-tight">
            <span className="text-primary">Your</span>{" "}
            <span className="text-foreground">Fitness Plans</span>
          </h2>
          <div className="font-mono text-xs text-muted-foreground">
            TOTAL: {plans.length}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 w-full">
          {plans.map((plan) => (
            <Button
              key={plan._id}
              onClick={() => setSelectedPlanId(plan._id)}
              className={`text-foreground border hover:text-white w-full sm:w-auto max-w-full sm:max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap justify-between ${
                selectedPlanId === plan._id
                  ? "bg-primary/20 text-primary border-primary"
                  : "bg-transparent border-border hover:border-primary/50"
              }`}
            >
              <span className="truncate max-w-[100%]">{plan.name}</span>

              {plan.isActive && (
                <span className="ml-auto bg-green-500/20 text-green-500 text-xs px-2 py-0.5 rounded whitespace-nowrap">
                  ACTIVE
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* PLAN DETAILS */}

      {currentPlan && (
        <div className="relative backdrop-blur-sm border border-border rounded-lg p-6">
          <CornerDecoration />

          <div className="flex items-center gap-2 mb-4 max-[320px]:flex-col">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse max-[320px]:mb-2"></div>
            <h3 className="text-lg font-bold">
              PLAN: <span className="text-primary">{currentPlan.name}</span>
            </h3>
            <Button
              onClick={() =>
                removePlan({
                  planId: currentPlan._id,
                  clerkId: user.id,
                })
              }
              className="bg-transparent text-red-500 hover:bg-transparent hover:scale-105 max-[320px]:self-start max-[320px]:!px-0"
            >
              <Trash2 />{" "}
              <span className="hidden max-[320px]:inline-block">Remove</span>
            </Button>
          </div>

          <Tabs defaultValue="workout" className="w-full">
            <TabsList className="mb-6 w-full grid grid-cols-2 bg-cyber-terminal-bg border max-[360px]:grid-cols-1 max-[360px]:grid-rows-2 max-[360px]:h-[70px]">
              <TabsTrigger
                value="workout"
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
              >
                <DumbbellIcon className="mr-2 size-4" />
                Workout Plan
              </TabsTrigger>

              <TabsTrigger
                value="diet"
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
              >
                <AppleIcon className="mr-2 h-4 w-4" />
                Diet Plan
              </TabsTrigger>
            </TabsList>

            <TabsContent value="workout">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <CalendarIcon className="h-4 w-4 text-primary max-sm:hidden" />
                  <span className="font-mono text-sm text-muted-foreground">
                    SCHEDULE: {currentPlan.workoutPlan.schedule.join(", ")}
                  </span>
                </div>

                <Accordion type="multiple" className="space-y-4">
                  {currentPlan.workoutPlan.exercises.map(
                    (exerciseDay, index) => (
                      <AccordionItem
                        key={index}
                        value={exerciseDay.day}
                        className="border rounded-lg overflow-hidden"
                      >
                        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-primary/10 font-mono">
                          <div className="flex justify-between w-full items-center flex-wrap gap-2">
                            <span className="text-primary">
                              {exerciseDay.day}
                            </span>
                            <div className="text-xs text-muted-foreground">
                              {exerciseDay.routines.length} EXERCISES
                            </div>
                          </div>
                        </AccordionTrigger>

                        <AccordionContent className="pb-4 px-4">
                          <div className="space-y-3 mt-2">
                            {exerciseDay.routines.map(
                              (routine, routineIndex) => (
                                <div
                                  key={routineIndex}
                                  className="border border-border rounded p-3 bg-background/50"
                                >
                                  <div className="flex justify-between items-start mb-2 max-[420px]:flex-col gap-4">
                                    <h4 className="font-semibold text-foreground">
                                      {routine.name}
                                    </h4>
                                    <div className="flex items-center gap-2">
                                      <div className="px-2 py-1 rounded bg-primary/20 text-primary text-xs font-mono">
                                        {routine.sets} SETS
                                      </div>
                                      <div className="px-2 py-1 rounded bg-secondary/20 text-secondary text-xs font-mono">
                                        {routine.reps} REPS
                                      </div>
                                    </div>
                                  </div>
                                  {routine.description && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {routine.description}
                                    </p>
                                  )}
                                </div>
                              )
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )
                  )}
                </Accordion>
              </div>
            </TabsContent>

            <TabsContent value="diet">
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                  <span className="font-mono text-sm text-muted-foreground">
                    DAILY CALORIE TARGET
                  </span>
                  <div className="font-mono text-xl max-sm:text-base text-primary">
                    {currentPlan.dietPlan.dailyCalories} KCAL
                  </div>
                </div>

                <div className="h-px w-full bg-border my-4"></div>

                <div className="space-y-4">
                  {currentPlan.dietPlan.meals.map((meal, index) => (
                    <div
                      key={index}
                      className="border border-border rounded-lg overflow-hidden p-4"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <h4 className="font-mono text-primary">{meal.name}</h4>
                      </div>
                      <ul className="space-y-2">
                        {meal.foods.map((food, foodIndex) => (
                          <li
                            key={foodIndex}
                            className="flex items-center gap-2 text-sm text-muted-foreground"
                          >
                            <span className="text-xs text-primary font-mono">
                              {String(foodIndex + 1).padStart(2, "0")}
                            </span>
                            {food}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
