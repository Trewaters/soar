import { FlowSeriesData } from '@interfaces/flowSeries'

export interface SequenceData {
  id: number
  nameSequence: string
  sequencesSeries: FlowSeriesData[]
  description?: string
  duration?: string
  image?: string
  breath_direction?: string
  createdAt?: string
  updatedAt?: string
}
