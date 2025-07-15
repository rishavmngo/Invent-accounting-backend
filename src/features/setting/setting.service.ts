import BaseService from "../../shared/base.service";
import { settingRepository } from "./setting.repository";
import { TemplateWithoutIdT } from "./setting.schema";

class SettingService extends BaseService {
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
}

export const settingService = new SettingService();
