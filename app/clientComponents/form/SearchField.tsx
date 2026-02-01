'use client'

import React from 'react'
import {
  TextField,
  InputAdornment,
  IconButton,
  SxProps,
  Theme,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'

interface SearchFieldProps {
  value: string
  onChange: React.ChangeEventHandler<HTMLInputElement>
  placeholder?: string
  onClear?: () => void
  sx?: SxProps<Theme>
  clearButtonTestId?: string
}

export default function SearchField({
  value,
  onChange,
  placeholder = 'Search...',
  onClear,
  sx,
  clearButtonTestId = 'clear-search-button',
}: SearchFieldProps) {
  return (
    <TextField
      fullWidth
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      inputProps={{ 'aria-label': 'Search' }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        endAdornment: value ? (
          <InputAdornment position="end">
            <IconButton
              aria-label="Clear search"
              onClick={onClear}
              size="small"
              data-testid={clearButtonTestId}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
      sx={sx}
    />
  )
}
