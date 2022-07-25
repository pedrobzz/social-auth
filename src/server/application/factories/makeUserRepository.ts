import { UserRepository } from "../repositories";

export const makeUserRepository = (): UserRepository => {
  const userRepository = new UserRepository();
  return userRepository;
};
