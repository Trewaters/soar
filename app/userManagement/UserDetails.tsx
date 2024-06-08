import React from 'react'
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  IconButton,
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
  Stack,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb'
import SearchIcon from '@mui/icons-material/Search'
import MenuIcon from '@mui/icons-material/Menu'
import DirectionsIcon from '@mui/icons-material/Directions'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
// import { Login } from '@mui/icons-material'
import LoginPage from './login'

function not(a: readonly string[], b: readonly string[]) {
  return a.filter((value) => b.indexOf(value) === -1)
}

function intersection(a: readonly string[], b: readonly string[]) {
  return a.filter((value) => b.indexOf(value) !== -1)
}

export default function UserDetails() {
  // Select: timezones
  const [timezone, setTimezone] = React.useState('')

  const handleTimezoneChange = (event: SelectChangeEvent) => {
    setTimezone(event.target.value as string)
  }

  // Select: yoga style
  const [yogaStyle, setYogaStyle] = React.useState('')

  const handleStyleChange = (event: SelectChangeEvent) => {
    setYogaStyle(event.target.value as string)
  }

  // checkbox
  // const label = { inputProps: { 'aria-label': 'Switch demo' } }

  // Toggle Button
  const [alignment, setAlignment] = React.useState<string | null>('left')

  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null
  ) => {
    setAlignment(newAlignment)
  }

  /*
   * Transfer List
   * https://mui.com/material-ui/react-transfer-list/
   */
  const [checked, setChecked] = React.useState<readonly string[]>([])
  const [left, setLeft] = React.useState<readonly string[]>([
    '(Notification) Default Notifications (by...email/phone/etc):',
    '(Notification) watch post:',
    '(Notification) watch instructor:',
    '(Notification) Subscribe (frequency...weekly/daily):',
  ])
  const [right, setRight] = React.useState<readonly string[]>([
    '4, 5, 6, 7',
    '24,23,2,1',
  ])

  const leftChecked = intersection(checked, left)
  const rightChecked = intersection(checked, right)

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]
    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }
    setChecked(newChecked)
  }

  const handleAllRight = () => {
    setRight(right.concat(left))
    setLeft([])
  }

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked))
    setLeft(not(left, leftChecked))
    setChecked(not(checked, leftChecked))
  }

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked))
    setRight(not(right, rightChecked))
    setChecked(not(checked, rightChecked))
  }

  const handleAllLeft = () => {
    setLeft(left.concat(right))
    setRight([])
  }

  const customList = (items: readonly string[]) => (
    <Paper sx={{ width: 200, height: 230, overflow: 'auto' }}>
      <List dense component="div" role="list">
        {items.map((value: string) => {
          const labelId = `transfer-list-item-${value}-label`

          return (
            <ListItemButton
              key={value}
              role="listitem"
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`List item ${value + 1}`} />
            </ListItemButton>
          )
        })}
      </List>
    </Paper>
  )

  /*  
  Form reesources:
  - https://www.ventureharbour.com/form-design-best-practices/
  */
  return (
    <Stack>
      <LoginPage />
      <h1>User Details</h1>
      {/* Text Fields, https://mui.com/material-ui/react-text-field/ */}
      <FormControl>
        <TextField
          required
          id="outlined-basic"
          // defaultValue="defFirstName"
          placeholder='Enter "First Name"'
          label="First Name"
          variant="outlined"
          type="text"
        />
      </FormControl>

      <FormControl>
        <TextField
          required
          id="outlined-basic"
          // defaultValue="defLastName"
          placeholder='Enter "Last Name"'
          label="Last Name"
          variant="outlined"
          type="text"
        />
      </FormControl>

      <FormControl>
        <TextField
          required
          id="outlined-password-input"
          // defaultValue="defLastName"
          placeholder="xyz@ABC.com"
          label="Email (primary/internal):"
          variant="outlined"
          type="text"
        />
      </FormControl>
      <FormControl>
        <TextField
          required
          id="outlined-password-input"
          label="Password"
          variant="outlined"
          type="password"
          autoComplete="current-password"
        />
      </FormControl>
      <FormControl>
        <TextField
          required
          id="outlined-password-input"
          label="Confirm Password:"
          variant="outlined"
          type="password"
        />
      </FormControl>

      <FormControl>
        <TextField
          required
          id="outlined-email-input"
          label="Email (public):"
          variant="outlined"
          type="email"
          autoComplete="current-password"
        />
      </FormControl>
      <FormControl>
        <TextField
          required
          id="outlined-email-input"
          label="Email (internal/alternate):"
          variant="outlined"
          type="email"
          autoComplete="current-password"
        />
      </FormControl>

      <FormControl>
        <TextField
          required
          id="outlined-textarea"
          placeholder="Enter...Bio"
          label="Description/About/Bio:"
          multiline
          maxRows={4}
          type="text"
        />
      </FormControl>

      <FormControl>
        <TextField
          required
          id="outlined-textarea"
          placeholder="Enter...2 sentences"
          label="Headline:"
          multiline
          maxRows={2}
          type="text"
        />
      </FormControl>

      <FormControl>
        <TextField
          required
          id="outlined"
          placeholder="() xxx-xxx-xxxx"
          label="Phone Number:"
          type="phone"
        />
      </FormControl>

      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Age</InputLabel>
        <Select
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
      </FormControl>

      <FormControl>
        <TextField
          required
          id="outlined"
          placeholder="Enter..."
          label="Yoga Experience:"
          type="number"
        />
      </FormControl>

      <FormControl>
        <TextField
          required
          id="outlined"
          placeholder="Enter..."
          label="Company:"
          type="text"
        />
      </FormControl>

      <FormControl>
        <FormGroup>
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="(login connected) Facebook:"
          />
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="(login connected) Google:"
          />
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="(login connected) Patreon:"
          />
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="(login connected) Twitch:"
          />
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="(login connected) Twitter:"
          />
        </FormGroup>
      </FormControl>

      <FormControl>
        <TextField
          required
          id="outlined"
          placeholder="Enter..."
          label="(links) Website URL::"
          type="url"
        />
      </FormControl>

      <FormControl>
        <TextField
          required
          id="outlined"
          placeholder="Enter..."
          label="(links) Blog URL::"
          type="url"
        />
      </FormControl>

      <FormControl>
        <TextField
          required
          id="outlined"
          placeholder="Enter..."
          label="(links) Social URL::"
          type="url"
        />
      </FormControl>

      <FormControl>
        <TextField
          required
          id="outlined"
          placeholder="Enter..."
          label="(links) Video/Streaming URL::"
          type="url"
        />
      </FormControl>

      <FormControl>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Label"
          />
          <FormControlLabel
            required
            control={<Checkbox />}
            label="Is Instructor:"
          />
          <FormControlLabel
            required
            control={<Checkbox />}
            label="Is Student:"
          />
          <FormControlLabel
            required
            control={<Checkbox />}
            label="Is Private Profile/User:"
          />
        </FormGroup>
      </FormControl>

      <FormControl>
        <FormLabel component="text">Calendar (google/outlook/Other):</FormLabel>
        <ToggleButtonGroup
          value={alignment}
          exclusive
          onChange={handleAlignment}
          aria-label="text alignment"
        >
          <ToggleButton value="left" aria-label="left aligned">
            <CalendarMonthIcon />
          </ToggleButton>
          <ToggleButton value="center" aria-label="centered">
            <DoNotDisturbIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </FormControl>

      <Grid container spacing={2} justifyContent="center" alignItems="center">
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
      </Grid>

      <TextField id="filled-basic" label="Pronouns:" variant="filled" />

      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">
          Timezone: for date time conversions
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
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

      <FormControl>
        <FormControlLabel
          label="Is Okay to Display Current Location?:"
          control={<Checkbox defaultChecked />}
        />
      </FormControl>

      <TextField
        id="filled-basic"
        label="EXPORT account info:"
        placeholder='Enter "email address" to send information'
        variant="filled"
      />

      <TextField
        id="filled-basic"
        label="DELETE account info:"
        placeholder='Type "DELETE" to confirm'
        variant="filled"
      />

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
    </Stack>
  )
}
