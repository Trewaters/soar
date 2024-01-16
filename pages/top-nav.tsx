'use client'
import React from 'react'
import { Box, IconButton, Menu, MenuItem, Stack } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import Link from 'next/link'

export default function TopNav() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
    // open <LandingPage />
  }

  const handleLogout = () => {}

  return (
    <Box>
      <Stack justifyContent="flex-start">
        <IconButton aria-label="menu" onClick={handleClick}>
          <MenuIcon sx={{ width: 42, height: 42 }} />
        </IconButton>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <Link href="/" passHref>
            <MenuItem onClick={handleClose}>Planner</MenuItem>
          </Link>
          <Link href="/" passHref>
            <MenuItem onClick={handleClose}>Posture Search</MenuItem>
          </Link>
          {/* Assuming Logout is a function, not a navigation */}
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Stack>
    </Box>
  )
}
