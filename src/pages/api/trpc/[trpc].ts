import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { userRouter } from "../../../application/controller/user/user.controller";

export const appRouter = trpc.router().merge("user.", userRouter);

export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});
