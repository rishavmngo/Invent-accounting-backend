import { partyRepository } from "./party.repository";
import { NewPartyT } from "./party.schema";

class PartyService {
  async add(newParty: NewPartyT) {
    return partyRepository.insert(newParty);
  }
}

export const partyService = new PartyService();
