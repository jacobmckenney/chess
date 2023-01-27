import { getIronSession } from "iron-session";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";

import { prisma } from "../db";

const createInnerTRPCContext = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getIronSession(req, res, sessionOptions);
  return {
    prisma,
    req,
    res,
    user: session.user,
  };
};

export const createTRPCContext = (_opts: CreateNextContextOptions) => {
  const { req, res } = _opts;
  return createInnerTRPCContext(req, res);
};

import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { sessionOptions } from "../../utils/iron-session";
import type { NextApiRequest, NextApiResponse } from "next";

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
