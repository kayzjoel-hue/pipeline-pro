# Feature Router Extension Guide

This document explains how to add new API routers following the established monorepo pattern.

## Overview

The API is organized into feature routers registered in `server/routers.ts`. Each feature gets its own namespace:

```typescript
appRouter = router({
  system: systemRouter,        // System health, metadata
  auth: authRouter,            // Authentication, session
  pipelines: pipelinesRouter,  // Example feature
  // Add more features here ↓
})
```

## Adding a New Feature Router

### Step 1: Create Procedures File

Create a new file under `server/_core/procedures/` with your feature's procedures:

```typescript
// server/_core/procedures/followupsProcedures.ts
import { protectedProcedure, router } from "../trpc";
import { z } from "zod";

export const FollowupSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  dueDate: z.date(),
  completed: z.boolean(),
  pipelineId: z.string().uuid(),
  userId: z.string().uuid(),
});

export function createFollowupsRouter() {
  return router({
    list: protectedProcedure
      .output(z.array(FollowupSchema))
      .query(async ({ ctx }) => {
        // TODO: Replace with actual db query
        // return db.getFollowupsByUserId(ctx.user.id);
      }),
    
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        dueDate: z.date(),
        pipelineId: z.string().uuid(),
      }))
      .output(FollowupSchema)
      .mutation(async ({ ctx, input }) => {
        // TODO: Replace with actual db insert
      }),
  });
}
```

### Step 2: Register in Router

Update `server/routers.ts`:

```typescript
import { createFollowupsRouter } from "./_core/procedures/followupsProcedures";

export const appRouter = router({
  system: systemRouter,
  auth: authRouter,
  pipelines: createPipelineRouter(),
  followups: createFollowupsRouter(),  // ← Add here
});
```

### Step 3: Export Types

Update `shared/types.ts` to export your feature types:

```typescript
export type * from "../server/_core/procedures/followupsProcedures";
```

### Step 4: Use in Frontend

Now call your API from the React/Expo app:

```typescript
import { trpc } from "@/lib/trpc";

function FollowupsList() {
  const { data: followups } = trpc.followups.list.useQuery();
  
  return (
    <ul>
      {followups?.map(f => <li key={f.id}>{f.title}</li>)}
    </ul>
  );
}
```

## Best Practices

1. **Always use `protectedProcedure`** for user data (unless explicitly public)
   ```typescript
   const myRouter = router({
     list: protectedProcedure.query(...),  // ✓ Requires auth
     getPublic: publicProcedure.query(...), // Only if truly public
   });
   ```

2. **Validate inputs with Zod**
   ```typescript
   create: protectedProcedure
     .input(z.object({
       name: z.string().min(1, "Name required"),
       priority: z.number().min(1).max(5),
     }))
     .mutation(async ({ ctx, input }) => {
       // input is type-safe
     }),
   ```

3. **Use type inference for frontend**
   ```typescript
   // Automatically infer types from tRPC router
   import type { AppRouter } from "@/server/routers";
   type FollowupsRouter = AppRouter['followups'];
   ```

4. **Organize by concern**
   - Feature-specific types → procedures file
   - Database queries → keep separate or inline (depending on size)
   - Shared types → `shared/types.ts`

## Example: Adding `followups` Router

Complete example for adding follow-ups management:

**File: `server/_core/procedures/followupsProcedures.ts`**
```typescript
import { protectedProcedure, router } from "../trpc";
import { z } from "zod";

export const FollowupSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().optional(),
  dueDate: z.date(),
  completed: z.boolean(),
  pipelineId: z.string().uuid(),
  userId: z.string().uuid(),
  createdAt: z.date(),
});

export function createFollowupsRouter() {
  return router({
    list: protectedProcedure
      .output(z.array(FollowupSchema))
      .query(async ({ ctx }) => {
        // const followups = await db.query.followups
        //   .findMany({ where: { userId: ctx.user.id } });
        // return followups;
        return [];
      }),

    create: protectedProcedure
      .input(z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        dueDate: z.date(),
        pipelineId: z.string().uuid(),
      }))
      .output(FollowupSchema)
      .mutation(async ({ ctx, input }) => {
        // const followup = await db.insert(followups).values({
        //   id: crypto.randomUUID(),
        //   userId: ctx.user.id,
        //   ...input,
        //   completed: false,
        //   createdAt: new Date(),
        // });
        // return followup;
        throw new Error("Not implemented");
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.string().uuid(),
        completed: z.boolean().optional(),
        title: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // TODO: Implement
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string().uuid() }))
      .mutation(async ({ ctx, input }) => {
        // TODO: Implement
      }),
  });
}
```

**Update: `server/routers.ts`**
```typescript
import { createFollowupsRouter } from "./_core/procedures/followupsProcedures";

export const appRouter = router({
  // ... existing routers ...
  followups: createFollowupsRouter(),
});
```

## Running Feature Routers Locally

1. Start dev server:
   ```bash
   pnpm dev
   ```

2. Open browser or Expo to http://localhost:8081

3. tRPC queries automatically call http://localhost:3000/api/trpc

4. Type-safe RPC calls work immediately after registration

## Testing Feature Routers

Create tests in `tests/` directory:

```typescript
// tests/followups.test.ts
import { describe, it, expect } from "vitest";
import { createCaller } from "@/server/routers";
import { type Session } from "@/shared/types";

describe("followups router", () => {
  const mockCtx: Session = { user: { id: "test-user" } };
  const caller = createCaller(mockCtx);

  it("lists followups for user", async () => {
    const followups = await caller.followups.list();
    expect(Array.isArray(followups)).toBe(true);
  });
});
```

## Common Patterns

### Pagination
```typescript
list: protectedProcedure
  .input(z.object({
    limit: z.number().min(1).max(100).default(10),
    offset: z.number().default(0),
  }))
  .query(async ({ ctx, input }) => {
    // const [items, total] = await Promise.all([
    //   db.query.items.findMany({ 
    //     where: { userId: ctx.user.id },
    //     limit: input.limit,
    //     offset: input.offset,
    //   }),
    //   db.query.items.count({ where: { userId: ctx.user.id } }),
    // ]);
    // return { items, total };
  }),
```

### Filtering
```typescript
list: protectedProcedure
  .input(z.object({
    status: z.enum(["active", "archived"]).optional(),
    search: z.string().optional(),
  }))
  .query(async ({ ctx, input }) => {
    // Filter based on inputs
  }),
```

### Error Handling
```typescript
import { TRPCError } from "@trpc/server";

getById: protectedProcedure
  .input(z.object({ id: z.string().uuid() }))
  .query(async ({ ctx, input }) => {
    // const item = await db.findById(input.id);
    // if (!item || item.userId !== ctx.user.id) {
    //   throw new TRPCError({ 
    //     code: "NOT_FOUND",
    //     message: "Item not found"
    //   });
    // }
    // return item;
  }),
```
