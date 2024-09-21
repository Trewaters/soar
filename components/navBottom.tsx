import { AppBar, IconButton, Toolbar } from '@mui/material'

export default function NavBottom() {
  return (
    <>
      <Toolbar
        sx={{ backgroundColor: 'white', alignSelf: 'center', borderRadius: 2 }}
      >
        <IconButton disableRipple>Home</IconButton>
        <IconButton disableRipple>User</IconButton>
        <IconButton disableRipple>Bottom Burger</IconButton>
      </Toolbar>
    </>
  )
}
