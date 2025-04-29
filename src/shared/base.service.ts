import db from "../config/db.config";

export default class BaseService {
  db;
  constructor() {
    this.db = db;
  }
}
