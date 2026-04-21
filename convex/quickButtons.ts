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
    const existing = await ctx.db.query("quickButtons").collect();
    for (const btn of existing) {
      await ctx.db.delete(btn._id);
    }
    for (const btn of args.buttons) {
      // Create a clean object for insertion (strip _id and other internal fields)
      const cleanBtn = {
        foodId: btn.foodId,
        label: btn.label,
      };
      // Only insert if it has the required fields
      if (cleanBtn.foodId && cleanBtn.label) {
        await ctx.db.insert("quickButtons", cleanBtn);
      }
    }
  },
});
