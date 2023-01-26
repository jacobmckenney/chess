import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createNewUser } from '../../prisma';
import { publicProcedure, createTRPCRouter} from '../trpc';
// TODO: integrate iron session so login is cookie-based and salt passwords

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
        console.log("hello");
        if (user) {
            throw new TRPCError({message: "User already exists", code: "BAD_REQUEST"})
        }
        const newUser = await ctx.prisma.user.create({
            data: createNewUser(input),
        });
        // Again - just call login directly here instead of returning the new user info
        return newUser;
    }),
    login: publicProcedure.input(z.object({
        username: z.string(),
        password: z.string(),
    })).mutation( async ({ ctx, input}) => {
        console.log(input);
        const { username, password } = input;
        const user = await ctx.prisma.user.findUnique({
            where: {
                username: username,
            },
        });
        console.log(user);
        if (!user) {
            throw new TRPCError({message: "User does not exist", code: "UNAUTHORIZED"});
        }
        if (user.password !== password) {
            throw new TRPCError({message: "Incorrect password", code: "UNAUTHORIZED"});
        }
        return user;
    })
});