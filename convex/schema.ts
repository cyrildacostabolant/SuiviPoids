import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  foods: defineTable({
    name: v.string(),
    caloriesPer100g: v.number(),
    portionWeight: v.number(),
  }),
  quickButtons: defineTable({
    foodId: v.string(),
    label: v.string(),
  }),
  logs: defineTable({
    date: v.string(),
    timestamp: v.number(),
    foodId: v.string(),
    foodName: v.string(),
    weight: v.number(),
    calories: v.number(),
  }),
});
