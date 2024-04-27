import { Page } from "puppeteer";

export async function setCookie (page: Page) {
  const Cookie = process.env.COOKIE ?? '';
  if (Cookie) {
    const list = Cookie.split('; ')
      .map((el) => el.split('='))
      .filter((el) => el.length === 2)
      .map((el) => ({ name: el[0], value: el[1] }));
    const expires = Date.now() + 1000 * 60 * 60;
    for (const { name, value } of list) {
      await page.setCookie({ name, value, expires, path: '/', domain: '.dianping.com' });
    }
  }
}