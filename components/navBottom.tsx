import { AppBar, IconButton, Toolbar } from '@mui/material'

export default function NavBottom() {
  return (
    <>
      <Toolbar
        sx={{ backgroundColor: 'white', alignSelf: 'center', borderRadius: 2 }}
      >
        <IconButton>Home</IconButton>
        <IconButton>User</IconButton>
        <IconButton>Bottom Burger</IconButton>
      </Toolbar>
    </>
  )
}
