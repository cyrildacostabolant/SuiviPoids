import { queryGeneric, mutationGeneric } from "convex/server";
import { v } from "convex/values";

export const get = queryGeneric({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("logs").collect();
  },
});

export const add = mutationGeneric({
  args: {
    date: v.string(),
    timestamp: v.number(),
    foodId: v.string(),
    foodName: v.string(),
    weight: v.number(),
    calories: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("logs", args);
  },
});

export const remove = mutationGeneric({
  args: { id: v.id("logs") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
