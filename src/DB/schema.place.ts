import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

const PlaceConfig = {
  id: text('id').notNull().primaryKey(),
  name: text('name'),
  commentCnt: integer('comment_cnt'),
  type: text('type'),
  avgPrice: integer('avg_price'),
  area: text('area'),
  img: text('img'),
}

export const places = sqliteTable('places', PlaceConfig);