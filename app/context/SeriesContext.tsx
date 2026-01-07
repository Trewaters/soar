import { Series } from '@app/navigator/flows/editSeries/EditSeriesDialog'
import { updateSeries, deleteSeries } from '@lib/seriesService'
import React, { createContext, useContext, useState, useCallback } from 'react'

interface SeriesContextType {
  seriesList: Series[]
  setSeriesList: React.Dispatch<React.SetStateAction<Series[]>>
  updateSeriesInContext: (updated: Series) => Promise<void>
  deleteSeriesInContext: (id: string) => Promise<void>
}

const SeriesContext = createContext<SeriesContextType | undefined>(undefined)

export const SeriesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [seriesList, setSeriesList] = useState<Series[]>([])

  const updateSeriesInContext = useCallback(async (updated: Series) => {
    await updateSeries(updated.id, updated)
    setSeriesList((prev) =>
      prev.map((s) => (s.id === updated.id ? updated : s))
    )
  }, [])

  const deleteSeriesInContext = useCallback(async (id: string) => {
    await deleteSeries(id)
    setSeriesList((prev) => prev.filter((s) => s.id !== id))
  }, [])

  return (
    <SeriesContext.Provider
      value={{
        seriesList,
        setSeriesList,
        updateSeriesInContext,
        deleteSeriesInContext,
      }}
    >
      {children}
    </SeriesContext.Provider>
  )
}

export const useSeriesContext = () => {
  const ctx = useContext(SeriesContext)
  if (!ctx)
    throw new Error('useSeriesContext must be used within a SeriesProvider')
  return ctx
}
