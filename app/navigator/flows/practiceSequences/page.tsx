'use client'

import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import ListSubheader from '@mui/material/ListSubheader'
import Autocomplete from '@mui/material/Autocomplete'
import EditIcon from '@mui/icons-material/Edit'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import ViewStreamIcon from '@mui/icons-material/ViewStream'
import { useRouter, useSearchParams } from 'next/navigation'

import { SequenceData } from '@lib/sequenceService'
import SplashHeader from '../../../clientComponents/splash-header'
const SubNavHeader = (props: any) => <div />
const AutocompleteInput = (props: any) => <div />

// Stubs for missing MUI and custom components/helpers
const Card = (props: any) => <div>{props.children}</div>
const CardHeader = (props: any) => <div>{props.title}</div>
const CardContent = (props: any) => <div>{props.children}</div>
const Button = (props: any) => <button {...props}>{props.children}</button>
const ChevronLeftIcon = () => <span>{'<'}</span>
const ChevronRightIcon = () => <span>{'>'}</span>
const Link = (props: any) => <a href={props.href}>{props.children}</a>
const CustomPaginationCircles = ({
  count,
  page,
  onChange,
}: {
  count: number
  page: number
  onChange: (event: React.ChangeEvent<unknown>, value: number) => void
}) => <div />
const SequenceActivityTracker = (props: {
  sequenceId: string
  sequenceName: string
  onActivityToggle: () => void
}) => <div />
const Image = (props: any) => <img alt={props.alt} src={props.src} {...props} />
const handleSeriesNavigation = (...args: any[]) => {}
const getPoseNavigationUrlSync = (...args: any[]) => '#'
const handleChange = () => {}
const Drawer = (props: any) => <div>{props.children}</div>

export default function PracticeSequencesPage() {
  const router = useRouter()
  // Removed unused: const alphaUserIds: string[] = []
  const [orderedSequenceOptions, setOrderedSequenceOptions] = useState<any[]>(
    []
  )
  const [paginatedData, setPaginatedData] = useState<any[]>([])
  // Data fetching logic
  const searchParams = useSearchParams()
  const sequenceIdParam = searchParams.get('id')
  // Removed unused: const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    async function fetchData() {
      // setLoading(true) // removed unused
      // Dynamically import to avoid SSR issues
      const { getAllSequences } = await import('@lib/sequenceService')
      const sequences = await getAllSequences()
      if (!isMounted) return
      setOrderedSequenceOptions(sequences)
      let selected = sequences[0]
      if (sequenceIdParam) {
        const found = sequences.find(
          (s: any) => String(s.id) === String(sequenceIdParam)
        )
        if (found) selected = found
      }
      setSingleSequence(selected)
      setPaginatedData(selected?.sequencesSeries || [])
      // setLoading(false) // removed unused
    }
    fetchData()
    return () => {
      isMounted = false
    }
  }, [sequenceIdParam])

  function handleSelect(event: any, value: SequenceData | null) {
    if (value) {
      setSingleSequence(value)
      setPaginatedData(value.sequencesSeries || [])
    }
  }
  function handleActivityToggle() {
    // Implement activity toggle logic here
  }
  // Removed unused: const { data: session } = useSession()
  // Removed unused: const [sequences, setSequences] = useState<SequenceData[]>([])
  const [singleSequence, setSingleSequence] = useState<SequenceData>({
    id: 0,
    nameSequence: '',
    sequencesSeries: [],
    description: '',
    durationSequence: '',
    image: '',
    createdAt: '',
    updatedAt: '',
  })
  // Removed unused: const [isLoadingFreshSeriesData, setIsLoadingFreshSeriesData] = useState(false)
  // Removed unused: const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [searchInputValue, setSearchInputValue] = useState('')
  const [page, setPage] = useState(1)
  const itemsPerPage = 1

  // TODO: Get sequenceId from router/query params if needed
  // Removed unused: const sequenceId = undefined

  // Removed unused: fetchSequences useCallback

  const [open, setOpen] = useState(false)
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          maxWidth: '100vw',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        <SplashHeader
          src={'/icons/designImages/header-practice-sequence.png'}
          alt={'Practice Sequences'}
          title="Practice Sequences"
        />
        <Stack
          spacing={2}
          sx={{
            mb: '1em',
            width: '100%',
            maxWidth: '600px',
            alignItems: 'center',
            alignSelf: 'center',
          }}
        >
          <SubNavHeader
            title="Flows"
            link="/navigator/flows"
            onClick={() => setOpen(!open)}
            sx={{
              width: '100%',
              maxWidth: '600px',
              alignSelf: 'center',
              mb: 2,
            }}
          />
          <Stack
            sx={{
              px: 4,
              width: '100%',
              maxWidth: '600px',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                alignItems: 'flex-start',
                width: '100%',
                maxWidth: '600px',
              }}
            >
              <Autocomplete
                key={`autocomplete-${orderedSequenceOptions.length}-${orderedSequenceOptions.map((s: any) => s.id ?? s.section).join('-')}`}
                disablePortal
                id="combo-box-sequence-search"
                options={orderedSequenceOptions}
                inputValue={searchInputValue}
                onInputChange={(event, newInputValue) => {
                  setSearchInputValue(newInputValue)
                }}
                getOptionLabel={(option) => {
                  if ('section' in option) return ''
                  return option.nameSequence
                }}
                // Section headers logic
                renderOption={(() => {
                  let lastSection: string | null = null
                  const sectionHeaderMap: Record<number, string> = {}
                  orderedSequenceOptions.forEach((opt, idx) => {
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

                    // Extract key from props to avoid spreading it into JSX
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
                    const { key, ...otherProps } = props as any

                    return (
                      <React.Fragment key={option.id ?? `option-${index}`}>
                        {sectionLabel && (
                          <ListSubheader
                            key={`${sectionLabel}-header-${index}`}
                            component="div"
                            disableSticky
                            role="presentation"
                          >
                            {sectionLabel}
                          </ListSubheader>
                        )}
                        <li
                          key={option.id ?? `option-${index}`}
                          {...otherProps}
                        >
                          {option.nameSequence}
                        </li>
                      </React.Fragment>
                    )
                  }
                  renderOptionFn.displayName =
                    'SequenceAutocompleteRenderOption'
                  return renderOptionFn
                })()}
                filterOptions={(options, state) => {
                  // Partition options into groups by section
                  const groups: Record<string, any[]> = {}
                  let currentSection: 'Mine' | 'Alpha' | null = null
                  for (const option of options) {
                    const opt = option as any
                    if ('section' in opt) {
                      currentSection = opt.section as 'Mine' | 'Alpha'
                      if (!groups[currentSection]) groups[currentSection] = []
                    } else if (currentSection) {
                      if (!groups[currentSection]) groups[currentSection] = []
                      if (
                        opt.nameSequence &&
                        opt.nameSequence
                          .toLowerCase()
                          .includes(state.inputValue.toLowerCase())
                      ) {
                        groups[currentSection].push(opt)
                      }
                    }
                  }
                  // Flatten back to options array, inserting section header if group has any items
                  const filtered: typeof options = []
                  const sectionOrder: Array<'Mine' | 'Alpha'> = [
                    'Mine',
                    'Alpha',
                  ]
                  for (const section of sectionOrder) {
                    if (groups[section] && groups[section].length > 0) {
                      filtered.push({
                        section: section as 'Mine' | 'Alpha' | 'Others',
                      })
                      filtered.push(...groups[section])
                    }
                  }
                  return filtered
                }}
                isOptionEqualToValue={(option, value) => {
                  const opt = option as any
                  const val = value as any
                  if ('section' in opt || 'section' in val) return false
                  return opt.id === val.id
                }}
                sx={{
                  width: '100%',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderRadius: '12px',
                    borderColor: 'primary.main',
                    boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
                  },
                  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline':
                    {
                      borderColor: 'primary.light',
                    },
                  '& .MuiAutocomplete-endAdornment': {
                    display: 'none',
                  },
                }}
                renderInput={(params) => (
                  <AutocompleteInput
                    params={params}
                    placeholder="Search for a Sequence"
                    sx={{ '& .MuiInputBase-input': { color: 'primary.main' } }}
                    inputValue={searchInputValue}
                    onClear={() => setSearchInputValue('')}
                  />
                )}
                onChange={(event, value) => {
                  const val = value as any
                  if (val && 'section' in val) return
                  handleSelect(event as any, value as SequenceData | null)
                }}
              />
            </Box>

            {/* Only render sequence-specific UI if a valid sequence is selected */}
            {singleSequence && singleSequence.id !== 0 && (
              <React.Fragment key={singleSequence.id}>
                <Box
                  sx={{
                    mt: 4,
                    width: '100%',
                    maxWidth: '600px',
                    alignSelf: 'center',
                  }}
                >
                  {/* Sequence title with inline edit icon to the right */}
                  <Box
                    sx={{
                      width: { xs: '50%', sm: '40%', md: '30%' },
                      backgroundColor: 'primary.main',
                      borderTopLeftRadius: '12px',
                      borderTopRightRadius: '12px',
                      px: 2,
                      py: 0.75,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        color: 'primary.contrastText',
                        fontWeight: 'bold',
                        textAlign: 'center',
                      }}
                    >
                      {singleSequence.nameSequence}
                    </Typography>
                  </Box>
                  {/* Action buttons: View toggle, Edit */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    {/* View toggle icons */}
                    <IconButton
                      onClick={() => {
                        router.push(`/navigator/sequences/${singleSequence.id}`)
                      }}
                      aria-label={`Switch to list view for ${singleSequence.nameSequence}`}
                      sx={{
                        color: 'primary.main',
                        p: 1,
                        minWidth: 0,
                      }}
                      title="List View"
                    >
                      <FormatListBulletedIcon />
                    </IconButton>

                    <IconButton
                      disabled
                      aria-label="Currently in scroll view"
                      sx={{
                        color: 'primary.main',
                        p: 1,
                        minWidth: 0,
                        opacity: 0.5,
                      }}
                      title="Scroll View (current)"
                    >
                      <ViewStreamIcon />
                    </IconButton>

                    <IconButton
                      onClick={() => {
                        const editUrl = `/navigator/sequences/${singleSequence.id}?edit=true`
                        router.push(editUrl)
                      }}
                      aria-label={`Edit ${singleSequence.nameSequence}`}
                      sx={{
                        color: 'primary.main',
                        p: 1,
                        minWidth: 0,
                      }}
                      title="Edit Sequence"
                    >
                      <EditIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Stack rowGap={3} alignItems="center">
                  {paginatedData.map((seriesMini, i) => (
                    <Card
                      key={i}
                      sx={{
                        width: '100%',
                        maxWidth: '600px',
                        boxShadow: 3,
                        textAlign: 'center',
                        borderColor: 'primary.main',
                        borderWidth: '1px',
                        borderStyle: 'solid',
                      }}
                      className="journal"
                    >
                      <CardHeader
                        className="journalTitle"
                        title={
                          <Box width={'100%'}>
                            <Stack
                              flexDirection={'row'}
                              justifyContent={'space-between'}
                              alignItems={'center'}
                              sx={{ mb: 1 }}
                            >
                              <Button
                                disableRipple
                                onClick={() =>
                                  setPage((prev) => Math.max(prev - 1, 1))
                                }
                                disabled={page === 1}
                                startIcon={<ChevronLeftIcon />}
                                sx={{
                                  fontSize: '0.875rem',
                                  '&:hover': {
                                    backgroundColor: 'transparent',
                                    boxShadow: 'none',
                                  },
                                  '&.Mui-disabled': {
                                    opacity: 0.3,
                                  },
                                }}
                              >
                                {(
                                  singleSequence.sequencesSeries[
                                    page - 2
                                  ] as any
                                )?.seriesName || 'Previous'}
                              </Button>

                              <Button
                                disableRipple
                                onClick={() =>
                                  setPage((prev) =>
                                    Math.min(
                                      prev + 1,
                                      Math.ceil(
                                        singleSequence.sequencesSeries.length /
                                          itemsPerPage
                                      )
                                    )
                                  )
                                }
                                disabled={
                                  page ===
                                  Math.ceil(
                                    singleSequence.sequencesSeries.length /
                                      itemsPerPage
                                  )
                                }
                                endIcon={<ChevronRightIcon />}
                                sx={{
                                  fontSize: '0.875rem',
                                  '&:hover': {
                                    backgroundColor: 'transparent',
                                    boxShadow: 'none',
                                  },
                                  '&.Mui-disabled': {
                                    opacity: 0.3,
                                  },
                                }}
                              >
                                {(singleSequence.sequencesSeries[page] as any)
                                  ?.seriesName || 'Next'}
                              </Button>
                            </Stack>
                            <Stack>
                              <Typography
                                variant="h6"
                                onClick={() =>
                                  handleSeriesNavigation(seriesMini)
                                }
                                sx={{
                                  color: 'primary.main',
                                  cursor: 'pointer',
                                  '&:hover': {
                                    textDecoration: 'underline',
                                  },
                                }}
                              >
                                {seriesMini.seriesName}
                              </Typography>
                            </Stack>
                          </Box>
                        }
                      />
                      <CardContent className="lines" sx={{ p: 0 }}>
                        {seriesMini.seriesPoses?.map(
                          (asana: any, asanaIndex: any) => {
                            // asana may be a legacy string reference or an object with metadata
                            let poseName = ''
                            let href = '#'
                            let alignmentCues = ''

                            if (typeof asana === 'string') {
                              poseName = asana.split(';')[0]
                              href = getPoseNavigationUrlSync(asana)
                            } else {
                              poseName = (asana as any).sort_english_name || ''
                              alignmentCues =
                                (asana as any).alignment_cues || ''
                              // Prefer poseId if available, otherwise use the name
                              const poseRef = String(
                                (asana as any).poseId ?? poseName
                              )
                              href = getPoseNavigationUrlSync(poseRef)
                            }

                            // Extract first line of alignment cue for inline display
                            const alignmentCuesInline = alignmentCues
                              ? String(alignmentCues).split('\n')[0]
                              : ''

                            return (
                              <Box
                                key={asanaIndex}
                                alignItems={'center'}
                                display={'flex'}
                                flexDirection={'row'}
                                flexWrap={'nowrap'}
                                className="journalLine"
                                sx={{
                                  maxWidth: '100%',
                                  width: '100%',
                                  minWidth: 'unset',
                                  justifyContent: 'flex-start',
                                  alignItems: 'flex-start',
                                  gap: 2,
                                }}
                              >
                                <Typography
                                  variant="body1"
                                  fontWeight="bold"
                                  sx={{
                                    width: '35px',
                                    textAlign: 'right',
                                    flexShrink: 0,
                                    lineHeight: 1.5,
                                  }}
                                >
                                  {asanaIndex + 1}.
                                </Typography>
                                <Typography
                                  textAlign={'left'}
                                  variant="body1"
                                  sx={{
                                    flex: '1 1 auto',
                                    minWidth: 0,
                                    lineHeight: 1.5,
                                    display: 'flex',
                                    alignItems: 'baseline',
                                    gap: 1,
                                    flexWrap: 'wrap',
                                  }}
                                >
                                  <Link
                                    underline="hover"
                                    color="primary.contrastText"
                                    href={href}
                                    sx={{
                                      wordWrap: 'break-word',
                                      overflowWrap: 'break-word',
                                      hyphens: 'auto',
                                      display: 'inline',
                                      lineHeight: 1.5,
                                    }}
                                  >
                                    {poseName}
                                  </Link>
                                  {alignmentCuesInline && (
                                    <Typography
                                      component="span"
                                      variant="body2"
                                      color="text.secondary"
                                      sx={{
                                        fontStyle: 'normal',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        maxWidth: '60%',
                                      }}
                                    >
                                      ({alignmentCuesInline})
                                    </Typography>
                                  )}
                                </Typography>
                              </Box>
                            )
                          }
                        )}
                      </CardContent>
                    </Card>
                  ))}

                  {/* Navigation with pagination circles */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                      mt: 2,
                      width: '100%',
                      maxWidth: '600px',
                    }}
                  >
                    <CustomPaginationCircles
                      count={Math.ceil(
                        singleSequence.sequencesSeries.length / itemsPerPage
                      )}
                      page={page}
                      onChange={handleChange}
                    />
                  </Box>

                  {/* Sequence Image */}
                  {singleSequence.image && (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        px: 2,
                        mt: 2,
                      }}
                    >
                      <Box
                        sx={{
                          width: { xs: '100%', sm: '400px' },
                          maxHeight: '400px',
                          borderRadius: 2,
                          overflow: 'hidden',
                          boxShadow: 3,
                          '& img': {
                            width: '100%',
                            height: 'auto',
                            maxHeight: '400px',
                            objectFit: 'contain',
                          },
                        }}
                      >
                        <Image
                          src={singleSequence.image}
                          alt={singleSequence.nameSequence || 'Sequence image'}
                          width={400}
                          height={400}
                          sizes="(max-width: 600px) 100vw, 400px"
                          style={{
                            width: '100%',
                            height: 'auto',
                            maxHeight: '400px',
                            objectFit: 'contain',
                          }}
                        />
                      </Box>
                    </Box>
                  )}

                  <Box
                    className={'journal'}
                    sx={{
                      marginTop: '32px',
                      p: 4,
                      color: 'primary.main',
                      backgroundColor: 'navSplash.dark',
                    }}
                  >
                    <Stack flexDirection={'row'} alignItems={'center'}>
                      <Typography variant="h3" sx={{ mr: 2 }}>
                        Description
                      </Typography>
                      <Image
                        src={'/icons/flows/leaf-3.svg'}
                        alt={'leaf icon'}
                        height={21}
                        width={21}
                      ></Image>
                    </Stack>
                    <Typography
                      color="primary.contrastText"
                      variant="body1"
                      sx={{ whiteSpace: 'pre-line' }}
                    >
                      {singleSequence.description}
                    </Typography>
                  </Box>

                  {/* Sequence Activity Tracker */}
                  {singleSequence.id && singleSequence.id !== 0 && (
                    <Box sx={{ mt: 3 }}>
                      <SequenceActivityTracker
                        sequenceId={singleSequence.id.toString()}
                        sequenceName={singleSequence.nameSequence}
                        onActivityToggle={handleActivityToggle}
                      />
                    </Box>
                  )}
                </Stack>
              </React.Fragment>
            )}
          </Stack>
        </Stack>
      </Box>

      <Drawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            maxWidth: '100vw',
          },
        }}
        disablePortal={false}
        disableScrollLock={true}
      >
        <Typography variant="body1" sx={{ p: 2 }}>
          Browse and practice yoga sequences. Use the search to find specific
          sequences or scroll through the collection. Select a sequence to view
          details and track your practice progress.
        </Typography>
      </Drawer>
    </>
  )
}
