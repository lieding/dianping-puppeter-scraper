import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { IRestaurant } from "../typing";

const RestaurantConfig = {
  id: text('id').notNull().primaryKey(),
  name: text('name').notNull(),
  url: text('url').notNull(),
  img: text('img'),
  addr: text('addr'),
  tag: text('tag'),
  avgPrice: text('avg_price'),
  recommends: text('recommends'),
  commentCnt: integer('commentCnt'),
}

export const restaurants = sqliteTable('restaurants', RestaurantConfig);