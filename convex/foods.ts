import { queryGeneric, mutationGeneric } from "convex/server";
import { v, ConvexError } from "convex/values";

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
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("foods", args);
  },
});

export const update = mutationGeneric({
  args: {
    id: v.id("foods"),
    name: v.optional(v.string()),
    caloriesPer100g: v.optional(v.number()),
    portionWeight: v.optional(v.number()),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    const existing = await ctx.db.get(id);
    if (!existing) {
      throw new ConvexError("Food not found");
    }
    
    const updates: Record<string, any> = {};
    if (rest.name !== undefined) updates.name = rest.name;
    if (rest.caloriesPer100g !== undefined) updates.caloriesPer100g = rest.caloriesPer100g;
    if (rest.portionWeight !== undefined) updates.portionWeight = rest.portionWeight;
    if (rest.color !== undefined) updates.color = rest.color;
    
    await ctx.db.patch(id, updates);
  },
});

export const remove = mutationGeneric({
  args: { id: v.id("foods") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
