import { ScraperPathConfigType, DefinitiveDataTypeEnum } from '../typing';

export function getElementBypath (el: Element, path: string) {
  const regexp = /\[\d+\]/;
  if (!regexp.test(path)) {
    return el.querySelector(path);
  }
  const segmented = path.split(' ').filter(Boolean);
  let element: Element | undefined | null = el;
  for (const segment of segmented) {
    if (regexp.test(segment)) {
      const extracted = segment.match(/\[(\d+)\]/);
      const idxStr = extracted?.[1];
      if (isNaN(Number(idxStr))) throw new Error('wrong path: ' + path); 
      const idx = Number(idxStr) ?? 0;
      const selector = segment.replace(/\[\d+\]/, '');
      element = element?.querySelectorAll(selector)[idx];
    } else {
      element = element?.querySelector(segment);
    }
    if (!element) return null;
  }
  return element;
}

export function scrapeByConfig (path: string, config: ScraperPathConfigType['subConfig'], wrapper: Element | null | undefined) {
  if (!wrapper || !config) return null;
  const foundWrapper = getElementBypath(wrapper, path);
  if (!foundWrapper) return null;
  const ret = {} as Record<string, any>;
  for (const key in config) {
    const subConfig = config[key];
    if (typeof subConfig === 'string') {
      ret[key] = getElementBypath(foundWrapper, subConfig)?.textContent ?? '';
      continue;
    }
    const subPath = subConfig.path;
    if ('type' in subConfig) {
      const type: DefinitiveDataTypeEnum = subConfig.type;
      switch (type) {
        case 'number': {
          const extracted = getElementBypath(foundWrapper, subPath)?.textContent;
          ret[key] = Number(extracted?.match(/(\d+\.?\d?)/)?.[0]) || 0;
          break;
        }
        case 'url':
          ret[key] = (getElementBypath(foundWrapper, subPath) as any)?.href ?? '';
          break;
        case 'src':
          ret[key] = (getElementBypath(foundWrapper, subPath) as any)?.src ?? '';
          break;
      }
    } else if ('handler' in subConfig) {
      const el = getElementBypath(foundWrapper, subPath);
      ret[key] = subConfig.handler(el);
    } else if ('subConfig' in subConfig) {
      ret[key] = scrapeByConfig(subPath, subConfig.subConfig, foundWrapper);
    }
  }
  return ret;
}