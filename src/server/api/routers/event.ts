import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { isCreatorOfEvent } from "../utils/guards";
import { isUint16Array } from "util/types";


export const eventRouter = createTRPCRouter({
    getEvent: publicProcedure
        .input(z.object({ eventId: z.string() }))
        .query(async ({ ctx, input }) => {
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
            return event;
        }),
    getEvents: publicProcedure.query(async ({ ctx }) => {
        return await ctx.prisma.event.findMany();
    }),
    getEventsByCreator: publicProcedure
        .input(z.object({ creatorId: z.string() }))
        .query(async ({ ctx, input }) => {
            return await ctx.prisma.event.findMany({
                where: {
                    creatorId: input.creatorId,
                },
            });
        }),
    getEventsByCategory: publicProcedure
        .input(z.object({ category: z.string() }))
        .query(async ({ ctx, input }) => {
            return await ctx.prisma.event.findMany({
                where: {
                    categories: {
                        some: {
                            name: input.category,
                        },
                    },
                },
            });
        }),
    createEvent: protectedProcedure
        .input(
            z.object({
                name: z.string(),
                description: z.string(),
                location: z.string(),
                date: z.string(),
                catIds: z.array(z.string()),
                creatorId: z.string(),
                image: z.string().nullable(),
                slug: z.string(),
                price: z.number(),
                currency: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const event = await ctx.prisma.event.create({
                data: {
                    title: input.name,
                    description: input.description,
                    date: input.date,
                    image: input.image,
                    slug: input.slug,
                    price: input.price,
                    currency: input.currency,
                    categories: {
                        connect: input.catIds.map((catId) => ({
                            id: catId,
                        })),
                    },
                    creator: {
                        connect: {
                            id: ctx.session.user.id,
                        },
                    },
                },
            });
            return event;
        }),
    updateEvent: protectedProcedure
        .input(
            z.object({
                eventId: z.string(),
                name: z.string(),
                description: z.string(),
                location: z.string(),
                date: z.string(),
                catIds: z.array(z.string()),
                creatorId: z.string(),
                image: z.string().nullable(),
                slug: z.string(),
                price: z.number(),
                currency: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            await isCreatorOfEvent(ctx, input)
            const event = await ctx.prisma.event.update({
                where: {
                    id: input.eventId,
                },
                data: {
                    title: input.name,
                    description: input.description,
                    date: input.date,
                    image: input.image,
                    slug: input.slug,
                    price: input.price,
                    currency: input.currency,
                    categories: {
                        connect: input.catIds.map((catId) => ({
                            id: catId,
                        })),
                    },
                    creator: {
                        connect: {
                            id: ctx.session.user.id,
                        },
                    },
                },
            });
            return event;
        }),
    deleteEvent: protectedProcedure
        .input(z.object({ eventId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            await isCreatorOfEvent(ctx, input)
            const event = await ctx.prisma.event.delete({
                where: {
                    id: input.eventId,
                },
            });
            return event;
        }),
})