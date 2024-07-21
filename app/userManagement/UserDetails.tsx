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
import Image from 'next/image'

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
  // const { expand, ...other } = props
  const { ...other } = props
  return <IconButton {...other} />
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}))

export default function UserDetails() {
  const { data: session, update } = useSession()
  console.log('UserDetails session', session)
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

  /*  
  Form reesources:
  - https://www.ventureharbour.com/form-design-best-practices/
  */
  return (
    <Grid
      container
      spacing={2}
      direction="row"
      justifyContent={'center'}
      sx={{ p: 2 }}
    >
      {/* Text Fields, https://mui.com/material-ui/react-text-field/ */}
      <Grid xs={12} item>
        <Typography variant="h2">Practitioner Details</Typography>
      </Grid>
      <Grid xs={12} item>
        {/* // TODO: create an image input and display component. */}
        <Card sx={{ maxWidth: '90%', mx: 'auto' }}>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                Y
              </Avatar>
            }
            action={
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            }
            title={session?.user?.name}
            subheader="Member since 6/9/2024"
          />
          <CardMedia
            component="img"
            src={session?.user?.image || '/stick-tree-pose-400x400.png'}
            alt="Yoga"
            sx={{
              width: 'auto',
              height: 'auto',
              display: 'block',
              margin: 'auto',
            }}
          />
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              [HEADLINE] Happy Yoga instructor and Happy Reiki Master.
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton aria-label="add to favorites" disabled>
              <FavoriteIcon />
            </IconButton>
            <IconButton aria-label="share" disabled>
              <ShareIcon />
            </IconButton>
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </CardActions>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography paragraph>Share Quickly:</Typography>
              <Typography paragraph>Information about the user.</Typography>
              <Typography paragraph>
                [YOGA_STYLE], [YOGA_EXPERIENCE], [COMPANY]
              </Typography>
              <Typography paragraph>[LINKS_WEBSITE_URL]</Typography>
              <Typography>[LOCATION]</Typography>
            </CardContent>
          </Collapse>
        </Card>
      </Grid>
      <Grid xs={12} sm={6} md={6} item>
        <FormControl>
          <TextField
            name="User Name"
            required
            id="outlined-basic"
            placeholder='Enter "First Name"'
            label="First Name"
            value={session?.user?.name}
            variant="outlined"
            type="text"
          />
        </FormControl>
      </Grid>
      {/* <Grid xs={6} sm={6} md={6} item>
      <FormControl>
        <TextField
          required
          name="lastName"
          id="outlined-basic"
          placeholder='Enter "Last Name"'
          label="Last Name"
          value={'Grisby'}
          variant="outlined"
          type="text"
        />
      </FormControl>
    </Grid> */}
      <Grid xs={12} sm={6} md={6} item>
        <TextField
          name="pronouns"
          id="pronouns"
          label="Pronouns:"
          variant="outlined"
          type="text"
          defaultValue={'He/Him'}
        />
      </Grid>
      <Grid xs={12} sm={12} md={12} item>
        <FormControl fullWidth>
          <TextField
            required
            id="outlined-email-input"
            name="primaryEmail"
            placeholder="xyz@ABC.com"
            label="Email (primary/internal):"
            value={session?.user?.email}
            variant="outlined"
            type="email"
          />
        </FormControl>
      </Grid>
      <Grid xs={12} sm={12} md={6} item>
        <FormControl fullWidth>
          <TextField
            id="outlined-email-input"
            name="secondaryEmail"
            label="Email (secondary/internal):"
            value={'...'}
            variant="outlined"
            type="email"
          />
        </FormControl>
      </Grid>
      <Grid xs={12} sm={12} md={6} item>
        <FormControl fullWidth>
          <TextField
            required
            id="outlined-email-input"
            name="emailPublic"
            label="Email (public):"
            value={'...'}
            variant="outlined"
            type="email"
          />
        </FormControl>
      </Grid>
      <Grid xs={12} sm={6} md={6} item>
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
      </Grid>

      <Grid xs={12} sm={6} md={6} item>
        <FormControl>
          <TextField
            required
            id="outlined"
            name="phoneContact"
            placeholder="() xxx-xxx-xxxx"
            label="Contact Phone Number:"
            value={'(123) 456-7890'}
            type="phone"
          />
        </FormControl>
      </Grid>
      <Grid xs={12} sm={12} md={12} item>
        <FormControl fullWidth>
          <TextField
            required
            id="outlined-textarea"
            name="bio"
            placeholder="Enter...Bio"
            label="Description/About/Bio:"
            value={'I am a yoga instructor.'}
            multiline
            maxRows={4}
            type="text"
          />
        </FormControl>
      </Grid>
      <Grid xs={12} sm={12} md={12} item>
        <FormControl fullWidth>
          <TextField
            required
            id="outlined-textarea"
            name="headline"
            placeholder="Enter...2 sentences"
            label="Headline:"
            value={'I am a yoga instructor and Reiki Master.'}
            multiline
            maxRows={2}
            type="text"
          />
        </FormControl>
      </Grid>

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
            type="text"
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

      <Grid xs={12} sm={12} md={12} item>
        <FormControl>
          <FormLabel name="calendar" component="text">
            Calendar (google/outlook/Other):
          </FormLabel>
          {/* <ToggleButtonGroup
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
        </ToggleButtonGroup> */}
        </FormControl>
      </Grid>
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

      <Grid xs={12} sm={6} md={6} item>
        {/* <FormControl fullWidth>
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
      </FormControl> */}
      </Grid>
      <Grid xs={12} sm={6} md={6} item>
        {/*  
  Current Location: tips
  
  plus codes, https://maps.google.com/pluscodes/
  google maps, https://support.google.com/maps/answer/7047426?hl=en&co=GENIE.Platform=Android
  Google Maps JS API, https://developers.google.com/maps/documentation/javascript

  */}
        <FormControl>
          <Paper
            component="form"
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
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
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
      </Grid>

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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </AccordionDetails>
          <AccordionActions>
            <Button>Cancel</Button>
            <Button>Agree</Button>
          </AccordionActions>
        </Accordion>
      </Grid>
    </Grid>
  )
}
