import { hash } from "argon2";
import { BaseServerResponse } from "../../../domain/baseResponse";
import { UserRepositoryModel } from "../../../domain/repositories/userRepository";
export class CreateUserViaCredentials {
  constructor(private readonly userRepository: UserRepositoryModel) {}

  async execute({
    name,
    email,
    password,
  }: {
    name: string;
    password: string;
    email: string;
  }): Promise<BaseServerResponse<{ id: string; name: string; email: string }>> {
    const user = await this.userRepository.getUserByEmail(email);
    if (user.status !== 404) {
      return {
        status: 400,
        message: "User with this Email already exists",
      };
    }
    let hashedPassword: string;
    try {
      hashedPassword = await hash(password);
    } catch (err) {
      return {
        status: 500,
        message: "Internal Server Error",
      };
    }
    const newUser = await this.userRepository.registerUser({
      name,
      password: hashedPassword,
      email,
    });

    return newUser;
  }
}
