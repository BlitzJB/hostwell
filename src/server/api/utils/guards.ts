import type { Context } from "../trpc";
import type { ValidatedHasEventId, ValidatedHasReviewId } from "../zods";

import { TRPCError } from "@trpc/server";


export const isCreatorOfEvent = async (ctx: Context, input: ValidatedHasEventId) => {
    const event = await ctx.prisma.event.findUnique({
        where: {
            id: input.eventId,
        },
    });
    if (!event) {
        throw new TRPCError({
            code: "NOT_FOUND",
            message: "Event not found",
        });
    }
    const res = ctx.session?.user?.id === event.creatorId;
    if (!res) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Not authorized to perform this action",
        });
    }
    return res;
};


export const isPaidAttendeeOfEvent = async (ctx: Context, input: ValidatedHasEventId) => {
    const event = await ctx.prisma.event.findUnique({
        where: {
            id: input.eventId,
        },
    });
    if (!event) {
        throw new TRPCError({
            code: "NOT_FOUND",
            message: "Event not found",
        });
    }
    const validRegistration = await ctx.prisma.eventRegistration.findFirst({
        where: {
            eventId: input.eventId,
            userId: ctx.session?.user?.id,
            paymentStatus: "PAID",
        },
    });
    const res = !!validRegistration;
    if (!res) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Not authorized to perform this action",
        });
    }
    return res;
}

export const isAuthorOfReview = async (ctx: Context, input: ValidatedHasReviewId) => {
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
    const res = ctx.session?.user?.id === review.userId;
    if (!res) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Not authorized to perform this action",
        });
    }
    return res;
}
