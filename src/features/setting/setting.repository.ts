import { AppError } from "../../shared/appError.error";
import BaseRepository from "../../shared/base.repository";
import { ErrorCode } from "../../shared/errorCode";
import { prepareInsertParts } from "../../shared/helper";
import logger from "../../shared/logger";
import { DbClient } from "../../shared/types";
import {
  SettingsT,
  SettingsWithoutIdT,
  TemplateWithoutIdT,
} from "./setting.schema";

class SettingRepository extends BaseRepository {
  constructor() {
    super("party");
  }

  async getAllTemplate(db: DbClient) {
    try {
      const query = "select * from templates";

      const { rows } = await db.query(query);

      return rows;
    } catch (error) {
      logger.error(error);
      throw new AppError(
        "Error occured in DB while fetching all template",
        400,
        ErrorCode.UNEXPECTED_ERROR,
      );
    }
  }

  async getTemplateById(id: number, db: DbClient) {
    try {
      const query = "select * from templates where id=$1";

      const { rows } = await db.query(query, [id]);

      if (rows.length < 1) {
        throw new AppError("Can't able to find template with id");
      }
      return rows[0];
    } catch (error) {
      logger.error(error);
      throw new AppError(
        "Error occured in DB while fetching a template by id",
        400,
        ErrorCode.UNEXPECTED_ERROR,
      );
    }
  }

  async addTemplate(template: TemplateWithoutIdT, db: DbClient) {
    try {
      const res = prepareInsertParts(template);

      const query = `INSERT INTO templats(${res.keys.join(",")}) VALUES(${res.placeholder}) returning id`;

      const { rows } = await db.query(query, res.values);

      if (rows.length < 1) {
        throw new AppError(
          "Adding temapled failed!",
          400,
          ErrorCode.UNEXPECTED_ERROR,
        );
      }
      return rows[0].id;
    } catch (error) {
      logger.error(error);

      throw new AppError(
        "Error occured in DB while adding a template",
        400,
        ErrorCode.UNEXPECTED_ERROR,
      );
    }
  }

  prepareUpdateParts<T extends object>(obj: T, exclude: (keyof T)[] = []) {
    const keys = Object.keys(obj).filter(
      (key) => !exclude.includes(key as keyof T),
    );

    const values = keys.map((key) => obj[key as keyof T]);

    const placeholder = keys
      .map((key, index) => `${key}=$${index + 2}`)
      .join(",");
    return { keys, values, placeholder };
  }

  async update(settings: SettingsT, db: DbClient) {
    const { keys, values, placeholder } = this.prepareUpdateParts(settings, [
      "id",
      "owner_id",
    ]);
    try {
      const query = `UPDATE settings
                      set ${placeholder} 
                      where id=$1
`;
      console.log(keys, values, placeholder);
      await db.query(query, [settings.id, ...values]);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async getByOwnerId(id: number, db: DbClient) {
    try {
      const query = `SELECT * from settings where owner_id = $1`;
      const { rows } = await db.query(query, [id]);

      if (rows.length < 1) {
        throw new AppError(
          "Error occured in DB while fetching setting by ownerId",
          400,
          ErrorCode.UNEXPECTED_ERROR,
        );
      }
      return rows[0];
    } catch (error) {
      logger.error(error);

      throw new AppError(
        "Error occured in DB while fetching setting by ownerId",
        400,
        ErrorCode.UNEXPECTED_ERROR,
      );
    }
  }
  async existOrNot(id: number, db: DbClient) {
    try {
      const query = `SELECT * from settings where owner_id = $1`;
      const { rows } = await db.query(query, [id]);

      if (rows.length < 1) {
        return -1;
      }
      return rows[0].id;
    } catch (error) {
      logger.error(error);

      throw new AppError(
        "Error occured in DB while checking if setting exists",
        400,
        ErrorCode.UNEXPECTED_ERROR,
      );
    }
  }
  async getById(id: number, db: DbClient) {
    try {
      const query = `SELECT * from settings where id = $1`;
      const { rows } = await db.query(query, [id]);

      if (rows.length < 1) {
        throw new AppError(
          "Fetching settings failed by id!",
          400,
          ErrorCode.UNEXPECTED_ERROR,
        );
      }
      return rows[0];
    } catch (error) {
      logger.error(error);

      throw new AppError(
        "Error occured in DB while fetching setting by id",
        400,
        ErrorCode.UNEXPECTED_ERROR,
      );
    }
  }
  async insert(settings: SettingsWithoutIdT, db: DbClient) {
    try {
      const res = prepareInsertParts(settings);

      const query = `INSERT INTO settings(${res.keys.join(",")}) VALUES(${res.placeholder}) returning id`;

      const { rows } = await db.query(query, res.values);

      if (rows.length < 1) {
        throw new AppError(
          "Adding settings failed!",
          400,
          ErrorCode.UNEXPECTED_ERROR,
        );
      }
      return rows[0].id;
    } catch (error) {
      logger.error(error);

      throw new AppError(
        "Error occured in DB while adding settings",
        400,
        ErrorCode.UNEXPECTED_ERROR,
      );
    }
  }
}

export const settingRepository = new SettingRepository();
