import type { User } from "@prisma/client";
import type { IronSessionOptions } from "iron-session";

export const sessionOptions: IronSessionOptions= {
    cookieName: "chess-iron-session",
    password: process.env.IRON_SESSION_PASSWORD ?? "",
    cookieOptions: {
        secure: process.env.NODE_ENV === "production"
    }
}

declare module "iron-session" {
    interface IronSessionData {
      user?: User;
    }
  }