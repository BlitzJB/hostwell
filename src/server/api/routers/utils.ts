import { z } from 'zod'

import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc'
import { uploadImage } from '../utils/funcs'


export const utilsRouter = createTRPCRouter({
    uploadImage: publicProcedure
        .input(
            z.object({
                image: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const image = await uploadImage(input.image)
            return image
        })
})