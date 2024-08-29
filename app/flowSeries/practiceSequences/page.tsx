'use client'
import { SequenceData } from '@app/context/SequenceContext'
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import React, { ChangeEvent, useEffect, useState } from 'react'

export default function Page() {
  const [sequences, setSequences] = useState<SequenceData[]>([])
  const [singleSequence, setSingleSequence] = useState<SequenceData>({
    id: 0,
    nameSequence: '',
    sequencesSeries: [],
    description: '',
    duration: '',
    image: '',
    breath_direction: '',
    createdAt: '',
    updatedAt: '',
  })

  useEffect(() => {
    async function fetchData() {
      // const baseUrl =
      //   process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      // const url = new URL('/api/series/', baseUrl)
      // const response = await fetch(url)
      const response = await fetch('/api/sequences')
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      setSequences(await response.json())
    }

    fetchData()
  }, [])

  function handleSelect(event: ChangeEvent<{}>, value: SequenceData | null) {
    // Logs the type of event (e.g., 'click')
    // console.log('Event type:', event.type)
    // Logs the element that triggered the event
    // console.log('Event target:', event.target)
    console.log('Selected value:', value)
    event.preventDefault()
    if (value) {
      setSingleSequence(value)
    }
  }

  return (
    <>
      <Stack flexDirection={'column'}>
        <Typography variant="h2" align="center">
          Practice Sequences
        </Typography>
        <Button
          variant="outlined"
          href="/flowSeries"
          LinkComponent="a"
          size="medium"
          sx={{ my: 3, display: 'block' }}
        >
          Back to flow
        </Button>
      </Stack>
      <Autocomplete
        disablePortal
        id="combo-box-series-search"
        options={sequences}
        getOptionLabel={(option: SequenceData) => option.nameSequence}
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            {option.nameSequence}
          </li>
        )}
        sx={{ width: '100%' }}
        renderInput={(params) => <TextField {...params} label="Flow Series" />}
        onChange={handleSelect}
      />
      <React.Fragment key={singleSequence.id}>
        <Box
          sx={{
            margin: 2,
          }}
        >
          <Typography variant="h3" textAlign="center">
            {singleSequence.nameSequence}
          </Typography>
        </Box>
        <Stack rowGap={3} alignItems="center">
          {singleSequence.sequencesSeries.map((seriesMini, i) => (
            <Card
              key={i}
              sx={{
                width: '85%',
                boxShadow: 3,
                textAlign: 'center',
                borderColor: 'primary.main',
                borderWidth: '1px',
                borderStyle: 'solid',
              }}
            >
              <CardHeader title={seriesMini.seriesName} />
              <CardContent>
                {/* 
                  // ! add types to this
                   */}
                {seriesMini.seriesPostures.map(
                  (asana: any, asanaIndex: any) => (
                    <Typography
                      key={asanaIndex}
                      textAlign={'left'}
                      variant="body1"
                      sx={{ my: 2 }}
                    >
                      {asana}
                    </Typography>
                  )
                )}
              </CardContent>
            </Card>
          ))}
        </Stack>
      </React.Fragment>
      {/* 
                  // breath icons
                  import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
                  import CloudUploadIcon from '@mui/icons-material/CloudUpload';
                  import ContactlessIcon from '@mui/icons-material/Contactless';
                  import DeblurIcon from '@mui/icons-material/Deblur';
                  import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
                  import FastForwardIcon from '@mui/icons-material/FastForward';
                  import FastRewindIcon from '@mui/icons-material/FastRewind';
                  import FileUploadIcon from '@mui/icons-material/FileUpload';
                  import FileDownloadIcon from '@mui/icons-material/FileDownload';
                  import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
                  import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
                  import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
                  import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
                  import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
                  import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';

                  // best so far
                  import LoginIcon from '@mui/icons-material/Login';
                  import LogoutIcon from '@mui/icons-material/Logout';
                  <LoginIcon />
                    <LogoutIcon />

                  // meditation icon
                  import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';

                  */}
    </>
  )
}
