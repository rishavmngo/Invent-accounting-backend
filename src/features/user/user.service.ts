import BaseService from "../../shared/base.service";
import logger from "../../shared/logger";
import { RegistrationInfo } from "../auth/auth.schema";
import { userRepository } from "./user.repository";

class UserService extends BaseService {
  async getUserById(id: string) {
    const db = this.db;
    try {
      const res = await userRepository.findById(id, db);
      return res;
    } catch (error) {
      logger.info(error);
    }
  }

  async getAllUsers() {
    const db = this.db;
    try {
      const res = await userRepository.findAll(db);
      return res;
    } catch (error) {
      logger.info(error);
    }
  }

  async getUserByEmail(email: string) {
    const db = this.db;
    try {
      const res = await userRepository.findByEmail(email, db);
      return res;
    } catch (error) {
      logger.info(error);
    }
  }

  async addUser(user: RegistrationInfo) {
    const db = this.db;
    return await userRepository.insertUser(user, db);
  }
}

export const userService = new UserService();
