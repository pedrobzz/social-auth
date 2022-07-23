import * as trpc from "@trpc/server";
import { z } from "zod";

export const userRouter = trpc.router().query("hello", {
  input: z.string(),
  resolve({ input }) {
    return {
      greeting: `Hello, ${input}!`,
    };
  },
});
