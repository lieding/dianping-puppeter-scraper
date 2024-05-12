export interface IRestaurant {
  id: string
  img: string
  url: string
  name: string
  avgPrice: string
  recommends: string[]
  tag: string
  addr: string
  commentCnt: number
}

export enum DefinitiveDataTypeEnum {
  NUMBER = 'number',
  URL = 'url',
  SRC = 'src',
}

type ScraperPathDefinitiveType = {
  path: string;
  type: DefinitiveDataTypeEnum
}

type ScraperHandlerType = {
  path: string
  handler: (page: Element | null | undefined) => any
}

export type ScraperPathConfigType = {
  path: string
  subConfig?: Record<string, string | ScraperPathDefinitiveType | ScraperHandlerType | ScraperPathConfigType>
}