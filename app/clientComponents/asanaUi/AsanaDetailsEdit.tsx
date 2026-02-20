/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */

import {
  Box,
  Stack,
  Typography,
  TextField,
  Autocomplete,
  ButtonGroup,
  Button,
  FormControl,
  FormHelperText,
} from '@mui/material'
import React, { ComponentProps } from 'react'
import Image from 'next/image'
import SearchIcon from '@mui/icons-material/Search'
import {
  AsanaEditFieldProps,
  VariationsAsanaFieldProps,
  fieldSxStyles,
} from './asanaFieldConstants'

// Main component props
export interface AsanaDetailsEditProps {
  fields: AsanaEditFieldProps[]
  globalOnChange?: (key: string, value: any) => void
}

// Extend Stack props for styling flexibility
export type AsanaDetailsEditComponentProps = ComponentProps<typeof Stack> &
  AsanaDetailsEditProps

/**
 * A standardized edit component for Asana form fields with consistent styling and headers.
 *
 * @remarks
 * This component provides a uniform way to display edit fields with proper headers,
 * icons, and consistent Soar application styling. It supports various input types
 * including text fields, autocomplete, button groups, and custom components.
 *
 * @param props - The properties for the AsanaDetailsEdit component
 * @param props.fields - Array of field configurations with their respective props
 *
 * @returns A styled form component with consistent headers and field layouts
 *
 * @example
 * ```tsx
 * <AsanaDetailsEdit
 *   fields={[
 *     {
 *       type: 'text',
 *       label: 'Asana Name',
 *       value: formData.name,
 *       onChange: (value) => setFormData({...formData, name: value}),
 *       required: true
 *     },
 *     {
 *       type: 'autocomplete',
 *       label: 'Category',
 *       value: formData.category,
 *       options: categories,
 *       onChange: (value) => setFormData({...formData, category: value})
 *     }
 *   ]}
 * />
 * ```
 */
export default React.memo(function AsanaDetailsEdit(
  props: AsanaDetailsEditComponentProps
) {
  const { fields, globalOnChange, ...stackProps } = props

  // Local helper component to manage the variations input display string
  // while still syncing the final array to the parent via field.onChange.
  function VariationInput({
    field,
    fieldId,
  }: {
    field: VariationsAsanaFieldProps
    fieldId: string
  }) {
    const [display, setDisplay] = React.useState<string>(
      Array.isArray(field.value) ? field.value.join(', ') : ''
    )
    const isEditingRef = React.useRef(false)

    // Keep display in sync when not actively editing (e.g., parent reset)
    React.useEffect(() => {
      if (!isEditingRef.current) {
        const newDisplay = Array.isArray(field.value)
          ? field.value.join(', ')
          : ''
        if (newDisplay !== display) {
          setDisplay(newDisplay)
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [field.value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value
      isEditingRef.current = true
      setDisplay(v)
      // Do not sync to parent on every comma — preserve user's raw input including commas
    }

    const finalize = (value: string) => {
      const cleanedVariations = value
        .split(',')
        .map((name) => name.trim())
        .filter((name) => name.length > 0)
      if (field.onChange) {
        field.onChange(cleanedVariations)
      } else if ((props as any).globalOnChange && field.fieldKey) {
        ;(props as any).globalOnChange(field.fieldKey, cleanedVariations)
      }
      setDisplay(cleanedVariations.join(', '))
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      isEditingRef.current = false
      finalize(e.target.value)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        finalize((e.target as HTMLInputElement).value)
        // move focus away to trigger any parent listeners if needed
        ;(e.target as HTMLInputElement).blur()
      }
    }

    return (
      <TextField
        id={fieldId}
        value={display}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={field.placeholder}
        required={field.required}
        disabled={field.disabled}
        fullWidth
        sx={fieldSxStyles}
        helperText={field.helperText}
        aria-describedby={field.helperText ? `${fieldId}-helper` : undefined}
      />
    )
  }

  const renderField = (field: AsanaEditFieldProps, index: number) => {
    const fieldId = `asana-edit-field-${index}`

    return (
      <Box
        key={`${field.label}-${index}`}
        sx={{
          width: '100%',
          mb: 2,
        }}
        role="group"
        aria-labelledby={`${fieldId}-header`}
      >
        {/* Field Header with Icon and Label */}
        <Stack
          direction="row"
          gap={2}
          display="flex"
          alignItems="center"
          sx={{ mb: 1 }}
          id={`${fieldId}-header`}
        >
          <Typography
            variant="subtitle1"
            component="h3"
            sx={{
              fontWeight: 'bold',
              color: 'primary.main',
              fontSize: '1rem',
            }}
          >
            {field.label}
            {field.required && (
              <Typography
                component="span"
                sx={{ color: 'error.main', ml: 0.5 }}
                aria-label="required"
              >
                *
              </Typography>
            )}
          </Typography>
        </Stack>

        {/* Field Input Section */}
        <Box>{renderFieldInput(field, fieldId)}</Box>
      </Box>
    )
  }

  const renderFieldInput = (field: AsanaEditFieldProps, fieldId: string) => {
    const callChange = (val: any) => {
      // Prefer explicit field.onChange; fall back to globalOnChange if provided
      if ((field as any).onChange) {
        ;(field as any).onChange(val)
      } else if (globalOnChange && (field as any).fieldKey) {
        globalOnChange((field as any).fieldKey, val)
      }
    }

    switch (field.type) {
      case 'text':
        return (
          <TextField
            id={fieldId}
            // label={field.label}
            value={field.value}
            onChange={(e) => callChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            disabled={field.disabled}
            fullWidth
            sx={fieldSxStyles}
            helperText={field.helperText}
            aria-describedby={
              field.helperText ? `${fieldId}-helper` : undefined
            }
          />
        )

      case 'multiline':
        return (
          <TextField
            id={fieldId}
            // label={field.label}
            value={field.value}
            onChange={(e) => callChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            disabled={field.disabled}
            multiline
            rows={field.rows || 4}
            fullWidth
            sx={fieldSxStyles}
            helperText={field.helperText}
            aria-describedby={
              field.helperText ? `${fieldId}-helper` : undefined
            }
          />
        )

      case 'autocomplete':
        return (
          <Autocomplete
            id={fieldId}
            freeSolo={field.freeSolo ?? false}
            options={field.options}
            value={field.value}
            onChange={(event, value) => callChange(value || '')}
            onInputChange={(event, newInputValue) => callChange(newInputValue)}
            disabled={field.disabled}
            sx={{
              ...fieldSxStyles,
              '& .MuiAutocomplete-endAdornment': {
                display: 'none',
              },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                // label={field.label}
                placeholder={field.placeholder}
                required={field.required}
                helperText={field.helperText}
                sx={{ '& .MuiInputBase-input': { color: 'primary.main' } }}
                slotProps={{
                  input: {
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <SearchIcon sx={{ color: 'primary.main', mr: 1 }} />
                        {params.InputProps.startAdornment}
                      </>
                    ),
                  },
                }}
                aria-describedby={
                  field.helperText ? `${fieldId}-helper` : undefined
                }
              />
            )}
          />
        )

      case 'buttonGroup':
        return (
          <FormControl fullWidth disabled={field.disabled}>
            <ButtonGroup
              variant="outlined"
              sx={{
                width: '100%',
                mt: 1,
              }}
              aria-label={field.label}
            >
              {field.options.map((option) => (
                <Button
                  key={option}
                  onClick={() => callChange(option)}
                  variant={field.value === option ? 'contained' : 'outlined'}
                  disabled={field.disabled}
                  sx={{
                    flex: 1,
                    borderRadius: '12px',
                    '&:not(:last-child)': {
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                    },
                    '&:not(:first-of-type)': {
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                    },
                  }}
                >
                  {option}
                </Button>
              ))}
            </ButtonGroup>
            {field.helperText && (
              <FormHelperText id={`${fieldId}-helper`} sx={{ mt: 1, ml: 0 }}>
                {field.helperText}
              </FormHelperText>
            )}
          </FormControl>
        )

      case 'variations': {
        return (
          <VariationInput
            field={field as VariationsAsanaFieldProps}
            fieldId={fieldId}
          />
        )
      }

      case 'custom':
        return (
          <Box
            id={fieldId}
            aria-describedby={
              field.helperText ? `${fieldId}-helper` : undefined
            }
          >
            {field.children}
            {field.helperText && (
              <FormHelperText id={`${fieldId}-helper`} sx={{ mt: 1, ml: 0 }}>
                {field.helperText}
              </FormHelperText>
            )}
          </Box>
        )

      default:
        return null
    }
  }

  return (
    <Stack
      spacing={3}
      sx={{
        width: {
          xs: '100%',
          md: '50vw',
        },
        px: { xs: '16px', sm: '16px' },
        ...stackProps.sx,
      }}
      {...stackProps}
      role="form"
      aria-label="Asana details edit form"
    >
      {fields.map((field, index) => renderField(field, index))}
    </Stack>
  )
})
