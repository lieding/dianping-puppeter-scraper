import { eq } from "drizzle-orm/expressions";
import { IPlace } from "../typing";
import { DB } from "./_db";
import { places } from "./schema.place";

export function insert (data: IPlace) {
  const input = { ...data };
  return DB
    .insert(places)
    .values([input])
    .run();
}

export function list () {
  return DB
    .select()
    .from(places)
    .all();
}

export function remove (id: string) {
  return DB
    .delete(places)
    .where(eq(places.id, id))
    .run();
}

export function get (id: string) {
  return DB
    .select()
    .from(places)
    .where(eq(places.id, id))
    .get();
}