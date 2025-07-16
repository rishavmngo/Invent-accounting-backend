import BaseService from "../../shared/base.service";
import logger from "../../shared/logger";
import { settingRepository } from "./setting.repository";
import {
  SettingsT,
  SettingsWithoutIdT,
  TemplateWithoutIdT,
} from "./setting.schema";

class SettingService extends BaseService {
  async uploadLogoTemp(ownerId: number, url: string) {
    const db = this.db;

    try {
      const id = await settingRepository.existOrNot(ownerId, db);
      if (id == -1) {
        const settings: SettingsWithoutIdT = {
          logo_url: url,
          owner_id: ownerId,
          template_id: null,
          dark_mode: false,
          name: null,
          contact_number: null,
          address: null,
          website: null,
          signature_url: null,
          created_at: null,
          updated_at: null,
        };
        await settingRepository.insert(settings, db);
        return;
      }
      const settings: SettingsT = await settingRepository.getById(id, db);

      settings.logo_url = url;

      await settingRepository.update(settings, db);
      return;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
  async getAllTemplate() {
    const db = this.db;
    return await settingRepository.getAllTemplate(db);
  }

  async getTemplateById(id: number) {
    const db = this.db;
    return await settingRepository.getTemplateById(id, db);
  }

  async addTemplate(template: TemplateWithoutIdT) {
    const db = this.db;
    return await settingRepository.addTemplate(template, db);
  }
  async add(settings: SettingsWithoutIdT) {
    const db = this.db;
    return await settingRepository.insert(settings, db);
  }

  async getByOwnerId(ownerId: number) {
    const db = this.db;
    return await settingRepository.getByOwnerId(ownerId, db);
  }
  async getById(id: number) {
    const db = this.db;
    return await settingRepository.getById(id, db);
  }
  async update(settings: SettingsT) {
    const db = this.db;
    return await settingRepository.update(settings, db);
  }
}

export const settingService = new SettingService();
