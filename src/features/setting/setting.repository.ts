import { AppError } from "../../shared/appError.error";
import BaseRepository from "../../shared/base.repository";
import { ErrorCode } from "../../shared/errorCode";
import { prepareInsertParts } from "../../shared/helper";
import logger from "../../shared/logger";
import { DbClient } from "../../shared/types";
import { TemplateWithoutIdT } from "./setting.schema";

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
}

export const settingRepository = new SettingRepository();
