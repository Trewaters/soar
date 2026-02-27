'use client'

import React, { useMemo, Fragment } from 'react'
import { SyntheticEvent } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import Stack from '@mui/material/Stack'
import { ListSubheader, Typography } from '@mui/material'
import { useSession } from 'next-auth/react'
import { AutocompleteInput } from '@app/clientComponents/form'
import getAlphaUserIds from '@app/lib/alphaUsers'
import { groupDataAssetsByUser } from '@app/utils/search/groupDataAssetsByUser'
import { orderDataAssetsInGroups } from '@app/utils/search/orderDataAssetsInGroups'
import { DataAssetGroup, GroupedDataAssets } from '@app/types/search'

/**
 * Props for the {@link GroupedDataAssetSearch} component.
 * @template T - The data asset type (e.g., FlowSeriesData, SequenceData, AsanaPose)
 */
export interface GroupedDataAssetSearchProps<T> {
  /**
   * Pre-fetched array of items to search through.
   * The component handles grouping and sorting internally.
   */
  items: T[]

  /**
   * Label for the section of items created by the current user.
   * @example "My Flows"
   */
  myLabel: string

  /**
   * Label for the section of items created by alpha/public users.
   * @example "Public Flows"
   */
  publicLabel: string

  /**
   * Function to extract the text field used for search/filtering.
   * @example (item) => item.seriesName
   */
  searchField: (item: T) => string

  /**
   * Function to extract the text used for display in dropdown options.
   * In most cases this is the same as searchField.
   * @example (item) => item.seriesName
   */
  displayField: (item: T) => string

  /**
   * Placeholder text shown inside the search input.
   * @default "Search..."
   */
  placeholderText?: string

  /**
   * Callback fired when the user selects an item from the dropdown.
   * Section headers are never passed to this callback.
   */
  onSelect: (item: T) => void

  /**
   * Function to extract the creator identifier from an item.
   * Used to determine which group the item belongs to.
   * @example (item) => item.createdBy
   */
  getCreatedBy: (item: T) => string | undefined

  /**
   * If true, shows a loading indicator inside the Autocomplete.
   * @default false
   */
  loading?: boolean

  /**
   * If true, a third "Others" section is rendered for items created by
   * users who are neither the current user nor alpha users.
   * @default false
   */
  includeOthersGroup?: boolean

  /**
   * Optional label for the "Others" group (used only when includeOthersGroup is true).
   * @default "Others"
   */
  othersLabel?: string

  /**
   * Controlled input value for the search field.
   * When provided the component operates in controlled mode.
   */
  inputValue?: string

  /**
   * Callback fired when the search input value changes (controlled mode).
   */
  onInputChange?: (value: string) => void

  /**
   * Callback fired when the Autocomplete opens.
   */
  onOpen?: () => void

  /**
   * Callback fired when the Autocomplete closes.
   */
  onClose?: () => void

  /**
   * Whether the Autocomplete dropdown is open (controlled mode).
   */
  open?: boolean

  /**
   * When true, stretches the search container to full available width
   * instead of the default centered max width behavior.
   * @default false
   */
  fullWidth?: boolean
}

/** Type guard: returns true if the entry is a section header marker. */
function isSection(entry: unknown): entry is DataAssetGroup {
  return (
    typeof entry === 'object' &&
    entry !== null &&
    'section' in (entry as object) &&
    Object.keys(entry as object).length === 1
  )
}

/**
 * A generic, reusable autocomplete search component that groups yoga data assets
 * into labelled sections ("My [Asset]", "Public [Asset]", optional "Others")
 * based on who created them.
 *
 * Handles grouping, sorting, filtering, and rendering internally.
 * The parent is responsible only for providing pre-fetched data and
 * reacting to the `onSelect` callback.
 *
 * @template T - The data asset type. Items must be objects.
 *
 * @example
 * ```tsx
 * // For flows/series
 * <GroupedDataAssetSearch<FlowSeriesData>
 *   items={allFlows}
 *   myLabel="My Flows"
 *   publicLabel="Public Flows"
 *   searchField={(f) => f.seriesName}
 *   displayField={(f) => f.seriesName}
 *   placeholderText="Search for a Flow"
 *   getCreatedBy={(f) => (f as any).createdBy}
 *   onSelect={(flow) => router.push(`/flows/practiceSeries?id=${flow.id}`)}
 * />
 *
 * // For sequences
 * <GroupedDataAssetSearch<SequenceData>
 *   items={allSequences}
 *   myLabel="My Sequences"
 *   publicLabel="Public Sequences"
 *   searchField={(s) => s.nameSequence}
 *   displayField={(s) => s.nameSequence}
 *   placeholderText="Search for a Sequence"
 *   getCreatedBy={(s) => (s as any).createdBy}
 *   onSelect={(seq) => router.push(`/flows/practiceSequences?id=${seq.id}`)}
 * />
 * ```
 */
export default function GroupedDataAssetSearch<T extends object>({
  items,
  myLabel,
  publicLabel,
  searchField,
  displayField,
  placeholderText = 'Search...',
  onSelect,
  getCreatedBy,
  loading = false,
  includeOthersGroup = false,
  othersLabel = 'Others',
  inputValue,
  onInputChange,
  onOpen,
  onClose,
  open,
  fullWidth = false,
}: GroupedDataAssetSearchProps<T>) {
  const { data: session } = useSession()
  const currentUserId = session?.user?.id
  const currentUserEmail = session?.user?.email
  const alphaUserIds = useMemo(() => getAlphaUserIds(), [])

  // 1. Group items by creator, then sort alphabetically within each group
  const groupedOptions = useMemo<GroupedDataAssets<T>>(() => {
    const grouped = groupDataAssetsByUser<T>({
      items,
      getCreatedBy,
      currentUserId,
      currentUserEmail,
      alphaUserIds,
      myLabel,
      publicLabel,
      othersLabel: includeOthersGroup ? othersLabel : undefined,
    })
    return orderDataAssetsInGroups<T>(grouped, displayField)
  }, [
    items,
    getCreatedBy,
    currentUserId,
    currentUserEmail,
    alphaUserIds,
    myLabel,
    publicLabel,
    includeOthersGroup,
    othersLabel,
    displayField,
  ])

  // 2. Pre-compute a map of option-index → section label for renderOption
  const sectionHeaderMap = useMemo<Record<number, string>>(() => {
    const map: Record<number, string> = {}
    let lastSection: string | null = null
    groupedOptions.forEach((opt, idx) => {
      if (isSection(opt)) {
        lastSection = opt.section
      } else if (lastSection) {
        map[idx] = lastSection
        lastSection = null
      }
    })
    return map
  }, [groupedOptions])

  // 3. Filter options: maintain group structure, hide empty sections
  const filterOptions = (
    options: GroupedDataAssets<T>,
    state: { inputValue: string }
  ): GroupedDataAssets<T> => {
    const query = state.inputValue.toLowerCase()

    // Collect items per section that match the query
    const groups: Record<string, T[]> = {}
    let currentSection: string | null = null

    for (const option of options) {
      if (isSection(option)) {
        currentSection = option.section
        if (!groups[currentSection]) groups[currentSection] = []
      } else if (currentSection) {
        const text = searchField(option as T).toLowerCase()
        if (text.includes(query)) {
          groups[currentSection].push(option as T)
        }
      }
    }

    // Flatten back, only including sections with matching items
    const sectionOrder: string[] = [myLabel, publicLabel]
    if (includeOthersGroup) sectionOrder.push(othersLabel ?? 'Others')

    const filtered: GroupedDataAssets<T> = []
    for (const section of sectionOrder) {
      if (groups[section] && groups[section].length > 0) {
        filtered.push({ section } as DataAssetGroup)
        groups[section].forEach((item) => filtered.push(item))
      }
    }
    return filtered
  }

  // 4. Render each option (or a section header before the first item in that group)
  const renderOption = (
    props: React.HTMLAttributes<HTMLLIElement>,
    option: T | DataAssetGroup,
    state: { index: number }
  ) => {
    // Never render section markers as list items
    if (isSection(option)) return null

    const sectionLabel = sectionHeaderMap[state.index] ?? null
    const item = option as T

    // Extract key from props to avoid React key duplication warning
    const { key, ...otherProps } =
      props as React.HTMLAttributes<HTMLLIElement> & {
        key?: React.Key
      }

    // Use a stable key for the fragment: try id field, fall back to display text + index
    const itemKey =
      (item as Record<string, unknown>)['id'] !== undefined
        ? String((item as Record<string, unknown>)['id'])
        : `${displayField(item)}-${state.index}`

    return (
      <Fragment key={itemKey}>
        {sectionLabel && (
          <ListSubheader
            component="div"
            disableSticky
            role="presentation"
            sx={{ fontWeight: 'bold', color: 'primary.main' }}
          >
            {sectionLabel}
          </ListSubheader>
        )}
        <li key={key} {...otherProps}>
          <Typography variant="body2">{displayField(item)}</Typography>
        </li>
      </Fragment>
    )
  }

  // 5. Handle user selection
  const handleChange = (
    _event: SyntheticEvent,
    value: (T | DataAssetGroup) | null
  ) => {
    if (!value) return
    // Ignore section header selections
    if (isSection(value)) return
    onSelect(value as T)
  }

  return (
    <Stack
      spacing={2}
      sx={{
        background: 'white',
        width: fullWidth ? '100%' : { xs: '100%', md: '40vw' },
        mx: fullWidth ? 0 : 'auto',
        borderRadius: '12px',
      }}
    >
      <Autocomplete<T | DataAssetGroup>
        disablePortal
        options={groupedOptions}
        loading={loading}
        loadingText={`Loading...`}
        noOptionsText="No results found"
        open={open}
        onOpen={onOpen}
        onClose={onClose}
        inputValue={inputValue}
        onInputChange={
          onInputChange ? (_e, newVal) => onInputChange(newVal) : undefined
        }
        getOptionLabel={(option) => {
          if (isSection(option)) return ''
          return displayField(option as T)
        }}
        filterOptions={filterOptions as any}
        renderOption={renderOption as any}
        isOptionEqualToValue={(option, value) => {
          if (isSection(option) || isSection(value)) return false
          const a = option as Record<string, unknown>
          const b = value as Record<string, unknown>
          if (a['id'] !== undefined && b['id'] !== undefined) {
            return String(a['id']) === String(b['id'])
          }
          return displayField(option as T) === displayField(value as T)
        }}
        onChange={handleChange as any}
        sx={{
          '& .MuiAutocomplete-endAdornment': {
            display: 'none',
          },
        }}
        renderInput={(params) => (
          <AutocompleteInput
            params={params}
            placeholder={placeholderText}
            inputValue={inputValue}
            onClear={onInputChange ? () => onInputChange('') : undefined}
          />
        )}
      />
    </Stack>
  )
}
