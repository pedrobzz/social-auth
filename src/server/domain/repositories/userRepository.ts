/* eslint-disable @typescript-eslint/no-namespace */

import { BaseServerResponse } from "../baseResponse";
import { RequireAtLeastOne } from "../utils";

export interface UserRepositoryModel {
  getUserById(id: string): Promise<
    BaseServerResponse<{
      id: string;
      name: string;
      email: string;
      username: string | null;
      image: string | null;
    }>
  >;

  getUserByEmail(email: string): Promise<
    BaseServerResponse<{
      id: string;
      name: string;
      email: string;
      username: string | null;
      image: string | null;
    }>
  >;

  getUserByUsername(username: string): Promise<
    BaseServerResponse<{
      id: string;
      name: string;
      email: string;
      username: string | null;
      image: string | null;
    }>
  >;

  registerUser(user: {
    name: string;
    password: string;
    email: string;
  }): Promise<
    BaseServerResponse<{
      id: string;
      name: string;
      email: string;
      username: string | null;
      image: string | null;
    }>
  >;

  checkUserPassword(user: {
    email: string;
    password: string;
  }): Promise<BaseServerResponse>;

  updateUser(
    userId: string,
    update: RequireAtLeastOne<{
      email: string;
      emailVerified: Date;
      name: string;
      username: string | null;
      image: string;
      password: string;
    }>,
  ): Promise<
    BaseServerResponse<{
      id: string;
      name: string;
      email: string;
      username: string | null;
      image: string | null;
    }>
  >;
}
