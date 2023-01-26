// Probably can use zod schema to derive this information because we use the same
// schema to validate the trpc input at ./server/api/routers/auth.ts
export type UserSignInInfo = {
    username: string,
    password: string,
}

export type UserCreationInfo = UserSignInInfo & {
    email: string,
    elo?: number,
}
