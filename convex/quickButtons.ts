import { queryGeneric, mutationGeneric } from "convex/server";
import { v, ConvexError } from "convex/values";

export const get = queryGeneric({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("quickButtons").collect();
  },
});

export const saveAll = mutationGeneric({
  args: {
    buttons: v.array(v.object({
      foodId: v.string(),
      label: v.string(),
    }))
  },
  handler: async (ctx, args) => {
    try {
      // 1. Delete all existing buttons first
      const existing = await ctx.db.query("quickButtons").collect();
      for (const btn of existing) {
        await ctx.db.delete(btn._id);
      }
      
      // 2. Insert new ones
      for (const btn of args.buttons) {
        await ctx.db.insert("quickButtons", {
          foodId: btn.foodId,
          label: btn.label,
        });
      }
    } catch (error: any) {
      throw new ConvexError(error.message || error.toString());
    }
  },
});
