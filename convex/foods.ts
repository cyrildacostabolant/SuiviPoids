import { queryGeneric, mutationGeneric } from "convex/server";
import { v } from "convex/values";

export const get = queryGeneric({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("foods").collect();
  },
});

export const add = mutationGeneric({
  args: {
    name: v.string(),
    caloriesPer100g: v.number(),
    portionWeight: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("foods", args);
  },
});

export const remove = mutationGeneric({
  args: { id: v.id("foods") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
