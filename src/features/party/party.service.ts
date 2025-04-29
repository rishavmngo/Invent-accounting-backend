import BaseService from "../../shared/base.service";
import { partyRepository } from "./party.repository";
import { NewPartyT, PartyT } from "./party.schema";

class PartyService extends BaseService {
  async add(newParty: NewPartyT) {
    const db = this.db;
    return partyRepository.insert(newParty, db);
  }

  async getAllPartyCard(userId: number): Promise<PartyT[]> {
    const db = this.db;
    return partyRepository.getAllPartiesCardData(userId, db);
  }

  async getById(userId: number, partyId: number): Promise<PartyT> {
    const db = this.db;
    return partyRepository.getPartyById(userId, partyId, db);
  }
}

export const partyService = new PartyService();
