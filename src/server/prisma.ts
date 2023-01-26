import type { UserCreationInfo } from "../types/auth";

export const createNewUser = ({username, email, password, elo = 800}: UserCreationInfo) => ({
   username,
   email,
   password,
   elo,
   bio: "",

})
