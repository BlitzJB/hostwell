import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { isCreatorOfEvent } from "../utils/guards";

/* NOTE: paymentStatus defaults to "PAID" for dev purposes. Must be switched to "PENDING" before prod */

export const registrationRouter = createTRPCRouter({
    register: protectedProcedure
        .input(
            z.object({
                eventId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const registration = await ctx.prisma.eventRegistration.create({
                data: {
                    eventId: input.eventId,
                    userId: ctx.session.user.id,
                    paymentStatus: "PAID", /* NOTE: DEV */
                },
            });
            return registration;
        }),
    getRegistration: protectedProcedure
        .input(
            z.object({
                registrationId: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            const registration = await ctx.prisma.eventRegistration.findUnique({
                where: {
                    id: input.registrationId,
                },
            });
            if (!registration) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Registration not found",
                });
            }
            return registration;
        }),
    getRegistrationsCount: publicProcedure
        .input(
            z.object({
                eventId: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            const count = await ctx.prisma.eventRegistration.count({
                where: {
                    eventId: input.eventId,
                },
            });
            return count;
        }),
    isRegistered: protectedProcedure
        .input(
            z.object({
                eventId: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            const registration = await ctx.prisma.eventRegistration.findUnique({
                where: {
                    eventId_userId: {
                        eventId: input.eventId,
                        userId: ctx.session.user.id,
                    },
                },
            });
            if (!registration) {
                return false;
            }
            return true;
        }),
    isValidRegistered: protectedProcedure
        .input(
            z.object({
                eventId: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            const registration = await ctx.prisma.eventRegistration.findUnique({
                where: {
                    eventId_userId: {
                        eventId: input.eventId,
                        userId: ctx.session.user.id,
                    },
                },
            });
            if (!registration) {
                return false;
            }
            if (registration.paymentStatus !== "PAID") {
                return false;
            }
            return true;
        }),
    getRegistrations: protectedProcedure
        .input(
            z.object({
                eventId: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            isCreatorOfEvent(ctx, input);
            const registrations = await ctx.prisma.eventRegistration.findMany({
                where: {
                    eventId: input.eventId,
                },
            });
            return registrations;
        }),
    removeRegistration: protectedProcedure
        .input(
            z.object({
                registrationId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const registration = await ctx.prisma.eventRegistration.findUnique({
                where: {
                    id: input.registrationId,
                },
            });
            if (!registration) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Registration not found",
                });
            }
            isCreatorOfEvent(ctx, { eventId: registration.eventId });
            const deletedRegistration = await ctx.prisma.eventRegistration.delete({
                where: {
                    id: input.registrationId,
                },
            });
            return deletedRegistration;
        }),
});
        