'use client'
import { Typography } from '@mui/material'
import React, { useState, useEffect, SyntheticEvent, useMemo } from 'react'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import Autocomplete from '@mui/material/Autocomplete'
import { FullAsanaData, useAsanaPosture } from '@context/AsanaPostureContext'
import { useRouter } from 'next/navigation'
import SearchIcon from '@mui/icons-material/Search'
import getAsanaTitle from '@app/utils/search/getAsanaTitle'

import { FEATURES } from '@app/FEATURES'
import getAlphaUserIds from '@app/lib/alphaUsers'
import { useSession } from 'next-auth/react'

interface PostureSearchProps {
  posturePropData: FullAsanaData[]
}

/**
 * A search component for asana postures that provides autocomplete functionality.
 *
 * @component
 * @param props - The component props
 * @param props.posturePropData - Array of full asana data objects to search through
 *
 * @returns A search interface with autocomplete dropdown for selecting asana postures
 *
 * @example
 * ```tsx
 * <PostureSearch posturePropData={asanaPostures} />
 * ```
 *
 * @remarks
 * - Updates the global asana posture state when a selection is made
 * - Navigates to the selected posture's detail page
 * - Filters postures by English name using case-insensitive matching
 * - Displays a search icon and custom styling for the input field
 * - Automatically selects the first matching option when typing
 */
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
    value: FullAsanaData | { section: 'Mine' | 'Alpha' | 'Others' } | null,
    reason: any,
    details?: any
  ) {
    // Ignore section header selections
    if (value && 'section' in value) return
    dispatch({ type: 'SET_POSTURES', payload: value ?? state.postures })
    router.push(
      `/navigator/asanaPostures/${(value as FullAsanaData)?.id || ''}/`
    )
  }
  // Get current user id from session
  const { data: session } = useSession()
  const currentUserId = session?.user?.id
  const currentUserEmail = session?.user?.email

  // Use centralized utility for ordering postures in dropdown
  const alphaUserIds: string[] = getAlphaUserIds()
  const enrichedPostures = useMemo(() => {
    return postures.map((p) => ({
      ...p,
      createdBy: (p as any).created_by ?? undefined,
      canonicalAsanaId: (p as any).canonicalAsanaId ?? (p as any).id,
    }))
  }, [postures])
  const orderedOptions = useMemo(() => {
    if (!FEATURES.PRIORITIZE_USER_ENTRIES_IN_SEARCH) return enrichedPostures
    // Partition and sort
    const userCreated: typeof enrichedPostures = []
    const alphaCreated: typeof enrichedPostures = []
    const others: typeof enrichedPostures = []
    const seenIds = new Set<string>()
    for (const posture of enrichedPostures) {
      const key = posture.canonicalAsanaId || posture.id
      if (seenIds.has(key)) continue
      seenIds.add(key)
      if (
        posture.createdBy === currentUserId ||
        posture.createdBy === currentUserEmail
      ) {
        userCreated.push(posture)
      } else if (
        posture.createdBy &&
        alphaUserIds.includes(posture.createdBy)
      ) {
        alphaCreated.push(posture)
      } else {
        others.push(posture)
      }
    }
    const sortByTitle = (a: any, b: any) =>
      (
        getAsanaTitle({
          displayName: a.displayName,
          englishName: a.sort_english_name,
          title: a.label,
        }) || a.sort_english_name
      ).localeCompare(
        getAsanaTitle({
          displayName: b.displayName,
          englishName: b.sort_english_name,
          title: b.label,
        }) || b.sort_english_name,
        undefined,
        { sensitivity: 'base' }
      )
    userCreated.sort(sortByTitle)
    alphaCreated.sort(sortByTitle)
    others.sort(sortByTitle)
    // Insert section headers
    const result: Array<
      FullAsanaData | { section: 'Mine' | 'Alpha' | 'Others' }
    > = []
    if (userCreated.length > 0) {
      result.push({ section: 'Mine' })
      userCreated.forEach((item) => result.push(item))
    }
    if (alphaCreated.length > 0) {
      result.push({ section: 'Alpha' })
      alphaCreated.forEach((item) => result.push(item))
    }
    if (others.length > 0) {
      result.push({ section: 'Others' })
      others.forEach((item) => result.push(item))
    }
    return result
  }, [enrichedPostures, currentUserId, currentUserEmail, alphaUserIds])

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
        options={orderedOptions}
        sx={{
          '& .MuiOutlinedInput-notchedOutline': {
            borderRadius: '12px',
            borderColor: 'primary.main',
            boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
          },
          '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.light',
          },
          '& .MuiAutocomplete-endAdornment': {
            display: 'none',
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
        filterOptions={(options, state) => {
          // Partition options into groups by section
          const groups: Record<string, any[]> = {}
          let currentSection: 'Mine' | 'Alpha' | 'Others' | null = null
          for (const option of options) {
            if ('section' in option) {
              currentSection = option.section
              if (!groups[currentSection]) groups[currentSection] = []
            } else if (currentSection) {
              if (!groups[currentSection]) groups[currentSection] = []
              if (
                option.sort_english_name &&
                option.sort_english_name
                  .toLowerCase()
                  .includes(state.inputValue.toLowerCase())
              ) {
                groups[currentSection].push(option)
              }
            }
          }
          // Flatten back to options array, inserting section header if group has any items
          const filtered: typeof options = []
          const sectionOrder: Array<'Mine' | 'Alpha' | 'Others'> = [
            'Mine',
            'Alpha',
            'Others',
          ]
          for (const section of sectionOrder) {
            if (groups[section] && groups[section].length > 0) {
              filtered.push({ section })
              filtered.push(...groups[section])
            }
          }
          return filtered
        }}
        id="search-poses"
        getOptionLabel={(option) => {
          if ('section' in option) return ''
          return option.sort_english_name
        }}
        renderOption={(() => {
          let lastSection: string | null = null
          const sectionHeaderMap: Record<number, string> = {}
          // Build a map of option indices to section labels
          orderedOptions.forEach((opt, idx) => {
            if ('section' in opt) {
              lastSection = opt.section
            } else if (lastSection) {
              sectionHeaderMap[idx] = lastSection
              lastSection = null
            }
          })
          const renderOptionFn = (
            props: React.HTMLAttributes<HTMLLIElement>,
            option: any,
            { index }: { index: number }
          ) => {
            if ('section' in option) return null
            const sectionLabel = sectionHeaderMap[index] || null
            return (
              <>
                {sectionLabel && (
                  <Typography
                    key={sectionLabel + '-header'}
                    component="div"
                    sx={{
                      fontWeight: 'bold',
                      color: 'primary.main',
                      pl: 2,
                      pt: 1,
                    }}
                  >
                    {sectionLabel}
                  </Typography>
                )}
                <li {...props} key={option.id}>
                  {option.sort_english_name}
                </li>
              </>
            )
          }
          renderOptionFn.displayName = 'PostureAutocompleteRenderOption'
          return renderOptionFn
        })()}
        defaultValue={defaultPosture}
        autoSelect={true}
        onChange={handleChange}
      />
    </Stack>
  )
}
