/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { UserRepositoryModel } from "../../../domain/repositories/userRepository";
import { BaseServerResponse } from "../../../domain/baseResponse";
import { User } from "@prisma/client";
import { CredentialsManager } from "./credentialsManager";
import { verify } from "argon2";

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
  async checkUserPassword(user: {
    email: string;
    password: string;
  }): Promise<BaseServerResponse<Record<string, unknown>>> {
    const userExists = this.users.find(u => u.email === user.email);
    if (userExists) {
      if (
        userExists.password &&
        (await verify(userExists.password, user.password))
      ) {
        return {
          status: 200,
        };
      } else {
        return {
          status: 401,
          message: "Wrong password",
        };
      }
    } else {
      return {
        status: 404,
        message: "User with this Email not found",
      };
    }
  }
}

const makeSUT = (): {
  sut: CredentialsManager;
  userRepository: UserRepositoryMock;
} => {
  const userRepository = new UserRepositoryMock();
  const sut = new CredentialsManager(userRepository);
  return { sut, userRepository };
};

describe("Credentials Manager", () => {
  it("createUser - Should be able to Create a User", async () => {
    const { sut, userRepository } = makeSUT();
    const result = await sut.createUser({
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

  it("createUser - Should not be able to Create a User with an existing Email", async () => {
    const { sut, userRepository } = makeSUT();
    await sut.createUser({
      name: "John Doe",
      email: "john@doe.dev",
      password: "12345",
    });
    const result = await sut.createUser({
      name: "John Doe",
      email: "john@doe.dev",
      password: "12345",
    });
    expect(result.status).toBe(400);
    expect(result.message).toBe("User with this Email already exists");
  });

  it("loginUser - Should return 'Invalid Username or Password' if the user does not exist", async () => {
    const { sut, userRepository } = makeSUT();
    const result = await sut.loginUser({
      email: "test@test.dev",
      password: "12345",
    });
    expect(result.status).toBe(400);
    expect(result.message).toBe("Invalid Username or Password");
  });

  it("loginUser - Should return 'Invalid Username or Password' if the password is wrong", async () => {
    const { sut, userRepository } = makeSUT();
    await sut.createUser({
      name: "John Doe",
      email: "test@test.dev",
      password: "12345",
    });
    const result = await sut.loginUser({
      email: "John Doe",
      password: "123456",
    });
    expect(result.status).toBe(400);
    expect(result.message).toBe("Invalid Username or Password");
  });

  it("loginUser - Should return 200, user and 'User logged in successfully' if success", async () => {
    const { sut, userRepository } = makeSUT();
    const user = {
      name: "John Doe",
      email: "john@doe.dev",
      password: "12345",
    };
    await sut.createUser(user);
    const result = await sut.loginUser({
      email: user.email,
      password: user.password,
    });
    expect(result.status).toBe(200);
    expect(result.data?.email).toEqual(user.email);
    expect(result.data?.name).toEqual(user.name);
    expect(result.message).toEqual("User logged in successfully");
  });
});
