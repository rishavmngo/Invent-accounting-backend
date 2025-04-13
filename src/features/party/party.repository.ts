import { AppError } from "../../shared/appError.error";
import BaseRepository from "../../shared/base.repository";
import { ErrorCode } from "../../shared/errorCode";
import { prepareInsertParts } from "../../shared/helper";
import logger from "../../shared/logger";
import { NewPartyT } from "./party.schema";

class PartyRepository extends BaseRepository {
  constructor() {
    super("party");
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
      const id = rows[0].id;

      if (party["opening_balance"]) {
        let tranType = "party_o_reduc";

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
      throw new AppError("Transaction failed", 400, ErrorCode.UNEXPECTED_ERROR);
    }
  }
}

export const partyRepository = new PartyRepository();
