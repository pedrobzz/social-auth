import * as trpc from "@trpc/server";
import { z } from "zod";
import { makeCredentialsManager } from "../factories/makeCredentialsManager";
import { makeUserRepository } from "../factories/makeUserRepository";

export const userRouter = trpc
  .router()
  .mutation("registerUser", {
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
  })
  .mutation("updateUsername", {
    input: z.object({
      id: z.string(),
      username: z.string().max(50).min(3),
    }),
    resolve({ input }) {
      const { id, username } = input;
      const credentialsManager = makeCredentialsManager();
      return credentialsManager.changeUsername({ id, newUsername: username });
    },
  })
  .mutation("getUserByUsername", {
    input: z.object({ username: z.string() }),
    async resolve({ input }) {
      const userRepository = makeUserRepository();
      console.log("Chegou");
      return await userRepository.getUserByUsername(input.username);
    },
  });
