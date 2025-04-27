import { AppError } from "../../shared/appError.error";
import BaseRepository from "../../shared/base.repository";
import { ErrorCode } from "../../shared/errorCode";
import { prepareInsertParts } from "../../shared/helper";
import logger from "../../shared/logger";
import { NewPartyT, PartyT } from "./party.schema";

class PartyRepository extends BaseRepository {
  constructor() {
    super("party");
  }

  async getPartyById(userId: number, partyId: number): Promise<PartyT> {
    try {
      const query = `SELECT * FROM party WHERE user_id=$1 AND id=$2`;

      const res = await this.db.query(query, [userId, partyId]);
      console.log(res.rows[0]);

      if (res.rows.length < 1) {
        throw new AppError(
          "Can't able to find party",
          400,
          ErrorCode.PARTY_ADD_FAILED,
        );
      }

      return res.rows[0];
    } catch (error) {
      logger.error(error);

      throw new AppError(
        "Error occured in DB while fetching  party by Id!",
        400,
        ErrorCode.UNEXPECTED_ERROR,
      );
    }
  }

  async getAllPartiesCardData(userId: number): Promise<PartyT[]> {
    try {
      const query = `SELECT * FROM party WHERE user_id=$1`;

      const { rows } = await this.db.query(query, [userId]);

      return rows;
    } catch (error) {
      logger.error(error);

      throw new AppError(
        "Error occured in DB while fetching  party card data!",
        400,
        ErrorCode.UNEXPECTED_ERROR,
      );
    }
  }

  async insert(party: NewPartyT) {
    try {
      await this.db.query("BEGIN");

      const res = prepareInsertParts(party, [
        "opening_balance",
        "as_of_date",
        "receivable",
      ]);

      const query = `INSERT INTO party(${res.keys.join(",")}) VALUES(${res.placeholder}) returning id`;

      const { rows } = await this.db.query(query, res.values);

      if (rows.length < 1) {
        throw new AppError(
          "Adding party failed!",
          400,
          ErrorCode.PARTY_ADD_FAILED,
        );
      }
      const id = rows[0].id;

      if (party["opening_balance"]) {
        let tranType = "party_o_reduce";

        if (party["receivable"]) {
          tranType = "party_o_add";
        }
        const query2 = `INSERT INTO party_opening_balance(party_id,type,amount,as_of_date) VALUES($1,$2,$3,$4) returning id`;

        await this.db.query(query2, [
          id,
          tranType,
          party["opening_balance"],
          party["as_of_date"],
        ]);
      }

      await this.db.query("COMMIT");
    } catch (error) {
      logger.error(error);
      await this.db.query("ROLLBACK");
      throw new AppError(
        "Error occured in DB while adding a party",
        400,
        ErrorCode.UNEXPECTED_ERROR,
      );
    }
  }
}

export const partyRepository = new PartyRepository();
