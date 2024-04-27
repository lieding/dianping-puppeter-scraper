import { Page } from 'puppeteer';
import  * as Restaurant from './DB/manager.restaurant';
import { ScraperPathConfigType } from './typing';

const IS_DEV = process.argv[2]?.includes('dev');

const PrefixUrl = IS_DEV ? 'http://localhost:3000' : process.env.RESTAURANT_DETAIL_PREFIX ?? '';

enum SegmentEnum {
  BasicInfo,
  // PromotionInfo,
  RecommendPlatInfo,
  RestaurantImgInfo,
  MenuImgInfo,
}

const PathRuleConfig: Record<SegmentEnum, ScraperPathConfigType> = {
  [SegmentEnum.BasicInfo]: {
    path: '#basic-info',
    subConfig: {
      briefInfo: {
        path: '.brief-info',
        subConfig: {
          score: '.star-wrapper .mid-score',
          scoreTaste: '.comment_score .item[0]',
          scoreEnvironment: '.comment_score .item[1]',
          scoreService: '.comment_score .item[2]',
        }
      },
      address: {
        path: '.address .map_address #address',
      },
    }
  },
  [SegmentEnum.RecommendPlatInfo]: {
    path: '#shoptabs-wrapper #shop-tabs .shop-tab-recommend',
  },
  [SegmentEnum.RestaurantImgInfo]: {
    path: '#shoptabs-wrapper #shop-tabs .shop-tab-photos[0]',
  },
  [SegmentEnum.MenuImgInfo]: {
    path: '#shoptabs-wrapper #shop-tabs .shop-tab-photos[1]',
  }
}

export async function queryRestaurantInfoById (page: Page, id: string) {
  if (!id || !page) throw new Error('id is required');

  await page.goto(PrefixUrl + `/${id}`, { timeout: 0 });

  await page.waitForSelector('.shop-body .main', { timeout: 0 });

  const {} = await page.evaluate(() => {
    const mainDivEl = document.querySelector('.shop-body .main');
    
    return {};
  });

  if (size) {
    const restaurantList = await extractDataFromLiEl(page);
    if (restaurantList.length) {
      for (const restaurant of restaurantList) {
        if (restaurant && !Restaurant.get(restaurant.id)) {
          console.log(restaurant.name + 'inserted into databse');
          Restaurant.insert(restaurant);
        }
      }
    };
  }
  await new Promise(res => setTimeout(res, 30 * 1000));
  const nextUrl = StartURL + `/p` + (curPage++);
  await page.goto(nextUrl, { timeout: 0 });
}

main();