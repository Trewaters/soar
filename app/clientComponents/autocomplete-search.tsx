import React, { useState } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import { AutocompleteInput } from '@app/clientComponents/form'
import { AsanaPose } from 'types/asana'

export interface AnotherOptionType {
  id: string
  name: string
}

export type AutocompleteOption = AsanaPose | AnotherOptionType

export interface CustomAutocompleteProps
  extends React.ComponentProps<typeof Autocomplete> {
  placeholder?: string
  /**
   * If provided, the options will be grouped under the returned string.
   * The groupBy value is also used as the text for group headers when `renderGroup` is not provided.
   *
   * @param option The option to group.
   * @returns The group name.
   */
  groupBy?: (option: any) => string
}

export default function AutocompleteComponent(props: CustomAutocompleteProps) {
  const [inputValue, setInputValue] = useState('')
  return (
    <>
      <Autocomplete
        id="combo-box-search"
        options={props.options}
        getOptionLabel={(option) => {
          const typedOption = option as AutocompleteOption
          if ('sort_english_name' in typedOption) {
            return typedOption.sort_english_name
          }
          if ('name' in typedOption) {
            return typedOption.name
          }
          return ''
        }}
        renderOption={(props, option) => {
          const typedOption = option as AutocompleteOption
          if ('sort_english_name' in typedOption) {
            const poseOption = typedOption
            return (
              <li {...props} key={poseOption.id}>
                {poseOption.sort_english_name}
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
            if ('sort_english_name' in typedOption) {
              return typedOption.sort_english_name
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
          '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.light', // Ensure border color does not change on hover
          },
          '& .MuiAutocomplete-endAdornment': {
            display: 'none',
          },
        }}
        disablePortal
        inputValue={inputValue}
        onInputChange={(_event, newInputValue) => setInputValue(newInputValue)}
        renderInput={(params) => (
          <AutocompleteInput
            params={params}
            placeholder={props.placeholder || 'Search...'}
            sx={{ '& .MuiInputBase-input': { color: 'primary.main' } }}
            inputValue={inputValue}
            onClear={() => setInputValue('')}
          />
        )}
        onChange={props.onChange}
      />
    </>
  )
}
