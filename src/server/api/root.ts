import { createTRPCRouter } from "./trpc";
import { reviewRouter } from "./routers/review";
import { registrationRouter } from "./routers/register";
import { feedbackRouter } from "./routers/feedback";
import { eventRouter } from "./routers/event";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  event: eventRouter,
  review: reviewRouter,
  register: registrationRouter,
  feedback: feedbackRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
