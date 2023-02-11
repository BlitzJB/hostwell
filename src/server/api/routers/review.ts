import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { isAuthorOfReview } from "../utils/guards";


export const reviewRouter = createTRPCRouter({
    getReview: publicProcedure
        .input(z.object({ reviewId: z.string() }))
        .query(async ({ ctx, input }) => {
            const review = await ctx.prisma.review.findUnique({
                where: {
                    id: input.reviewId,
                },
            });
            if (!review) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Review not found",
                });
            }
            return review;
        }),
    getReviews: publicProcedure.query(async ({ ctx }) => {
        return await ctx.prisma.review.findMany();
    }),
    getReviewsByCreator: publicProcedure
        .input(z.object({ userId: z.string() }))
        .query(async ({ ctx, input }) => {
            return await ctx.prisma.review.findMany({
                where: {
                    userId: input.userId,
                },
            });
        }),
    getReviewsByEvent: publicProcedure
        .input(z.object({ eventId: z.string() }))
        .query(async ({ ctx, input }) => {
            return await ctx.prisma.review.findMany({
                where: {
                    eventId: input.eventId,
                },
            });
        }),
    createReview: protectedProcedure
        .input(
            z.object({
                title: z.string(),
                comment: z.string(),
                rating: z.number(),
                userId: z.string(),
                eventId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const review = await ctx.prisma.review.create({
                data: {
                    title: input.title,
                    comment: input.comment,
                    rating: input.rating,
                    userId: input.userId,
                    eventId: input.eventId,
                },
            });
            return review;
        }),
    updateReview: protectedProcedure
        .input(
            z.object({
                reviewId: z.string(),
                title: z.string(),
                comment: z.string(),
                rating: z.number(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            isAuthorOfReview(ctx, input);
            const review = await ctx.prisma.review.update({
                where: {
                    id: input.reviewId,
                },
                data: {
                    title: input.title,
                    comment: input.comment,
                    rating: input.rating,
                },
            });
            return review;
        }),
    deleteReview: protectedProcedure
        .input(z.object({ reviewId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            isAuthorOfReview(ctx, input);
            const review = await ctx.prisma.review.delete({
                where: {
                    id: input.reviewId,
                },
            });
            return review;
        }),
});