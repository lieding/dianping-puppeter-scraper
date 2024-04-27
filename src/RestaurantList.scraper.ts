import { Page } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import  * as Restaurant from './DB/manager.restaurant';

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
// import StealthPlugin from 'puppeteer-extra-plugin-stealth'
// puppeteer.use(StealthPlugin());

const IS_DEV = process.argv[2]?.includes('dev');

const StartURL = IS_DEV ? 'http://localhost:3000' : process.env.RESTAURANT_START_URL ?? '';

const MAX_PAGE = 50;

async function main () {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });
  const page = await browser.newPage()

  const Cookie = process.env.COOKIE ?? '';
  if (!IS_DEV && Cookie) {
    const list = Cookie.split('; ')
      .map((el) => el.split('='))
      .filter((el) => el.length === 2)
      .map((el) => ({ name: el[0], value: el[1] }));
    const expires = Date.now() + 1000 * 60 * 60;
    for (const { name, value } of list) {
      await page.setCookie({ name, value, expires, path: '/', domain: '.dianping.com' });
    }
  }

  await page.goto(StartURL, { timeout: 0 });

  let curPage = 2;

  while (curPage <= MAX_PAGE) {
    await page.waitForSelector('#shop-all-list', { timeout: 0 });

    const size = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll('#shop-all-list ul li'));
      els.forEach((el) => el.classList.toggle(`target-restaurant`));
      return els.length;
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

  await browser.close()
}

main();

function extractDataFromLiEl (page: Page) {
  return page.evaluate(() => {
    const lis = Array.from(document.querySelectorAll(`.target-restaurant`));
    return lis.map((li) => {
      let img = '', url = '', id = '', name = '', avgPrice = '',
        recommends: string[] = [], tag = '', addr = '', commentCnt = 0;
      if (!li) return null;
      const imgAnchorEl = li.querySelector('.pic a') as HTMLAnchorElement | undefined;
      if (imgAnchorEl) {
        url = imgAnchorEl.href;
        id = imgAnchorEl.dataset.shopid ?? '';
        img = imgAnchorEl.querySelector('img')?.src ?? '';
      }
      const textDivEl = li.querySelector('.txt') as HTMLDivElement | undefined;
      if (textDivEl) {
        name = textDivEl.querySelector('.tit a h4')?.textContent ?? '';
        const commentCntStr = textDivEl.querySelector('.comment a.review-num b')?.textContent;
        commentCnt = Number(commentCntStr) ?? 0;
        avgPrice = textDivEl.querySelector('.comment a.mean-price b')?.textContent ?? '';
      }
      const tagAddrDivEl = li.querySelector('.tag-addr') as HTMLDivElement | undefined;
      if (tagAddrDivEl) {
        const spans = tagAddrDivEl.querySelectorAll('span');
        const tagSpan = spans[0] as HTMLSpanElement | undefined;
        const addrSpan = spans[1] as HTMLSpanElement | undefined;
        if (tagSpan) tag = tagSpan.textContent ?? '';
        if (addrSpan) addr = addrSpan.textContent ?? '';
      }
      const recommendDivEl = li.querySelector('.recommend') as HTMLDivElement | undefined;
      if (recommendDivEl) {
        const recommendAEls = recommendDivEl.querySelectorAll('a');
        for (const recommend of recommendAEls) {
          const name = recommend.textContent ?? '';
          const href = recommend.getAttribute('href') ?? '';
          if (name) recommends.push([name, href].join('$'));
        }
      }
      return {
        img, url, id, name, avgPrice, recommends, tag, addr, commentCnt}
    })
  });
}