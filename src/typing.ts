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

export type ScraperPathConfigType = {
  path: string
  subConfig?: Record<string, string | ScraperPathConfigType>
}