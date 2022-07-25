/* eslint-disable @typescript-eslint/no-namespace */
import { BaseServerResponse } from "../baseResponse";

export interface UserRepositoryModel {
  getUserById(
    id: number,
  ): Promise<BaseServerResponse<{ id: string; name: string; email: string }>>;
  getUserByEmail(
    email: string,
  ): Promise<BaseServerResponse<{ id: string; name: string; email: string }>>;
  getUserByUsername(
    username: string,
  ): Promise<BaseServerResponse<{ id: string; name: string; email: string }>>;
  registerUser(user: {
    name: string;
    password: string;
    email: string;
  }): Promise<BaseServerResponse<{ id: string; name: string; email: string }>>;
}
