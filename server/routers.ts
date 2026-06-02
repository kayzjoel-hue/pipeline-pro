import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { createPipelineRouter } from "./_core/procedures/pipelinesProcedures";
import { createFollowupsRouter } from "./_core/procedures/followupsProcedures";
import { createActivityRouter } from "./_core/procedures/activityProcedures";
import { createSettingsRouter } from "./_core/procedures/settingsProcedures";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  pipelines: createPipelineRouter(),
  followups: createFollowupsRouter(),
  activity: createActivityRouter(),
  settings: createSettingsRouter(),

  // To add more feature routers:
  // 1. Create a procedures file in server/_core/procedures/
  // 2. Import the router creation function here
  // 3. Register it below
});

export type AppRouter = typeof appRouter;
