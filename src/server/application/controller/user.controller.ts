import * as trpc from "@trpc/server";
import { z } from "zod";
import { makeCredentialsManager } from "../factories/makeCredentialsManager";

export const userRouter = trpc.router().mutation("registerUser", {
  input: z.object({
    name: z.string().max(50).min(3),
    email: z.string().email(),
    password: z.string().min(8),
  }),
  async resolve({ input }) {
    const { name, email, password } = input;
    const credentialsManager = makeCredentialsManager();
    return await credentialsManager.createUser({ name, email, password });
  },
});
