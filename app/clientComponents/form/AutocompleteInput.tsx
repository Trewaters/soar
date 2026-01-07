'use client'

import React from 'react'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import { SxProps, Theme } from '@mui/material'

interface AutocompleteInputProps {
  params: any
  placeholder?: string
  onClick?: () => void
  sx?: SxProps<Theme>
  inputValue?: string
  onClear?: () => void
}

export default function AutocompleteInput({
  params,
  placeholder = 'Search...',
  onClick,
  sx,
  inputValue,
  onClear,
}: AutocompleteInputProps) {
  return (
    <TextField
      {...params}
      placeholder={placeholder}
      sx={sx}
      InputProps={{
        ...params.InputProps,
        onClick: onClick || params.InputProps?.onClick,
        startAdornment: (
          <>
            <SearchIcon sx={{ color: 'primary.main', mr: 1 }} />
            {params.InputProps?.startAdornment}
          </>
        ),
        endAdornment: (
          <>
            {params.InputProps?.endAdornment}
            {inputValue ? (
              <IconButton
                aria-label="Clear search"
                onClick={() => onClear && onClear()}
                size="small"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            ) : null}
          </>
        ),
      }}
    />
  )
}
