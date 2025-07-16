import BaseService from "../../shared/base.service";
import { deleteUploadFile } from "../../shared/deleteUploadFile";
import logger from "../../shared/logger";
import { generateInvoiceThumnail } from "./setting.generators";
import { settingRepository } from "./setting.repository";
import {
  SettingsT,
  SettingsWithoutIdT,
  TemplateT,
  TemplateWithoutIdT,
} from "./setting.schema";

class SettingService extends BaseService {
  async uploadLogoTemp(ownerId: number, url: string) {
    const db = this.db;

    try {
      const setting = (await settingRepository.existOrNot(
        ownerId,
        db,
      )) as SettingsT;
      if (!setting) {
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
      const settings: SettingsT = await settingRepository.getById(
        setting.id,
        db,
      );

      const old_url = settings.logo_url;
      settings.logo_url = url;

      await settingRepository.update(settings, db);
      if (old_url) deleteUploadFile(old_url);
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
  async updateTemplateThumbnail(id: number) {
    try {
      const db = this.db;
      const template = (await settingRepository.getTemplateById(
        id,
        db,
      )) as TemplateT;
      const path = await generateInvoiceThumnail(template);
      template.thumbnail = path;
      await settingRepository.updateTemplateThumbanil(template, db);
    } catch (error) {
      logger.error(error);
      throw error;
    }
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

  async getByOwnerId(ownerId: number): Promise<SettingsT | null> {
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
