import { queryGeneric, mutationGeneric } from "convex/server";
import { v } from "convex/values";

export const get = queryGeneric({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("quickButtons").collect();
  },
});

export const saveAll = mutationGeneric({
  args: {
    buttons: v.array(v.any())
  },
  handler: async (ctx, args) => {
    // 1. Delete all existing buttons first
    const existing = await ctx.db.query("quickButtons").collect();
    for (const btn of existing) {
      await ctx.db.delete(btn._id);
    }
    
    // 2. Insert new ones, making sure they are clean
    for (const btn of args.buttons) {
      // Ensure we have strings and no internal fields like _id
      const foodId = btn.foodId ? String(btn.foodId) : "";
      const label = btn.label ? String(btn.label) : "";

      if (foodId && label) {
        await ctx.db.insert("quickButtons", {
          foodId,
          label,
        });
      }
    }
  },
});
