import { Box, useTheme } from '@mui/material'
import React from 'react'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { COLORS } from '../../styles/theme'

export interface CustomPaginationProps {
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
  const theme = useTheme()
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
      component="nav"
      aria-label="Pagination navigation"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        component="button"
        onClick={handlePrevious}
        aria-label="Go to previous page"
        disabled={page <= 1}
        sx={{
          cursor: page > 1 ? 'pointer' : 'default',
          opacity: page > 1 ? 1 : 0.5,
          margin: '0 10px',
          border: 'none',
          background: 'transparent',
          padding: '8px',
          borderRadius: '4px',
          '&:focus': {
            outline: '2px solid',
            outlineColor: 'primary.main',
            outlineOffset: '2px',
          },
          '&:disabled': {
            cursor: 'not-allowed',
          },
        }}
      >
        <ArrowBackIosNewIcon sx={{ height: 12, width: 12 }} />
      </Box>
      {Array.from({ length: count }, (_, index) => (
        <Box
          key={index}
          component="button"
          onClick={() => handleClick(index + 1)}
          aria-label={`Go to page ${index + 1}`}
          aria-current={page === index + 1 ? 'page' : undefined}
          style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            margin: '0 5px',
            backgroundColor: `rgba(${COLORS.primaryOrangeRGB}, ${getTransparency(index + 1)})`,
            border:
              page === index + 1
                ? `2px solid ${theme.palette.primary.main}`
                : 'none',
            cursor: 'pointer',
          }}
          sx={{
            '&:focus': {
              outline: '2px solid',
              outlineColor: 'primary.main',
              outlineOffset: '2px',
            },
          }}
        />
      ))}
      <Box
        component="button"
        onClick={handleNext}
        aria-label="Go to next page"
        disabled={page >= count}
        sx={{
          cursor: page < count ? 'pointer' : 'default',
          opacity: page < count ? 1 : 0.5,
          margin: '0 10px',
          border: 'none',
          background: 'transparent',
          padding: '8px',
          borderRadius: '4px',
          '&:focus': {
            outline: '2px solid',
            outlineColor: 'primary.main',
            outlineOffset: '2px',
          },
          '&:disabled': {
            cursor: 'not-allowed',
          },
        }}
      >
        <ArrowForwardIosIcon sx={{ height: 12, width: 12 }} />
      </Box>
    </Box>
  )
}

export default CustomPaginationCircles
