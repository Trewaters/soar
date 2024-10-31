import React from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import SearchIcon from '@mui/icons-material/Search'
import { PostureData } from '@app/context/AsanaPostureContext'

interface AnotherOptionType {
  id: string
  name: string
}

type AutocompleteOption = PostureData | AnotherOptionType

interface CustomAutocompleteProps
  extends React.ComponentProps<typeof Autocomplete> {
  placeholder?: string
}

export default function AutocompleteComponent(props: CustomAutocompleteProps) {
  return (
    <>
      <Autocomplete
        id="combo-box-search"
        options={props.options}
        getOptionLabel={(option) => {
          const typedOption = option as AutocompleteOption
          if ('english_name' in typedOption) {
            return typedOption.english_name
          }
          if ('name' in typedOption) {
            return typedOption.name
          }
          return ''
        }}
        renderOption={(props, option) => {
          const typedOption = option as AutocompleteOption
          if ('english_name' in typedOption) {
            const postureOption = typedOption
            return (
              <li {...props} key={postureOption.id}>
                {postureOption.english_name}
              </li>
            )
          }
          if ('name' in typedOption) {
            const anotherOption = typedOption
            return (
              <li {...props} key={anotherOption.id}>
                {anotherOption.name}
              </li>
            )
          }
          return null
        }}
        filterOptions={(options, state) =>
          options.filter((option) => {
            const typedOption = option as AutocompleteOption
            if ('english_name' in typedOption) {
              return typedOption.english_name
                .toLowerCase()
                .includes(state.inputValue.toLowerCase())
            }
            if ('name' in typedOption) {
              return typedOption.name
                .toLowerCase()
                .includes(state.inputValue.toLowerCase())
            }
            return false
          })
        }
        sx={{
          '& .MuiOutlinedInput-notchedOutline': {
            borderRadius: '12px',
            borderColor: 'primary.main',
            boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
          },
        }}
        disablePortal
        renderInput={(params) => (
          <TextField
            {...params}
            sx={{
              '& .MuiInputBase-input': { color: 'primary.main' },
            }}
            placeholder={props.placeholder || 'Search...'}
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
        onChange={props.onChange}
      />
    </>
  )
}
