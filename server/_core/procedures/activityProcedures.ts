/**
 * Activity Timeline Feature Router
 * Tracks activities and events across pipelines and followups.
 */

import { protectedProcedure, router } from "../trpc";
import { z } from "zod";

export const ActivitySchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  type: z.enum(["pipeline_created", "pipeline_updated", "pipeline_deleted", "followup_created", "followup_completed", "note_added", "status_changed"]),
  title: z.string(),
  description: z.string().optional(),
  relatedId: z.string().uuid().optional(), // ID of related pipeline/followup
  relatedType: z.enum(["pipeline", "followup", "note"]).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  createdAt: z.date(),
});

export type Activity = z.infer<typeof ActivitySchema>;

export function createActivityRouter() {
  return router({
    /**
     * Get timeline of activities for the user
     * Sorted by most recent first
     */
    timeline: protectedProcedure
      .input(
        z.object({
          type: z.enum(["pipeline_created", "pipeline_updated", "pipeline_deleted", "followup_created", "followup_completed", "note_added", "status_changed"]).optional(),
          limit: z.number().min(1).max(100).default(50),
          offset: z.number().default(0),
        })
      )
      .output(
        z.object({
          items: z.array(ActivitySchema),
          total: z.number(),
        })
      )
      .query(async ({ ctx, input }) => {
        // TODO: Replace with actual db query
        // const activities = await db.query.activities
        //   .findMany({
        //     where: and(
        //       eq(activitiesTable.userId, ctx.user.id),
        //       input.type ? eq(activitiesTable.type, input.type) : undefined
        //     ),
        //     orderBy: desc(activitiesTable.createdAt),
        //     limit: input.limit,
        //     offset: input.offset,
        //   });
        // const total = await db.query.activities.count({
        //   where: eq(activitiesTable.userId, ctx.user.id),
        // });
        return { items: [], total: 0 };
      }),

    /**
     * Get activities related to a specific pipeline
     */
    forPipeline: protectedProcedure
      .input(z.object({ pipelineId: z.string().uuid() }))
      .output(z.array(ActivitySchema))
      .query(async ({ ctx, input }) => {
        // TODO: Fetch activities for specific pipeline
        // const activities = await db.query.activities.findMany({
        //   where: and(
        //     eq(activitiesTable.userId, ctx.user.id),
        //     eq(activitiesTable.relatedId, input.pipelineId)
        //   ),
        //   orderBy: desc(activitiesTable.createdAt),
        // });
        return [];
      }),

    /**
     * Get activities related to a specific followup
     */
    forFollowup: protectedProcedure
      .input(z.object({ followupId: z.string().uuid() }))
      .output(z.array(ActivitySchema))
      .query(async ({ ctx, input }) => {
        // TODO: Fetch activities for specific followup
        return [];
      }),

    /**
     * Create an activity record (usually done automatically)
     */
    create: protectedProcedure
      .input(
        z.object({
          type: z.enum(["pipeline_created", "pipeline_updated", "pipeline_deleted", "followup_created", "followup_completed", "note_added", "status_changed"]),
          title: z.string().min(1),
          description: z.string().optional(),
          relatedId: z.string().uuid().optional(),
          relatedType: z.enum(["pipeline", "followup", "note"]).optional(),
          metadata: z.record(z.string(), z.unknown()).optional(),
        })
      )
      .output(ActivitySchema)
      .mutation(async ({ ctx, input }) => {
        // TODO: Insert activity into database
        // const activity = await db.insert(activities).values({
        //   id: crypto.randomUUID(),
        //   userId: ctx.user.id,
        //   ...input,
        //   createdAt: new Date(),
        // });
        throw new Error("Not implemented");
      }),

    /**
     * Get activity stats (counts by type)
     */
    stats: protectedProcedure
      .output(
        z.object({
          totalActivities: z.number(),
          byType: z.record(z.string(), z.number()),
          lastActivityAt: z.date().nullable(),
        })
      )
      .query(async ({ ctx }) => {
        // TODO: Aggregate activity stats
        // const total = await db.query.activities.count({
        //   where: eq(activitiesTable.userId, ctx.user.id),
        // });
        // const byType = await db.query.activities.groupBy(...);
        return {
          totalActivities: 0,
          byType: {},
          lastActivityAt: null,
        };
      }),

    /**
     * Get recent activities (dashboard widget)
     */
    recent: protectedProcedure
      .input(z.object({ limit: z.number().min(1).max(20).default(5) }))
      .output(z.array(ActivitySchema))
      .query(async ({ ctx, input }) => {
        // TODO: Get most recent activities
        return [];
      }),
  });
}

export type ActivityRouter = ReturnType<typeof createActivityRouter>;
