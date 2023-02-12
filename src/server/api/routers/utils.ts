import { z } from 'zod'

import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc'
import { uploadImage } from '../../../components/forms/utils/funcs'


export const utilsRouter = createTRPCRouter({
    uploadImage: publicProcedure
        .input(
            z.object({
                image: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            console.log(input.image)
            const image = await uploadImage(input.image)
            return image
        })
})