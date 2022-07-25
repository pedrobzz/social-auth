/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { UserRepositoryModel } from "../../../domain/repositories/userRepository";
import { BaseServerResponse } from "../../../domain/baseResponse";
import { User } from "@prisma/client";
import { CreateUserViaCredentials } from "./createUserViaCredentials";

class UserRepositoryMock implements UserRepositoryModel {
  users: User[] = [];
  getUserById(
    id: string,
  ): Promise<BaseServerResponse<{ id: string; name: string; email: string }>> {
    throw new Error("Method not implemented.");
  }
  getUserByEmail(
    email: string,
  ): Promise<BaseServerResponse<{ id: string; name: string; email: string }>> {
    return new Promise(resolve => {
      const user = this.users.find(u => u.email === email);
      if (user) {
        resolve({
          status: 200,
          data: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        });
      } else {
        resolve({
          status: 404,
          message: "User with this Email not found",
        });
      }
    });
  }
  getUserByUsername(
    username: string,
  ): Promise<BaseServerResponse<{ id: string; name: string; email: string }>> {
    throw new Error("Method not implemented.");
  }
  registerUser(user: {
    name: string;
    password: string;
    email: string;
  }): Promise<BaseServerResponse<{ id: string; name: string; email: string }>> {
    return new Promise(resolve => {
      if (this.users.find(u => u.email === user.email)) {
        resolve({
          status: 400,
          message: "User with this Email already exists",
        });
      }
      const newUser: User = {
        id: `${this.users.length + 1}`,
        name: user.name,
        email: user.email,
        password: user.password,
        emailVerified: null,
        image: null,
        username: null,
      };
      this.users.push(newUser);
      resolve({
        status: 200,
        data: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
        },
      });
    });
  }
}

const makeSUT = (): {
  sut: CreateUserViaCredentials;
  userRepository: UserRepositoryMock;
} => {
  const userRepository = new UserRepositoryMock();
  const sut = new CreateUserViaCredentials(userRepository);
  return { sut, userRepository };
};

describe("Create User Using Credentials", () => {
  it("Should be able to Create a User", async () => {
    const { sut, userRepository } = makeSUT();
    const result = await sut.execute({
      name: "John Doe",
      email: "john@doe.dev",
      password: "12345",
    });
    expect(result.status).toBe(200);
    expect(result.data).toEqual({
      id: "1",
      name: "John Doe",
      email: "john@doe.dev",
    });
  });

  it("Should not be able to Create a User with an existing Email", async () => {
    const { sut, userRepository } = makeSUT();
    await sut.execute({
      name: "John Doe",
      email: "john@doe.dev",
      password: "12345",
    });
    const result = await sut.execute({
      name: "John Doe",
      email: "john@doe.dev",
      password: "12345",
    });
    expect(result.status).toBe(400);
    expect(result.message).toBe("User with this Email already exists");
  });
});
