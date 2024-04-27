import { eq } from "drizzle-orm/expressions";
import { IRestaurant } from "../typing";
import { DB } from "./_db";
import { restaurants } from "./schema";

export function insert (data: IRestaurant) {
  const input = { ...data, recommends: data.recommends.join(','), };
  return DB
    .insert(restaurants)
    .values([input])
    .run();
}

export function list () {
  return DB
    .select()
    .from(restaurants)
    .all();
}

export function remove (id: string) {
  return DB
    .delete(restaurants)
    .where(eq(restaurants.id, id))
    .run();
}

export function get (id: string) {
  return DB
    .select()
    .from(restaurants)
    .where(eq(restaurants.id, id))
    .get();
}