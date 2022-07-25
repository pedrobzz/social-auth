import { CredentialsManager } from "../use-cases";
import { makeUserRepository } from "./makeUserRepository";

export const makeCredentialsManager = (): CredentialsManager => {
  const userRepository = makeUserRepository();
  return new CredentialsManager(userRepository);
};
