import { getCoordinateByAddress } from './utils/coordinate'
import * as RestaurantDetailManager from './DB/manager.restaurantDetail';
import { validateLocation, geohashForLocation } from 'geofire-common';

async function run () {
  const list = RestaurantDetailManager.list();
  for (const el of list) {
    if ((!el.lat || !el.lng || !el.geohashIn5) && el.address) {
      const coordinate = await getCoordinateByAddress(el.address);
      const [ lng, lat ] = coordinate ?? [];
      if (!lat || !lng) continue;
      try {
        validateLocation([lat, lng]);
        const geohash = geohashForLocation([lat, lng], 5);
        await RestaurantDetailManager.setGeolocationInfo(el.id, { lat, lng, geohashIn5: geohash });
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (err) {
        console.error(err);
      }
    }
  }
}

run();