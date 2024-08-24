import { FlowSeriesSequence } from '@app/context/AsanaSeriesContext'

export interface SequenceData {
  id: number
  nameSequence: string
  sequencesSeries: FlowSeriesSequence[]
  description?: string
  duration?: string
  image?: string
  breath_direction?: string
  createdAt?: string
  updatedAt?: string
}
