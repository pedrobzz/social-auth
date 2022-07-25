import { BaseServerResponse } from "../../domain/baseResponse";
import { UserRepositoryModel } from "../../domain/repositories/userRepository";
import { getPrismaClient } from "../factories/getPrismaClient";
import { verify } from "argon2";
export class UserRepository implements UserRepositoryModel {
  client = getPrismaClient();
  async getUserById(
    id: string,
  ): Promise<BaseServerResponse<{ id: string; name: string; email: string }>> {
    const user = await this.client.user.findFirst({ where: { id } });
    if (user) {
      return {
        status: 200,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      };
    } else {
      return {
        status: 404,
        message: "User with this ID not found",
      };
    }
  }
  async getUserByEmail(
    email: string,
  ): Promise<BaseServerResponse<{ id: string; name: string; email: string }>> {
    const user = await this.client.user.findFirst({ where: { email } });
    if (user) {
      return {
        status: 200,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      };
    } else {
      return {
        status: 404,
        message: "User with this Email not found",
      };
    }
  }
  async getUserByUsername(
    username: string,
  ): Promise<BaseServerResponse<{ id: string; name: string; email: string }>> {
    const user = await this.client.user.findFirst({ where: { username } });
    if (user) {
      return {
        status: 200,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      };
    } else {
      return {
        status: 404,
        message: "User with this Username not found",
      };
    }
  }
  async registerUser(user: {
    name: string;
    password: string;
    email: string;
  }): Promise<BaseServerResponse<{ id: string; name: string; email: string }>> {
    const userExists = await this.client.user.findFirst({
      where: { email: user.email },
    });
    if (userExists) {
      return {
        status: 400,
        message: "User with this Email already exists",
      };
    }
    const newUser = await this.client.user.create({
      data: {
        email: user.email,
        name: user.name,
        password: user.password,
      },
    });
    return {
      status: 200,
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    };
  }
  async checkUserPassword(user: {
    email: string;
    password: string;
  }): Promise<BaseServerResponse<Record<string, unknown>>> {
    const userExists = await this.client.user.findFirst({
      where: { email: user.email },
    });
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
