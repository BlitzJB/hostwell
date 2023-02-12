import { z } from 'zod'

import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc'
import { isOwnerOfAccount } from '../utils/guards'
import { TRPCError } from '@trpc/server'


export const accountRouter = createTRPCRouter({
    getAccount: publicProcedure
        .input(
            z.object({
                accountId: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            const account = await ctx.prisma.account.findUnique({
                where: {
                    id: input.accountId,
                },
            })
            if (!account) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Account not found',
                })
            }
            return account
        }),
    me: protectedProcedure
        .query(async ({ ctx }) => {
            const account = await ctx.prisma.account.findUnique({
                where: {
                    id: ctx.session.user.id,
                },
            })
            if (!account) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Account not found',
                })
            }
            return account
        }),
    updateMe: protectedProcedure
        .input(
            z.object({
                name: z.string().optional(),
                bio: z.string().optional(),
                avatar: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const update: any = {}
            if (input.name) {
                update['name'] = input.name
            }
            if (input.bio) {
                update['bio'] = input.bio
            }
            if (input.avatar) {
                update['avatar'] = input.avatar
            }
            const account = await ctx.prisma.account.update({
                where: {
                    id: ctx.session.user.id,
                },
                data: update,
            })
            return account
        }),
    isCompletedSetup: protectedProcedure
        .query(async ({ ctx }) => {
            const user = await ctx.prisma.user.findUnique({
                where: {
                    id: ctx.session.user.id,
                },
            })
            if (!user) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'User not found',
                })
            }
            return !!user.name && !!user.avatar && !!user.bio && !!user.email
        }),
})