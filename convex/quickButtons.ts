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
    buttons: v.any() // Extreme fallback to ensure args parsing doesn't fail
  },
  handler: async (ctx, args) => {
    try {
      // 1. Delete all existing buttons first
      const existing = await ctx.db.query("quickButtons").collect();
      for (const btn of existing) {
        await ctx.db.delete(btn._id);
      }
      
      // 2. Insert new ones, making sure they are clean
      const buttonsList = Array.isArray(args.buttons) ? args.buttons : [];
      for (const btn of buttonsList) {
        // Ensure we have strings and no internal fields like _id
        const foodId = btn?.foodId ? String(btn.foodId) : "";
        const label = btn?.label ? String(btn.label) : "";

        if (foodId && label) {
          await ctx.db.insert("quickButtons", {
            foodId,
            label,
          });
        }
      }
    } catch (error: any) {
      throw new ConvexError(`Erreur serveur interne : ${error.message || error.toString()}`);
    }
  },
});
