import { CreateUserViaCredentials } from "../use-cases";
import { makeUserRepository } from "./makeUserRepository";

export const makeCreateUserViaCredentials = (): CreateUserViaCredentials => {
  const userRepository = makeUserRepository();
  return new CreateUserViaCredentials(userRepository);
};
