import { z } from 'zod';


export const hasEventId = z.object({
    eventId: z.string(),
});
export type ValidatedHasEventId = z.infer<typeof hasEventId>;


export const hasReviewId = z.object({
    reviewId: z.string(),
});
export type ValidatedHasReviewId = z.infer<typeof hasReviewId>;