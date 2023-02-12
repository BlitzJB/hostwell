import { createTRPCRouter } from "./trpc";
import { reviewRouter } from "./routers/review";
import { registrationRouter } from "./routers/register";
import { feedbackRouter } from "./routers/feedback";
import { eventRouter } from "./routers/event";
import { accountRouter } from "./routers/account";
import { utilsRouter } from "./routers/utils";

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
  account: accountRouter,
  utils: utilsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
