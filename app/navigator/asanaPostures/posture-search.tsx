'use client'
import React, { useState, useEffect, SyntheticEvent } from 'react'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import Autocomplete from '@mui/material/Autocomplete'
import { PostureData, useAsanaPosture } from '@context/AsanaPostureContext'
import PostureCard from '@app/navigator/asanaPostures/posture-card'
import { Button } from '@mui/material'
import { useRouter } from 'next/navigation'
import { FEATURES } from '@app/FEATURES'

interface PostureSearchProps {
  posturePropData: PostureData[]
}

export default function PostureSearch({ posturePropData }: PostureSearchProps) {
  const { state, dispatch } = useAsanaPosture()
  const [postures, setPostures] = useState<PostureData[]>(posturePropData)
  const [cardPosture, setcardPosture] = useState<string | null>()
  const [selectedPosture, setSelectedPosture] = useState<
    PostureData | undefined
  >(state.postures)
  // const [value, setValue] = useState('Awkward')
  // const [inputValue, setInputValue] = useState('')
  // const [open, setOpen] = useState(false)

  // Find the selected posture based on the Autocomplete selection
  // const selectedPosture = postures?.find((p) => p.english_name === cardPosture)
  // setSelectedPosture(postures?.find((p) => p.english_name === cardPosture))
  const defaultPosture = postures?.find((p) => p.english_name === '')
  const router = useRouter()

  useEffect(() => {
    setPostures(posturePropData)
  }, [posturePropData])

  function handleClick() {
    // send pose name to api/poses/?english_name=${pose_name}
    // show asana practice view
    router.push(`../views/viewAsanaPractice/${selectedPosture?.english_name}/`)
  }

  function handleChange(
    event: SyntheticEvent<Element, Event>,
    value: PostureData | null
  ) {
    dispatch({ type: 'SET_POSTURES', payload: value ?? state.postures })

    setcardPosture(value?.english_name || '')
  }

  return (
    <>
      <Stack spacing={2} sx={{ marginX: 3, background: 'white', mb: '1em' }}>
        <Autocomplete
          id="search-poses"
          options={postures}
          getOptionLabel={(option: PostureData) => option.english_name}
          renderOption={(props, option) => (
            <li {...props} key={option.id}>
              {option.english_name}
            </li>
          )}
          renderInput={(params) => (
            <TextField {...params} label="Yoga Postures" />
          )}
          defaultValue={defaultPosture}
          autoSelect={true}
          onChange={handleChange}
        />
        {/* 
        // unsuccessful attempt to clear input so entire list shows

        <Autocomplete
          id="search-poses"
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          options={postures}
          getOptionLabel={(option: PostureData) => option.english_name}
          renderOption={(props, option) => (
            <li {...props} key={option.id}>
              {option.english_name}
            </li>
          )}
          renderInput={(params) => (
            <TextField {...params} label="Yoga Postures" />
          )}
          defaultValue={defaultPosture}
          // value={value}
          autoSelect={true}
          onChange={(event, newValue) => {
            setValue(newValue?.english_name || '')
            setcardPosture(newValue?.english_name || '')
          }}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue)
          }}
        /> */}
        {/* <Autocomplete
          id="search-categories"
          disableClearable
          options={postures?.map((posture: PostureData) => posture.category)}
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

      {selectedPosture && FEATURES.SHOW_PRACTICE_VIEW_ASANA && (
        <Button onClick={handleClick}>Practice View</Button>
      )}

      {/* {selectedPosture && <PostureCard postureCardProp={selectedPosture} />} */}
    </>
  )
}
