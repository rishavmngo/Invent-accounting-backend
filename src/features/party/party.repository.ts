import BaseRepository from "../../shared/base.repository";
import { prepareInsertParts } from "../../shared/helper";
import { NewPartyT } from "./party.schema";

class PartyRepository extends BaseRepository {
  constructor() {
    super("party");
  }

  async insert(party: NewPartyT) {
    try {
      // await this.db.query("BEGIN");

      // console.log(Object.entries(party));

      const res = prepareInsertParts(party, [
        "opening_balance",
        "as_of_date",
        "receivable",
      ]);

      const query = `INSERT INTO party(${res.keys.join(",")}) VALUES(${res.placeholder}) returning id`;

      console.log(res);

      await this.db.query(query, res.values);

      // await this.db.query("COMMIT");
    } catch (error) {
      // await this.db.query("ROLLBACK");
      console.error(error);
    }
  }
}

export const partyRepository = new PartyRepository();
