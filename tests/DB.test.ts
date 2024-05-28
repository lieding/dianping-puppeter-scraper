import * as RestaurantManager from '../src/DB/manager.restaurant';
import * as RestaurantDetailManager from '../src/DB/manager.restaurantDetail';
import { randomUUID } from 'node:crypto'

function restaurant () {
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

function listAllRestaurants () {
  const res = RestaurantManager.list();
  console.log('total restaurants: ', res.length);
  res.forEach((el) => {
    console.log(el.id, ' ', el.name);
  })
}

function restaurantDetail () {
  // console.log(RestaurantDetailManager.list());
  // const id = randomUUID();
  // RestaurantDetailManager.insert({
  //   id,
  //   scoreEnvironment: 3.5, scoreService: 3.5, scoreTaste: 3.5,
  //   comments: ['test'], address: 'test', timing: 'test',
  //   commentTags: [], recommendPlats: [{ name: '1', img: 'test' }],
  //   restaurantImgs: [],
  //   menuImgs: []
  // });
  // console.log(RestaurantDetailManager.list());
  RestaurantDetailManager.remove('0f6601f5-a6cc-4b6b-bc4c-8c4ab7736f43');
  console.log(RestaurantDetailManager.list());
}

function listAllRestaurantDetails () {
  const res = RestaurantDetailManager.list();
  console.log('total restaurant details: ', res.length);
  res.forEach((el) => {
    if (!el.lat || !el.lng || !el.geohashIn5) {
      const {name} = RestaurantManager.get(el.id) ?? {};
      console.log(`id: ${el.id}, name: ${name}, address: ${el.address}, lat: ${el.lat}, lng: ${el.lng}, geohashIn5: ${el.geohashIn5}`);
    }
  })
}
