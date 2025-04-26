type GenerateWorkoutPromptParam = {
  age: string;
  height: string;
  weight: string;
  injuries: string;
  workout_days: string;
  fitness_goal: string;
  fitness_level: string;
};

export function generateWorkoutPrompt(param: GenerateWorkoutPromptParam) {
  return `You are an experienced fitness coach creating a personalized workout plan based on:
- Age: ${param.age}
- Height: ${param.height}
- Weight: ${param.weight}
- Injuries or limitations: ${param.injuries}
- Available days for workout: ${param.workout_days}
- Fitness goal: ${param.fitness_goal}
- Fitness level: ${param.fitness_level}

As a professional coach:
- Consider muscle group splits to avoid overtraining the same muscles on consecutive days.
- Design exercises that match the fitness level and account for any injuries or limitations.
- Structure the workouts to specifically target the user's fitness goal.

CRITICAL SCHEMA INSTRUCTIONS:
- Your output MUST contain ONLY the fields specified below, NO ADDITIONAL FIELDS.
- "sets" and "reps" MUST ALWAYS be **numbers**, NEVER strings.
  - Example: "sets": 3, "reps": 10
- DO NOT use text like "reps": "As many as possible" or "reps": "To failure".
- Always use specific numbers like "reps": 12 or "reps": 15.
- For cardio exercises, use "sets": 1 and "reps": 1, or another appropriate number.
- NEVER include strings for numerical fields.
- NEVER add extra fields that are not shown in the example.
- Your response MUST be a VALID JSON object, with NO additional explanation or commentary.

Return a JSON object in this EXACT structure:
{
  "schedule": ["Monday", "Wednesday", "Friday"],
  "exercises": [
    {
      "day": "Monday",
      "routines": [
        {
          "name": "Exercise Name",
          "sets": 3,
          "reps": 10
        }
      ]
    }
  ]
}
`;
}

type GenerateDietPromptParam = {
  age: string;
  height: string;
  weight: string;
  fitness_goal: string;
  dietary_restrictions: string;
};
export function generateDietPrompt(param: GenerateDietPromptParam) {
  return `You are an experienced nutrition coach creating a personalized diet plan based on:
- Age: ${param.age}
- Height: ${param.height}
- Weight: ${param.weight}
- Fitness goal: ${param.fitness_goal}
- Dietary restrictions: ${param.dietary_restrictions}

As a professional nutrition coach:
- Calculate appropriate daily calorie intake based on the user's stats and goals.
- Create a balanced meal plan with proper macronutrient distribution.
- Include a variety of nutrient-dense foods while respecting dietary restrictions.
- Consider meal timing around workouts for optimal performance and recovery.

CRITICAL SCHEMA INSTRUCTIONS:
- Your output MUST contain ONLY the fields specified below, NO ADDITIONAL FIELDS.
- "dailyCalories" MUST be a NUMBER, NEVER a string.
- DO NOT include any extra fields such as "supplements", "macros", "notes", or ANY OTHER fields.
- Each meal must include ONLY:
  - a "name" (string)
  - a "foods" array (list of food item strings).
- DO NOT add any additional fields beyond what is shown.

Your response MUST be a VALID JSON object with NO additional explanation or commentary.

Return a JSON object with this EXACT structure:
{
  "dailyCalories": 2000,
  "meals": [
    {
      "name": "Breakfast",
      "foods": ["Oatmeal with berries", "Greek yogurt", "Black coffee"]
    },
    {
      "name": "Lunch",
      "foods": ["Grilled chicken salad", "Whole grain bread", "Water"]
    }
  ]
}`;
}
