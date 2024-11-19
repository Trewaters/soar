import { Box } from '@mui/material'
import React from 'react'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'

interface CustomPaginationProps {
  count: number
  page: number
  // eslint-disable-next-line no-unused-vars
  onChange: (event: React.ChangeEvent<unknown>, value: number) => void
}

const CustomPaginationCircles: React.FC<CustomPaginationProps> = ({
  count,
  page,
  onChange,
}) => {
  const handleClick = (newPage: number) => {
    onChange({} as React.ChangeEvent<unknown>, newPage)
  }

  const getTransparency = (index: number) => {
    const distance = Math.abs(page - index)
    const maxDistance = Math.max(page - 1, count - page)
    return 1 - (Math.min(1, distance / maxDistance) * 0.9 + 0.1) // 1.0 to 0.1 transparency
  }

  const handlePrevious = () => {
    if (page > 1) {
      handleClick(page - 1)
    }
  }

  const handleNext = () => {
    if (page < count) {
      handleClick(page + 1)
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        onClick={handlePrevious}
        sx={{
          cursor: page > 1 ? 'pointer' : 'default',
          opacity: page > 1 ? 1 : 0.5,
          margin: '0 10px',
        }}
      >
        <ArrowBackIosNewIcon sx={{ height: 12, width: 12 }} />
      </Box>
      {Array.from({ length: count }, (_, index) => (
        <Box
          key={index}
          onClick={() => handleClick(index + 1)}
          style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            margin: '0 5px',
            backgroundColor: `rgba(246, 137, 61, ${getTransparency(index + 1)})`,
            cursor: 'pointer',
          }}
        />
      ))}
      <Box
        onClick={handleNext}
        sx={{
          cursor: page < count ? 'pointer' : 'default',
          opacity: page < count ? 1 : 0.5,
          margin: '0 10px',
        }}
      >
        <ArrowForwardIosIcon sx={{ height: 12, width: 12 }} />
      </Box>
    </Box>
  )
}

export default CustomPaginationCircles
