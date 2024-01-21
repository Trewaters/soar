'use client'
import React from 'react'
import { Box, IconButton, Menu, MenuItem, Stack } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'

export default function TopNav() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

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
          <MenuItem>
            <p>Planner</p>
          </MenuItem>
        </Menu>
      </Stack>
    </Box>
  )
}
