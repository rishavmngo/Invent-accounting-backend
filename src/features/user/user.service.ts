import { RegistrationInfo } from "../auth/auth.schema";
import { userRepository } from "./user.repository";

class UserService {
  async getUserById(id: string) {
    try {
      const res = await userRepository.findById(id);
      return res;
    } catch (error) {
      console.log(error);
    }
  }

  async getAllUsers() {
    try {
      const res = await userRepository.findAll();
      return res;
    } catch (error) {
      console.log(error);
    }
  }

  async getUserByEmail(email: string) {
    try {
      const res = await userRepository.findByEmail(email);
      return res;
    } catch (error) {
      console.log(error);
    }
  }

  async addUser(user: RegistrationInfo) {
    return await userRepository.insertUser(user);
  }
}

export const userService = new UserService();
