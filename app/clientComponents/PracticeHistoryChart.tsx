'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Box, useTheme } from '@mui/material'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

interface PracticeHistoryChartProps {
  data: Array<{ month: string; days: number }>
}

const PracticeHistoryChart: React.FC<PracticeHistoryChartProps> = ({
  data,
}) => {
  const theme = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 300 })

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth
        setDimensions({ width: width > 0 ? width : 800, height: 300 })
      }
    }

    // Initial measurement
    updateDimensions()

    // Update on window resize
    window.addEventListener('resize', updateDimensions)

    // Retry after a short delay to ensure layout is complete
    const timer = setTimeout(updateDimensions, 100)

    return () => {
      window.removeEventListener('resize', updateDimensions)
      clearTimeout(timer)
    }
  }, [])

  if (!data || data.length === 0) {
    return null
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        width: '100%',
        minHeight: 300,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {dimensions.width > 0 && (
        <BarChart
          width={dimensions.width}
          height={dimensions.height}
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#888888" />
          <YAxis tick={{ fontSize: 12 }} stroke="#888888" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: 8,
            }}
            labelStyle={{ fontWeight: 'bold' }}
          />
          <Bar
            dataKey="days"
            fill={theme.palette.warning.main}
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      )}
    </Box>
  )
}

export default PracticeHistoryChart
