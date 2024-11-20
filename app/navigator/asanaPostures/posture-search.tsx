'use client'
import React, { useState, useEffect, SyntheticEvent } from 'react'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import Autocomplete from '@mui/material/Autocomplete'
import { FullAsanaData, useAsanaPosture } from '@context/AsanaPostureContext'
import { useRouter } from 'next/navigation'
import SearchIcon from '@mui/icons-material/Search'

interface PostureSearchProps {
  posturePropData: FullAsanaData[]
}

export default function PostureSearch({ posturePropData }: PostureSearchProps) {
  const { state, dispatch } = useAsanaPosture()
  const [postures, setPostures] = useState<FullAsanaData[]>(posturePropData)
  const router = useRouter()

  const defaultPosture = postures?.find((p) => p.sort_english_name === '')

  useEffect(() => {
    setPostures(posturePropData)
  }, [posturePropData])

  function handleChange(
    event: SyntheticEvent<Element, Event>,
    value: FullAsanaData | null
  ) {
    dispatch({ type: 'SET_POSTURES', payload: value ?? state.postures })
    console.log('posture-search > handleChange value', value)
    router.push(`../navigator/asanaPostures/${value?.sort_english_name}/`)
  }

  return (
    <Stack
      spacing={2}
      sx={{
        marginX: 3,
        background: 'white',
        mb: '1em',
        width: { xs: '90vw', md: '40vw' },
        borderRadius: '12px',
      }}
    >
      <Autocomplete
        disablePortal
        options={postures}
        sx={{
          '& .MuiOutlinedInput-notchedOutline': {
            borderRadius: '12px',
            borderColor: 'primary.main',
            boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
          },
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            sx={{ '& .MuiInputBase-input': { color: 'primary.main' } }}
            placeholder="Search for a Yoga Posture"
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <>
                  <SearchIcon sx={{ color: 'primary.main', mr: 1 }} />
                  {params.InputProps.startAdornment}
                </>
              ),
            }}
          />
        )}
        filterOptions={(options, state) =>
          options.filter((option) =>
            option.sort_english_name
              .toLowerCase()
              .includes(state.inputValue.toLowerCase())
          )
        }
        id="search-poses"
        getOptionLabel={(option: FullAsanaData) => option.sort_english_name}
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            {option.sort_english_name}
          </li>
        )}
        defaultValue={defaultPosture}
        autoSelect={true}
        onChange={handleChange}
      />
    </Stack>
  )
}
