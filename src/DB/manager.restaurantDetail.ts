import { eq } from "drizzle-orm";
import { IRestaurantDetail } from "../typing";
import { DB } from "./_db";
import { restaurantDetails } from "./schema.restaurantDetail";

export function list () {
  return DB
    .select()
    .from(restaurantDetails)
    .all();
}

export function insert (data: IRestaurantDetail) {
  const comments: string[] = [];
  if (Array.isArray(data.comments)) {
    for (const comment of data.comments) {
      const idx = comments.findIndex(it => it.substring(0, 8) === comment.substring(0, 8));
      if (idx < 0) {
        comments.push(comment);
      } else {
        if (comment.length > comments[idx].length) {
          comments[idx] = comment;
        }
      }
    }
  }
  const input = {
    id: data.id,
    scoreTaste: data.scoreTaste,
    scoreEnvironment: data.scoreEnvironment,
    scoreService: data.scoreService,
    address: data.address,
    timing: data.timing,
    recommendPlats: data.recommendPlats?.map(it => ({...it, name: it.name.replace(/\n/g, '').trim()})) ?? [],
    restaurantImgs: data.restaurantImgs ?? [],
    menuImgs: data.menuImgs ?? [],
    commentTags: data.commentTags ?? [],
    comments,
  };
  return DB
    .insert(restaurantDetails)
    .values([input])
    .run();
}

export function remove (id: string) {
  return DB
    .delete(restaurantDetails)
    .where(eq(restaurantDetails.id, id))
    .run();
}

export function get (id: string) {
  return DB
    .select()
    .from(restaurantDetails)
    .where(eq(restaurantDetails.id, id))
    .get();
}
