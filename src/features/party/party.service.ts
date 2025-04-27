import { partyRepository } from "./party.repository";
import { NewPartyT, PartyT } from "./party.schema";

class PartyService {
  async add(newParty: NewPartyT) {
    return partyRepository.insert(newParty);
  }

  async getAllPartyCard(userId: number): Promise<PartyT[]> {
    return partyRepository.getAllPartiesCardData(userId);
  }

  async getById(userId: number, partyId: number): Promise<PartyT> {
    return partyRepository.getPartyById(userId, partyId);
  }
}

export const partyService = new PartyService();
