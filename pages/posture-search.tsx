'use client'
import React, { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import Autocomplete from '@mui/material/Autocomplete'
import postureData from '@/app/interfaces/postureData'
import PostureCard from '@/pages/posture-card'

interface PostureSearchProps {
  posturePropData: postureData[]
}

export default function PostureSearch({ posturePropData }: PostureSearchProps) {
  const [postures, setPostures] = useState<postureData[]>(posturePropData)
  const [cardPosture, setcardPosture] = useState<string | null>()

  // Find the selected posture based on the Autocomplete selection
  const selectedPosture = postures?.find((p) => p.display_name === cardPosture)
  const defaultPosture = postures.find((p) => p.display_name === 'Awkward')
  console.log('defaultPosture', defaultPosture?.display_name)
  console.log('selectedPosture', selectedPosture)
  console.log('posturePropData', posturePropData)

  useEffect(() => {
    setPostures(posturePropData)
  }, [posturePropData])

  return (
    <>
      <Stack spacing={2} sx={{ background: 'white' }}>
        <Autocomplete
          id="search-poses"
          options={postures}
          getOptionLabel={(option: postureData) => option.display_name}
          renderOption={(props, option) => (
            <li {...props} key={option.id}>
              {option.display_name}
            </li>
          )}
          renderInput={(params) => (
            <TextField {...params} label="Yoga Postures" />
          )}
          defaultValue={defaultPosture}
          autoSelect={true}
          onChange={(event, value) => setcardPosture(value?.display_name || '')}
        />
        {/* <Autocomplete
          id="search-categories"
          disableClearable
          options={postures?.map((posture: postureData) => posture.category)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Yoga Categories"
              InputProps={{
                ...params.InputProps,
                type: 'search',
              }}
            />
          )}
        /> */}
      </Stack>

      <h2>Posture Card</h2>
      {selectedPosture && <PostureCard postureCardProp={selectedPosture} />}
    </>
  )
}
