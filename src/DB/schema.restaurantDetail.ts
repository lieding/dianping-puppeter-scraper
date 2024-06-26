import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

const RestaurantDetailConfig = {
  id: text('id').notNull().primaryKey(),
  scoreTaste: integer('score_taste'),
  scoreEnvironment: integer('score_environment'),
  scoreService: integer('score_service'),
  address: text('address'),
  timing: text('timing'),
  recommendPlats: text('recommend_plats', { mode: 'json' }).$type<{ img: string, name: string }[]>(),
  restaurantImgs: text('restaurant_imgs', { mode: 'json' }).$type<string[]>(),
  menuImgs: text('menu_imgs', { mode: 'json' }).$type<string[]>(),
  commentTags: text('comment_tags', { mode: 'json' }).$type<string[]>(),
  comments: text('comments', { mode: 'json' }).$type<string[]>(),
  lat: real('lat'),
  lng: real('lng'),
  geohashIn5: text('geohash_in_5'),
}

export const restaurantDetails = sqliteTable('restaurant_details', RestaurantDetailConfig);