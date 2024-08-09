import { flowSeriesData } from '@interfaces/flowSeries'

export interface sequenceData {
  id: number
  nameSequence: string
  sequencesSeries: flowSeriesData[]
  description?: string
  duration?: string
  image?: string
  createdAt?: string
  updatedAt?: string
}
