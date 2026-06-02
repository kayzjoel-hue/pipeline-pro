/**
 * Followups Feature Router Procedures
 * Manages reminders and follow-ups tied to pipeline items.
 */

import { protectedProcedure, router } from "../trpc";
import { z } from "zod";

export const FollowupSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().optional(),
  dueDate: z.date(),
  completed: z.boolean(),
  priority: z.enum(["low", "medium", "high"]),
  pipelineId: z.string().uuid().optional(),
  userId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Followup = z.infer<typeof FollowupSchema>;

export function createFollowupsRouter() {
  return router({
    /**
     * List all followups for authenticated user
     * Optionally filter by completed status
     */
    list: protectedProcedure
      .input(
        z.object({
          completed: z.boolean().optional(),
          limit: z.number().min(1).max(100).default(20),
          offset: z.number().default(0),
        })
      )
      .output(
        z.object({
          items: z.array(FollowupSchema),
          total: z.number(),
        })
      )
      .query(async ({ ctx, input }) => {
        // TODO: Replace with actual db query
        // const followups = await db.query.followups
        //   .findMany({
        //     where: eq(followupsTable.userId, ctx.user.id),
        //     ...(input.completed !== undefined && {
        //       where: and(
        //         eq(followupsTable.userId, ctx.user.id),
        //         eq(followupsTable.completed, input.completed)
        //       ),
        //     }),
        //     limit: input.limit,
        //     offset: input.offset,
        //   });
        // const total = await db.query.followups.count({
        //   where: eq(followupsTable.userId, ctx.user.id),
        // });
        return { items: [], total: 0 };
      }),

    /**
     * Get a single followup by ID
     */
    getById: protectedProcedure
      .input(z.object({ id: z.string().uuid() }))
      .output(FollowupSchema)
      .query(async ({ ctx, input }) => {
        // TODO: Verify ownership and fetch
        throw new Error("Not implemented");
      }),

    /**
     * Create a new followup
     */
    create: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1, "Title required"),
          description: z.string().optional(),
          dueDate: z.date(),
          priority: z.enum(["low", "medium", "high"]).default("medium"),
          pipelineId: z.string().uuid().optional(),
        })
      )
      .output(FollowupSchema)
      .mutation(async ({ ctx, input }) => {
        // TODO: Insert into database
        // const followup = await db.insert(followups).values({
        //   id: crypto.randomUUID(),
        //   userId: ctx.user.id,
        //   ...input,
        //   completed: false,
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        // });
        throw new Error("Not implemented");
      }),

    /**
     * Update an existing followup
     */
    update: protectedProcedure
      .input(
        z.object({
          id: z.string().uuid(),
          title: z.string().optional(),
          description: z.string().optional(),
          dueDate: z.date().optional(),
          completed: z.boolean().optional(),
          priority: z.enum(["low", "medium", "high"]).optional(),
        })
      )
      .output(FollowupSchema)
      .mutation(async ({ ctx, input }) => {
        // TODO: Update in database
        throw new Error("Not implemented");
      }),

    /**
     * Mark followup as complete/incomplete
     */
    toggleComplete: protectedProcedure
      .input(z.object({ id: z.string().uuid() }))
      .output(FollowupSchema)
      .mutation(async ({ ctx, input }) => {
        // TODO: Toggle completed status
        throw new Error("Not implemented");
      }),

    /**
     * Delete a followup
     */
    delete: protectedProcedure
      .input(z.object({ id: z.string().uuid() }))
      .output(z.object({ success: z.boolean() }))
      .mutation(async ({ ctx, input }) => {
        // TODO: Delete from database
        throw new Error("Not implemented");
      }),

    /**
     * Get overdue followups
     */
    overdue: protectedProcedure
      .output(z.array(FollowupSchema))
      .query(async ({ ctx }) => {
        // TODO: Find all followups where dueDate < now and completed = false
        return [];
      }),
  });
}

export type FollowupsRouter = ReturnType<typeof createFollowupsRouter>;
