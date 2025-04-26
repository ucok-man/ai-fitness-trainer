import { z } from "zod";

export const VapiPayloadSchema = z.object({
  user_id: z.string(),
  age: z.string(),
  height: z.string(),
  weight: z.string(),
  injuries: z.string(),
  workout_days: z.string(),
  fitness_goal: z.string(),
  fitness_level: z.string(),
  dietary_restrictions: z.string(),
});

export const WorkoutPlanSchema = z.object({
  schedule: z.array(z.string()),
  exercises: z.array(
    z.object({
      day: z.string(),
      routines: z.array(
        z.object({
          name: z.string(),
          sets: z.number(),
          reps: z.number(),
        })
      ),
    })
  ),
});

export const DietPlanSchema = z.object({
  dailyCalories: z.number(),
  meals: z.array(
    z.object({
      name: z.string(),
      foods: z.array(z.string()),
    })
  ),
});
