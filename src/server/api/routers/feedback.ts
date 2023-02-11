import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

/* Feedback forms is a feature that i'll focus on in the end */

export const feedbackRouter = createTRPCRouter({});