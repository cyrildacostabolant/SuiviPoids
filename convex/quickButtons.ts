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
    buttons: v.array(v.object({
      foodId: v.string(),
      label: v.string(),
    }))
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("quickButtons").collect();
    for (const btn of existing) {
      await ctx.db.delete(btn._id);
    }
    for (const btn of args.buttons) {
      await ctx.db.insert("quickButtons", btn);
    }
  },
});
