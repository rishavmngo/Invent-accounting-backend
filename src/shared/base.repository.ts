import db from "../config/db.config";

export default class BaseRepository {
  table;
  db;
  constructor(table: string) {
    this.table = table;
    this.db = db;
  }
}
