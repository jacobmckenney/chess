import type { UserCreationInfo } from "../types/auth";
import { pbkdf2Sync, randomBytes } from "crypto";

const DEFAULT_ITERATIONS = 10;
const DEFAULT_KEYLEN = 128;

type HashArgs = {password: string, salt: Buffer, iterations: number};

export const getHash = ({password, salt, iterations}: HashArgs): Buffer => {
   const encoder = new TextEncoder();
   const passwordBytes = encoder.encode(password);
   return pbkdf2Sync(passwordBytes, salt, iterations, DEFAULT_KEYLEN, "sha512");
};

export const createNewUser = ({username, email, password, elo = 800}: UserCreationInfo) => {
   const salt: Buffer = randomBytes(128);
   const iterations = DEFAULT_ITERATIONS;
   const hash = getHash({password, salt, iterations});
   return {
      username,
      email,
      hash,
      salt,
      elo,
      iterations,
      bio: "",
   }
};
