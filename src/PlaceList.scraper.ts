import { Page } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import * as PlaceListManager from './DB/manager.place';

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
// import StealthPlugin from 'puppeteer-extra-plugin-stealth'
// puppeteer.use(StealthPlugin());

const StartURL = 'https://www.dianping.com/paris/ch30/o11';

const MAX_PAGE = 20;

async function main () {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    ignoreDefaultArgs: true,
    executablePath: `C:\\Users\\Administrator\\.cache\\puppeteer\\chrome\\win64-124.0.6367.78\\chrome-win64\\chrome.exe`,
    userDataDir: `C:\\Users\\Administrator\\AppData\\Local\\Google\\Chrome for Testing\\User Data\\Default`,
    args: [
      '--flag-switches-begin', 
      '--flag-switches-end',
      //' --enable-automation',
      '--no-first-run',
      '--user-data-dir=C:\\Users\\Administrator\\AppData\\Local\\Google\\Chrome for Testing\\User Data\\Default'
    ]
  });
  const page = await browser.newPage()

  await page.goto(StartURL, { timeout: 0 });

  let curPage = 2;

  while (curPage <= MAX_PAGE) {
    await page.waitForSelector('#shop-all-list', { timeout: 0 });

    const size = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll('#shop-all-list ul li'));
      els.forEach((el) => el.classList.toggle(`target-place`));
      return els.length;
    });
  
    if (size) {
      const placeList = await extractDataFromLiEl(page);
      if (placeList.length) {
        for (const place of placeList) {
          if (place && !PlaceListManager.get(place.id)) {
            console.log(place.name + 'inserted into databse');
            PlaceListManager.insert(place);
          }
        }
      };
    }
    for (let i = 0;i < 8;i++) {
      await new Promise(resolve => setTimeout(resolve, 3 * 1000));
      page.evaluate(() => window.scrollTo(0, Math.random() * 400))
    }
    const nextUrl = StartURL + 'p' + (curPage++);
    await page.goto(nextUrl, { timeout: 0 });
  }

  await browser.close()
}

main();

function extractDataFromLiEl (page: Page) {
  return page.evaluate(() => {
    const lis = Array.from(document.querySelectorAll(`.target-place`));
    return lis.map((li) => {
      let img = '', id = '', name = '', avgPrice: number | null = null, type = '', area = '', commentCnt = 0;
      if (!li) return null;
      const imgAnchorEl = li.querySelector('.pic a') as HTMLAnchorElement | undefined;
      if (imgAnchorEl) {
        id = imgAnchorEl.dataset.shopid ?? '';
        img = imgAnchorEl.querySelector('img')?.src ?? '';
      }
      const textDivEl = li.querySelector('.txt') as HTMLDivElement | undefined;
      if (textDivEl) {
        name = textDivEl.querySelector('.tit a h4')?.textContent ?? '';
        const commentCntStr = textDivEl.querySelector('.comment a.review-num b')?.textContent;
        commentCnt = Number(commentCntStr) ?? 0;
        const avgPriceText = textDivEl.querySelector('.comment a.mean-price b')?.textContent ?? '';
        avgPrice = Number(avgPriceText?.match(/(\d+\.?\d?)/)?.[0]) || null;
      }
      const tagAddrDivEl = li.querySelector('.tag-addr') as HTMLDivElement | undefined;
      if (tagAddrDivEl) {
        const spans = tagAddrDivEl.querySelectorAll('span');
        const tagSpan = spans[0] as HTMLSpanElement | undefined;
        const addrSpan = spans[1] as HTMLSpanElement | undefined;
        if (tagSpan) type = tagSpan.textContent ?? '';
        if (addrSpan) area = addrSpan.textContent ?? '';
      }
      return {
        img, id, name, avgPrice, type, area, commentCnt}
    })
  });
}