import { Page } from 'puppeteer';
import  * as Restaurant from './DB/manager.restaurant';
import puppeteer from 'puppeteer-extra';
import { DefinitiveDataTypeEnum, ScraperPathConfigType } from './typing';
import { getElementBypath, scrapeByConfig } from './utils/scraper';

const IS_DEV = process.argv[2]?.includes('dev');

const PrefixUrl = IS_DEV ? 'http://localhost:3000' : process.env.RESTAURANT_DETAIL_PREFIX ?? '';

enum SegmentEnum {
  BasicInfo,
  // PromotionInfo,
  RecommendPlatInfo,
  RestaurantImgInfo,
  MenuImgInfo,
  CommentTagInfo,
  CommentInfo
}

const PathRuleConfig: Record<SegmentEnum, ScraperPathConfigType> = {
  [SegmentEnum.BasicInfo]: {
    path: '#basic-info',
    subConfig: {
      briefInfo: {
        path: '.brief-info',
        subConfig: {
          score: { path: '.star-wrapper .mid-score', type: DefinitiveDataTypeEnum.NUMBER },
          scoreTaste: { path: '#comment_score .item[0]', type: DefinitiveDataTypeEnum.NUMBER },
          scoreEnvironment: { path: '#comment_score .item[1]', type: DefinitiveDataTypeEnum.NUMBER },
          scoreService: { path: '#comment_score .item[2]', type: DefinitiveDataTypeEnum.NUMBER },
        }
      },
      address: '.address .map_address #address',
    }
  },
  [SegmentEnum.RecommendPlatInfo]: {
    path: '#shoptabs-wrapper #shop-tabs',
    subConfig: {
     recommendPlats: {
      path: '.shop-tab-recommend',
      handler: function (el: Element | null | undefined) {
        if (!el) return null;
        const ulEl = el.querySelector('ul.recommend-photo');
        if (!ulEl) return null;
        const lis = Array.from(ulEl.querySelectorAll('li.item'));
        return lis.filter(Boolean).map(el => {
          const img = el.querySelector('img')?.src ?? '';
          const name = el.querySelector('p')?.textContent ?? '';
          return { img, name };
        });
      }
     }
    }
  },
  [SegmentEnum.RestaurantImgInfo]: {
    path: '#shoptabs-wrapper #shop-tabs',
    subConfig: {
      restaurantImgs: {
        path: '.shop-tab-photos[0]',
        handler: function (el: Element | null | undefined) {
          if (!el) return null;
          return Array.from(el.querySelectorAll('img')).map(el => el.dataset.src);
        }
      }
    }
  },
  [SegmentEnum.MenuImgInfo]: {
    path: '#shoptabs-wrapper #shop-tabs',
    subConfig: {
      menuImgs: {
        path: '.shop-tab-photos[1]',
        handler: function (el: Element | null | undefined) {
          if (!el) return null;
          return Array.from(el.querySelectorAll('img')).map(el => el.dataset.src);
        }
      }
    }
  },
  [SegmentEnum.CommentTagInfo]: {
    path: '#comment #summaryfilter-wrapper .comment-condition',
    subConfig: {
      commentTags: {
        path: '.content',
        handler: function (el: Element | null | undefined) {
          if (!el) return null;
          const spans = Array.from(el.querySelectorAll('span a'));
          return spans.map(el => el.textContent);
        }
      }
    }
  },
  [SegmentEnum.CommentInfo]: {
    path: '#comment',
    subConfig: {
      comments: {
        path: '#reviewlist-wrapper',
        handler: function (el: Element | null | undefined) {
          if (!el) return null;
          const lis = Array.from(el.querySelectorAll('li.comment-item div.content p.desc'));
          return lis.map(el => el.textContent);
        }
      }
    }
  }
}

async function queryRestaurantInfoById (page: Page, id: string) {
  if (!id || !page) throw new Error('id is required');

  await page.goto('https://www.dianping.com/shop/' + id, { timeout: 0 });

  await page.waitForSelector('#body .body-content .main', { timeout: 0 });
  await page.waitForSelector('#body #reviewlist-wrapper', { timeout: 0 });

  await page.evaluate((str) => {
    const scriptEl = document.createElement('script');
    scriptEl.innerHTML = str;
    document.body.appendChild(scriptEl);
  }, [
      scrapeByConfig.toString(),
      getElementBypath.toString(),
    ].join('\n')
  );

  await new Promise(resolve => setTimeout(resolve, 5 * 1000));

  await page.evaluate(
    str => {
      (window as any).getPathRuleConfig = function () {
        return JSON.parse(str, (k, v) => {
          if (k === 'handler' && typeof v === 'string') {
            return Function("el", v);
          }
          return v;
        });
      }
    },
    JSON.stringify(PathRuleConfig, (_,v) => {
      if (typeof v === 'function') {
        const funStr = v.toString();
        return funStr.slice(funStr.indexOf("{") + 1, funStr.lastIndexOf("}"));
      }
      return v;
    })
  );

  const res = await page.evaluate(() => {
    try {
      const mainDivEl = document.querySelector('#body .body-content .main');
      const Config = (window as any).getPathRuleConfig() as typeof PathRuleConfig;
      const scrapeByConfig = (window as any).scrapeByConfig;
      const ret = {};
      for (const key in Config) {
        const { subConfig, path } = Config[key];
        ret[key] = scrapeByConfig(path, subConfig, mainDivEl);
      }
      return ret;
    } catch (err) {
      return JSON.stringify(err);
    }
  });

  console.log(res);

}

async function main () {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });
  const page = await browser.newPage();

  await queryRestaurantInfoById(page, 'jyOBkcaPVQoQf8Wh');
  
  await browser.close()
}

main();