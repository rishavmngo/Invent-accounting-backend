import { USER } from "./user.schema";

export function sanatizeUser(user: USER): Omit<USER, "password"> {
  const { password, ...safeUser } = user;
  void password;
  return safeUser;
}
