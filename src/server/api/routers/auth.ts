import { getIronSession } from 'iron-session';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createNewUser } from '../../prisma';
import { publicProcedure, createTRPCRouter} from '../trpc';
import { sessionOptions } from '../../../utils/iron-session';
import type { PrismaClient, Prisma, User } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
// TODO: so login is cookie-based and salt passwords

const getSessionFromContext = async (ctx:{
    prisma: PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>;
    req: NextApiRequest;
    res: NextApiResponse;
    user: User | undefined;
} ) => {
    const { req, res } = ctx;
    return await getIronSession(req, res, sessionOptions);
}

export const authRouter = createTRPCRouter({
    create: publicProcedure.input(z.object({
        username: z.string(),
        email: z.string().email(),
        password: z.string()
    })).mutation(async ({ ctx, input}) => {
        const { username } = input;
        // Experiment with calling login directly via router.createCaller() instead of this validation
        const user = await ctx.prisma.user.findUnique({
            where: {
                username
            }
        });
        if (user) {
            throw new TRPCError({message: "User already exists", code: "BAD_REQUEST"})
        }
        const newUser = await ctx.prisma.user.create({
            data: createNewUser(input),
        });
        // Again - just call login directly here instead of returning the new user info
        const session = await getSessionFromContext(ctx);
        session.user = newUser;
        await session.save();
    }),
    login: publicProcedure.input(z.object({
        username: z.string(),
        password: z.string(),
    })).mutation( async ({ ctx, input}) => {
        const { username, password } = input;
        const user = await ctx.prisma.user.findUnique({
            where: {
                username,
            },
        });
        if (!user) {
            throw new TRPCError({message: "User does not exist", code: "UNAUTHORIZED"});
        }
        if (user.password !== password) {
            throw new TRPCError({message: "Incorrect password", code: "UNAUTHORIZED"});
        }
        const session = await getSessionFromContext(ctx);
        session.user = user;
        await session.save();
    }),
    logout: publicProcedure.mutation(async ({ ctx }) => {
        const session = await getSessionFromContext(ctx);
        session.destroy();
    }),
    user: publicProcedure.query( async ({ ctx }) => {
        const session = await getSessionFromContext(ctx);
        return session.user;
    })
});