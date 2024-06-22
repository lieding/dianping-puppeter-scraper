function download(href, title) {
  const a = document.createElement('a');
  a.setAttribute('href', href);
  a.setAttribute('download', title);
  a.click();
}

async function start () {
  window.curPage = 1;
  const MAX_PAGE = 2;
  const list = []
  while (curPage <= MAX_PAGE) {
    const size = tag();
    if (size === 0) break;
    const data = extract();
    list.push(...data);
    await new Promise(resolve => setTimeout(resolve, 30 * 1000));
    nextPage();
  }
  const content = list.map(el => `${el.title}|${el.comment}`).join('\n');
  const blob = new Blob(['title|comment\n' + content]);
  const href = URL.createObjectURL(blob);
  download(href, 'data.csv');
  URL.revokeObjectURL(href);
}

function nextPage () {
  const toNextAnchor = document.querySelector('[data-test-target="restaurants-detail"] section#REVIEWS a[data-smoke-attr="pagination-next-arrow"]');
  toNextAnchor.click();
  curPage++;
}

function tag () {
  const reviewEl = document.querySelector('[data-test-target="restaurants-detail"] section#REVIEWS')
  if (!reviewEl) return 0;
  const els = Array.from(reviewEl.querySelectorAll('[data-automation="reviewCard"]'));
  els.forEach((el) => el.classList.toggle(`scraper-target-comment`));
  return els.length;
}

function extract () {
  const lis = Array.from(document.querySelectorAll(`.scraper-target-comment`));
  return lis.map((li) => {
    let title = '', comment = '';
    const titleDivEl = li.querySelector('[data-test-target="review-title"]');
    if (titleDivEl) {
      const aEl = titleDivEl.querySelector('a');
      if (aEl) {
        title = aEl.textContent ?? '';
      }
    }
    const commentDivEl = li.querySelector('[data-test-target="review-body"]');
    if (commentDivEl) {
      const spans = commentDivEl.querySelectorAll('span');
      comment = spans[1]?.textContent ?? spans[0]?.textContent ?? '';
    }
    return { title, comment: comment.replaceAll('\n', ' ') };
  })
}