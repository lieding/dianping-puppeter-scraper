import * as RestaurantManager from '../src/DB/manager.restaurant'
import { randomUUID } from 'node:crypto'

function test () {
  console.log(RestaurantManager.list());
  const id = randomUUID();
  RestaurantManager.insert({
    id, name: 'test', url: 'test',
    img: 'test', avgPrice: 'test', recommends: ['test'], tag: 'test', addr: 'test', commentCnt: 0
  });
  console.log(RestaurantManager.list());
  RestaurantManager.remove(id);
  console.log(RestaurantManager.list());
}

// test();

function listAllRestaurants () {
  const res = RestaurantManager.list();
  console.log('total restaurants: ', res.length);
  res.forEach((el) => {
    console.log(el.id, ' ', el.name);
  })
}

listAllRestaurants();