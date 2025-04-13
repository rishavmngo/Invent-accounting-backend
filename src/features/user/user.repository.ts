import BaseRepository from "../../shared/base.repository";
import { DatabaseError } from "../../shared/execeptions/DatabaseError";
import { RegistrationInfo } from "../auth/auth.schema";

class UserRepository extends BaseRepository {
  constructor() {
    super("users");
  }

  async findById(id: string) {
    const query = `SELECT * FROM ${this.table} where id=$1`;
    const { rows } = await this.db.query(query, [id]);

    return rows[0];
  }

  async findAll() {
    const query = `SELECT id,name,email,created_at FROM ${this.table}`;

    const { rows } = await this.db.query(query);

    return rows;
  }

  async findByEmail(email: string) {
    const query = `SELECT * FROM ${this.table} where email=$1`;

    const { rows } = await this.db.query(query, [email]);

    return rows[0];
  }

  async insertUser(user: RegistrationInfo) {
    const query = `INSERT INTO ${this.table} (email,name,password) values($1,$2,$3) RETURNING id`;

    try {
      const { rows } = await this.db.query(query, [
        user.email,
        user.name,
        user.password,
      ]);
      return rows[0].id ?? 0;
    } catch (error) {
      console.error(error);
      throw new DatabaseError();
    }
  }
}

export const userRepository = new UserRepository();
