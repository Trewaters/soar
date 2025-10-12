'use client'
import { Typography } from '@mui/material'
import React, { useState, useEffect, SyntheticEvent, useMemo } from 'react'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import Autocomplete from '@mui/material/Autocomplete'
import { useAsanaPose } from '@context/AsanaPoseContext'
import { useRouter } from 'next/navigation'
import SearchIcon from '@mui/icons-material/Search'
import getAsanaTitle from '@app/utils/search/getAsanaTitle'

import { FEATURES } from '@app/FEATURES'
import getAlphaUserIds from '@app/lib/alphaUsers'
import { useSession } from 'next-auth/react'
import { AsanaPose } from 'types/asana'

interface PoseSearchProps {
  posePropData: AsanaPose[]
}

/**
 * A search component for asana poses that provides autocomplete functionality.
 *
 * @component
 * @param props - The component props
 * @param props.posePropData - Array of full asana data objects to search through
 *
 * @returns A search interface with autocomplete dropdown for selecting asana poses
 *
 * @example
 * ```tsx
 * <PoseSearch posePropData={asanaPoses} />
 * ```
 *
 * @remarks
 * - Updates the global asana pose state when a selection is made
 * - Navigates to the selected pose's detail page
 * - Filters poses by English name using case-insensitive matching
 * - Displays a search icon and custom styling for the input field
 * - Automatically selects the first matching option when typing
 */
export default function PoseSearch({ posePropData }: PoseSearchProps) {
  const { state, dispatch } = useAsanaPose()
  const [poses, setPoses] = useState<AsanaPose[]>(posePropData)
  const router = useRouter()

  const defaultPose = poses?.find((p) => p.sort_english_name === '')

  useEffect(() => {
    setPoses(posePropData)
  }, [posePropData])

  function handleChange(
    event: SyntheticEvent<Element, Event>,
    value: AsanaPose | { section: 'Mine' | 'Alpha' | 'Others' } | null,
    reason: any,
    details?: any
  ) {
    // Ignore section header selections
    if (value && 'section' in value) return
    dispatch({ type: 'SET_POSES', payload: value ?? state.poses })
    router.push(`/navigator/asanaPoses/${(value as AsanaPose)?.id || ''}/`)
  }
  // Get current user id from session
  const { data: session } = useSession()
  const currentUserId = session?.user?.id
  const currentUserEmail = session?.user?.email

  // Use centralized utility for ordering poses in dropdown
  const alphaUserIds: string[] = getAlphaUserIds()
  const enrichedPoses = useMemo(() => {
    return poses.map((p) => ({
      ...p,
      createdBy: (p as any).created_by ?? undefined,
      canonicalAsanaId: (p as any).canonicalAsanaId ?? (p as any).id,
    }))
  }, [poses])
  const orderedOptions = useMemo(() => {
    if (!FEATURES.PRIORITIZE_USER_ENTRIES_IN_SEARCH) return enrichedPoses
    // Partition and sort
    const userCreated: typeof enrichedPoses = []
    const alphaCreated: typeof enrichedPoses = []
    const others: typeof enrichedPoses = []
    const seenIds = new Set<string>()
    for (const pose of enrichedPoses) {
      const key = pose.canonicalAsanaId || pose.id
      if (seenIds.has(key)) continue
      seenIds.add(key)
      if (
        pose.createdBy === currentUserId ||
        pose.createdBy === currentUserEmail
      ) {
        userCreated.push(pose)
      } else if (pose.createdBy && alphaUserIds.includes(pose.createdBy)) {
        alphaCreated.push(pose)
      } else {
        others.push(pose)
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
    const result: Array<AsanaPose | { section: 'Mine' | 'Alpha' | 'Others' }> =
      []
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
  }, [enrichedPoses, currentUserId, currentUserEmail, alphaUserIds])

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
            placeholder="Search for a Yoga Pose"
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
          renderOptionFn.displayName = 'PoseAutocompleteRenderOption'
          return renderOptionFn
        })()}
        defaultValue={defaultPose}
        autoSelect={true}
        onChange={handleChange}
      />
    </Stack>
  )
}
