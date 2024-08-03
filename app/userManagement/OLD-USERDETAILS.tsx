/* 
Moving the data that works from the OLD-USERDETAILS.tsx to UserDetails.tsx

I added all the fields I want to use into this but it is confusing me while trying to work on the user profile page.
*/
'use client'
import React from 'react'
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Checkbox,
  Collapse,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  IconButton,
  IconButtonProps,
  InputBase,
  InputLabel,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  styled,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb'
import SearchIcon from '@mui/icons-material/Search'
import MenuIcon from '@mui/icons-material/Menu'
import DirectionsIcon from '@mui/icons-material/Directions'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { red } from '@mui/material/colors'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ShareIcon from '@mui/icons-material/Share'
import { useSession } from 'next-auth/react'

function not(a: readonly string[], b: readonly string[]) {
  return a.filter((value) => b.indexOf(value) === -1)
}

function intersection(a: readonly string[], b: readonly string[]) {
  return a.filter((value) => b.indexOf(value) !== -1)
}

// profile card
interface ExpandMoreProps extends IconButtonProps {
  expand: boolean
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props
  return <IconButton {...other} />
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}))

export interface UserData {
  id: string
  provider_id: string
  name: string
  email: string
  emailVerified: Date
  image: string
  pronouns: string
  profile: JSON
  createdAt: Date
  updatedAt: Date
}

export default function UserDetails() {
  const { data: session, update } = useSession()
  // console.log('UserDetails session', session)
  // console.log('session?.user?.id', session?.user?.id)
  // Select: timezones
  // const [timezone, setTimezone] = React.useState('')

  // const handleTimezoneChange = (event: SelectChangeEvent) => {
  //   setTimezone(event.target.value as string)
  // }

  // Select: yoga style
  // const [yogaStyle, setYogaStyle] = React.useState('')

  // const handleStyleChange = (event: SelectChangeEvent) => {
  //   setYogaStyle(event.target.value as string)
  // }

  // checkbox
  // const label = { inputProps: { 'aria-label': 'Switch demo' } }

  // Toggle Button
  // const [alignment, setAlignment] = React.useState<string | null>('left')

  // const handleCalendar = (
  //   event: React.MouseEvent<HTMLElement>,
  //   newAlignment: string | null
  // ) => {
  //   setAlignment(newAlignment)
  // }

  /*
   * Transfer List
   * https://mui.com/material-ui/react-transfer-list/
   */
  // const [checked, setChecked] = React.useState<readonly string[]>([])
  // const [left, setLeft] = React.useState<readonly string[]>([
  //   '(Notification) Default Notifications (by...email/phone/etc):',
  //   '(Notification) watch post:',
  //   '(Notification) watch instructor:',
  //   '(Notification) Subscribe (frequency...weekly/daily):',
  // ])
  // const [right, setRight] = React.useState<readonly string[]>([
  //   '4, 5, 6, 7',
  //   '24,23,2,1',
  // ])

  // const leftChecked = intersection(checked, left)
  // const rightChecked = intersection(checked, right)

  // const handleToggle = (value: string) => () => {
  //   const currentIndex = checked.indexOf(value)
  //   const newChecked = [...checked]
  //   if (currentIndex === -1) {
  //     newChecked.push(value)
  //   } else {
  //     newChecked.splice(currentIndex, 1)
  //   }
  //   setChecked(newChecked)
  // }

  // const handleAllRight = () => {
  //   setRight(right.concat(left))
  //   setLeft([])
  // }

  // const handleCheckedRight = () => {
  //   setRight(right.concat(leftChecked))
  //   setLeft(not(left, leftChecked))
  //   setChecked(not(checked, leftChecked))
  // }

  // const handleCheckedLeft = () => {
  //   setLeft(left.concat(rightChecked))
  //   setRight(not(right, rightChecked))
  //   setChecked(not(checked, rightChecked))
  // }

  // const handleAllLeft = () => {
  //   setLeft(left.concat(right))
  //   setRight([])
  // }

  // const customList = (items: readonly string[]) => (
  //   <Paper sx={{ width: 200, height: 230, overflow: 'auto' }}>
  //     <List dense component="div" role="list">
  //       {items.map((value: string) => {
  //         const labelId = `transfer-list-item-${value}-label`

  //         return (
  //           <ListItemButton
  //             key={value}
  //             role="listitem"
  //             onClick={handleToggle(value)}
  //           >
  //             <ListItemIcon>
  //               <Checkbox
  //                 checked={checked.indexOf(value) !== -1}
  //                 tabIndex={-1}
  //                 disableRipple
  //                 inputProps={{
  //                   'aria-labelledby': labelId,
  //                 }}
  //               />
  //             </ListItemIcon>
  //             <ListItemText id={labelId} primary={`List item ${value + 1}`} />
  //           </ListItemButton>
  //         )
  //       })}
  //     </List>
  //   </Paper>
  // )

  // image card
  const [expanded, setExpanded] = React.useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  // user data
  const [userData, setUserData] = React.useState<UserData>({
    id: session?.user?.id ?? '',
    provider_id: '',
    name: session?.user?.name ?? '',
    email: session?.user?.email ?? '',
    emailVerified: new Date(),
    image: session?.user?.image ?? '',
    pronouns: '',
    profile: {} as JSON,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  // fetch user data based on session.user.email
  React.useEffect(() => {
    // console.log('useEffect', session?.user?.email)
    // console.log('User useEffect triggers')

    if (!session) return

    const fetchUserData = async () => {
      try {
        // const userId = session?.user?.id
        const userEmail = session?.user?.email

        // const response = await fetch(`/api/user/${userId}`)
        // const response = await fetch(`/api/user/?email=${encodeURIComponent(userEmail)}`);
        const response = await fetch(`/api/user/?${userEmail}`)
        // console.log('useEffect response', response)

        if (response.ok) {
          const user = await response.json()
          // setUserData(await response.json())
          console.log('User data', userData)
          setUserData(user)
        } else {
          console.error('Failed to fetch user data', response.statusText)
        }
      } catch (error) {
        console.error('Error fetching user data', error)
      }
    }

    fetchUserData()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }
  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try {
      const postUserData = await fetch(`/api/user/updateUserData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pronouns: userData.pronouns,
          email: session?.user?.email,
        }),
      })
      if (postUserData.ok) {
        // console.log('Data saved')
      } else {
        console.error('Error saving data')
        throw new Error('Error saving data')
      }
    } catch (error) {
      console.error('Error saving data', error)
    }
  }

  /*  
  Form resources:
  - https://www.ventureharbour.com/form-design-best-practices/
  */
  return (
    <Grid
      container
      spacing={2}
      direction="row"
      justifyContent={'center'}
      sx={{ p: 2 }}
      component={'form'}
      onSubmit={handleSubmit}
    >
      {
        // if no session, show loading
        !session && <div>Sign In</div>
      }
      {session && (
        <>
          {/*
          <Grid xs={12} sm={12} md={6} item>
            <FormControl fullWidth>
              <TextField
                id="outlined-email-input"
                name="secondaryEmail"
                label="Email (secondary/internal):"
                value={'...@email.com'}
                variant="outlined"
                type="email"
              />
            </FormControl>
          </Grid>
          <Grid xs={12} sm={12} md={6} item>
            <FormControl fullWidth>
              <TextField
                // required
                id="outlined-email-input"
                name="emailPublic"
                label="Email (public):"
                value={'...@email.com'}
                variant="outlined"
                type="email"
              />
            </FormControl>
          </Grid>
*/}
          {/* <Grid xs={12} sm={6} md={6} item>
      <FormControl>
        <TextField
          required
          id="outlined-password-input"
          label="Password"
          name="password"
          variant="outlined"
          type="password"
          value={'test'}
          autoComplete="current-password"
        />
      </FormControl>
    </Grid>
    <Grid xs={12} sm={6} md={6} item>
      <FormControl>
        <TextField
          required
          name="confirmPassword"
          id="outlined-password-input"
          label="Confirm Password:"
          value={'test'}
          variant="outlined"
          type="password"
        />
      </FormControl>
    </Grid> */}
          {/* 
          <Grid xs={12} sm={6} md={6} item>
            <FormControl>
              <TextField
                // required
                id="outlined"
                name="phoneContact"
                placeholder="() xxx-xxx-xxxx"
                label="Contact Phone Number:"
                value={'(123) 456-7890'}
                type="phone"
              />
            </FormControl>
          </Grid>
          
 */}

          <Grid xs={12} sm={12} md={12} item>
            {/* <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">Yoga Style</InputLabel>
      <Select
        name="yogaStyle"
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={yogaStyle}
        label="Yoga Style:"
        onChange={handleStyleChange}
      >
        <MenuItem value={1}>Ashtanga</MenuItem>
        <MenuItem value={2}>BKS Iyengar</MenuItem>
        <MenuItem value={3}>Yin Yoga</MenuItem>
        <MenuItem value={4}>Bikram Yoga</MenuItem>
        <MenuItem value={4}>Hatha Yoga</MenuItem>
      </Select>
    </FormControl> */}
          </Grid>
          {/*           
          <Grid xs={12} sm={6} md={6} item>
            <FormControl>
              <TextField
                id="outlined"
                name="yogaExperience"
                placeholder="Enter..."
                label="Yoga Experience:"
                value={2}
                type="number"
              />
            </FormControl>
          </Grid>
          <Grid xs={12} sm={6} md={6} item>
            <FormControl>
              <TextField
                id="outlined"
                name="company"
                placeholder="Enter..."
                label="Company:"
                value={'Happy Yoga'}
                // type="text"
              />
            </FormControl>
          </Grid>
          <Grid xs={12} sm={12} md={12} item>
            <FormControl>
              <FormGroup>
                <FormControlLabel
                  control={<Switch name="Facebook" defaultChecked />}
                  label="(login connected) Facebook:"
                />
                <FormControlLabel
                  control={<Switch name="Google" defaultChecked />}
                  label="(login connected) Google:"
                />
                <FormControlLabel
                  control={<Switch name="Patreon" defaultChecked />}
                  label="(login connected) Patreon:"
                />
                <FormControlLabel
                  control={<Switch name="Twitch" defaultChecked />}
                  label="(login connected) Twitch:"
                />
                <FormControlLabel
                  control={<Switch name="Twitter" defaultChecked />}
                  label="(login connected) Twitter:"
                />
              </FormGroup>
            </FormControl>
          </Grid>
          <Grid xs={12} sm={12} md={12} item>
            <FormControl>
              <TextField
                id="outlined"
                name="websiteURL"
                placeholder="Enter..."
                label="(links) Website URL::"
                value={'http://localhost:3000/'}
                type="url"
              />
            </FormControl>
          </Grid>
          <Grid xs={12} sm={12} md={12} item>
            <FormControl>
              <TextField
                id="outlined"
                placeholder="Enter..."
                name="blogURL"
                label="(links) Blog URL::"
                value={'http://localhost:3000/'}
                type="url"
              />
            </FormControl>
          </Grid>
          <Grid xs={12} sm={12} md={12} item>
            <FormControl>
              <TextField
                id="outlined"
                placeholder="Enter..."
                name="socialURL"
                label="(links) Social URL::"
                value={'http://localhost:3000/'}
                type="url"
              />
            </FormControl>
          </Grid>
          <Grid xs={12} sm={12} md={12} item>
            <FormControl>
              <TextField
                id="outlined"
                placeholder="Enter..."
                name="streamingURL"
                label="(links) Video/Streaming URL::"
                value={'http://localhost:3000/'}
                type="url"
              />
            </FormControl>
          </Grid>

          <Grid xs={12} sm={12} md={12} item>
            <FormControl>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox name="isInstructor" />}
                  label="Is Instructor:"
                />
                <FormControlLabel
                  control={<Checkbox name="isStudent" />}
                  label="Is Student:"
                />
                <FormControlLabel
                  control={<Checkbox name="isPrivate" />}
                  label="Is Private Profile/User:"
                />
              </FormGroup>
            </FormControl>
          </Grid>
 */}
          {/* 
          <Grid xs={12} sm={12} md={12} item>
            <FormControl>
              <FormLabel>Calendar (google/outlook/Other):</FormLabel>
              <ToggleButtonGroup
                value={alignment}
                exclusive
                onChange={handleCalendar}
                aria-label="Calendar Connect"
              >
                <ToggleButton value="left" aria-label="left aligned">
                  <CalendarMonthIcon />
                </ToggleButton>
                <ToggleButton value="center" aria-label="centered">
                  <DoNotDisturbIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </FormControl>
          </Grid>
           */}
          {/* <Grid container spacing={2} justifyContent="center" alignItems="center">
    <Grid item>{customList(left)}</Grid>
    <Grid item>
      <Grid container direction="column" alignItems="center">
        <Button
          sx={{ my: 0.5 }}
          variant="outlined"
          size="small"
          onClick={handleAllRight}
          disabled={left.length === 0}
          aria-label="move all right"
        >
          ≫
        </Button>
        <Button
          sx={{ my: 0.5 }}
          variant="outlined"
          size="small"
          onClick={handleCheckedRight}
          disabled={leftChecked.length === 0}
          aria-label="move selected right"
        >
          &gt;
        </Button>
        <Button
          sx={{ my: 0.5 }}
          variant="outlined"
          size="small"
          onClick={handleCheckedLeft}
          disabled={rightChecked.length === 0}
          aria-label="move selected left"
        >
          &lt;
        </Button>
        <Button
          sx={{ my: 0.5 }}
          variant="outlined"
          size="small"
          onClick={handleAllLeft}
          disabled={right.length === 0}
          aria-label="move all left"
        >
          ≪
        </Button>
      </Grid>
    </Grid>
    <Grid item>{customList(right)}</Grid>
  </Grid> */}
          {/* 
          <Grid xs={12} sm={6} md={6} item>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Timezone: for date time conversions
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                name="timezone"
                id="demo-simple-select"
                value={timezone}
                label="Age"
                onChange={handleTimezoneChange}
              >
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </Grid>
           */}
          <Grid xs={12} sm={6} md={6} item>
            {/*  
Current Location: tips

plus codes, https://maps.google.com/pluscodes/
google maps, https://support.google.com/maps/answer/7047426?hl=en&co=GENIE.Platform=Android
Google Maps JS API, https://developers.google.com/maps/documentation/javascript

*/}
            {/* 
            <FormControl>
              <Paper
                sx={{
                  p: '2px 4px',
                  display: 'flex',
                  alignItems: 'center',
                  width: 400,
                }}
              >
                <IconButton sx={{ p: '10px' }} aria-label="menu">
                  <MenuIcon />
                </IconButton>
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  name="location"
                  placeholder="Search Google Maps"
                  inputProps={{ 'aria-label': 'search google maps' }}
                />
                <IconButton
                  type="button"
                  sx={{ p: '10px' }}
                  aria-label="search"
                >
                  <SearchIcon />
                </IconButton>
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                <IconButton
                  color="primary"
                  sx={{ p: '10px' }}
                  aria-label="directions"
                >
                  <DirectionsIcon />
                </IconButton>
              </Paper>
            </FormControl>
 */}
          </Grid>
          {/* 
          <Grid xs={12} sm={6} md={6} item>
            <FormControl>
              <FormControlLabel
                label="Is Okay to Display Current Location?:"
                name="isLocationPublic"
                control={<Checkbox defaultChecked />}
              />
            </FormControl>
          </Grid>
          <Grid xs={12} sm={6} md={6} item>
            <TextField
              id="filled-basic"
              name="exportAccountInfo"
              label="EXPORT account info:"
              placeholder='Enter "email address" to send information'
              variant="filled"
            />
          </Grid>
          <Grid xs={12} sm={6} md={6} item>
            <TextField
              id="filled-basic"
              name="deleteAccountInfo"
              label="DELETE account info:"
              placeholder='Type "DELETE" to confirm'
              variant="filled"
            />
          </Grid>
          <Grid xs={12} sm={12} md={12} item>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                (Theme) Preferences:
              </AccordionSummary>
              <AccordionDetails>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                eget.
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2-content"
                id="panel2-header"
              >
                (Theme) Theme mode:
              </AccordionSummary>
              <AccordionDetails>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                eget.
              </AccordionDetails>
            </Accordion>
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3-content"
                id="panel3-header"
              >
                (Theme) Emoji skine tone:
              </AccordionSummary>
              <AccordionDetails>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                eget.
              </AccordionDetails>
              <AccordionActions>
                <Button>Cancel</Button>
                <Button>Agree</Button>
              </AccordionActions>
            </Accordion>
          </Grid>
           */}
        </>
      )}
    </Grid>
  )
}
