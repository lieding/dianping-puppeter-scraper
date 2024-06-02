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

export interface IRestaurantDetail {
  id: string
  scoreTaste: number
  scoreEnvironment: number
  scoreService: number
  address: string
  timing: string
  recommendPlats?: { img: string, name: string }[]
  restaurantImgs?: string[]
  menuImgs?: string[]
  commentTags?: string[]
  comments?: string[]
  lat?: number
  lng?: number
  geohashIn5?: string
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

export interface IPlace {
  id: string
  name: string
  commentCnt: number
  type: string
  avgPrice: number | null
  area: string
  img: string
}