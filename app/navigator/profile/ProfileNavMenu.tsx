'use client'
import React from 'react'
import {
  Box,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Avatar,
  Stack,
  Chip,
} from '@mui/material'
import {
  LibraryBooks as LibraryIcon,
  Edit as EditIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { UseUser } from '@context/UserContext'

interface ProfileNavMenuItem {
  id: string
  label: string
  icon: React.ReactNode
  href?: string
  action?: () => void
  disabled?: boolean
  badge?: string
}

const ProfileNavMenu: React.FC = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const {
    state: { userData },
  } = UseUser()

  const handleSignOut = async () => {
    try {
      await signOut({ redirectTo: '/auth/signout?success=true' })
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const menuItems: ProfileNavMenuItem[] = [
    {
      id: 'profile-overview',
      label: 'Profile Overview',
      icon: <PersonIcon />,
      href: '/navigator/profile',
    },
    {
      id: 'library',
      label: 'My Library',
      icon: <LibraryIcon />,
      href: '/navigator/profile/library',
      badge: 'New',
    },
    {
      id: 'edit-profile',
      label: 'Edit Profile',
      icon: <EditIcon />,
      href: '/navigator/profile',
    },
    {
      id: 'account-settings',
      label: 'Account Settings',
      icon: <SettingsIcon />,
      href: '/navigator/profile/settings',
      disabled: false, // Settings page is now available
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <DashboardIcon />,
      href: '/navigator',
    },
  ]

  const handleNavigation = (item: ProfileNavMenuItem) => {
    if (item.action) {
      item.action()
    } else if (item.href && !item.disabled) {
      router.push(item.href)
    }
  }

  if (!session) {
    return null
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        {/* Profile Header */}
        <Box
          sx={{ p: 3, bgcolor: 'primary.main', color: 'primary.contrastText' }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              src={userData?.image || session?.user?.image || undefined}
              sx={{ width: 60, height: 60 }}
            >
              {!userData?.image && !session?.user?.image && (
                <PersonIcon fontSize="large" />
              )}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                {userData?.name || session?.user?.name || 'Yoga Practitioner'}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {userData?.email || session?.user?.email}
              </Typography>
              {userData?.yogaStyle && (
                <Chip
                  label={userData.yogaStyle}
                  size="small"
                  sx={{
                    mt: 1,
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontSize: '0.75rem',
                  }}
                />
              )}
            </Box>
          </Stack>
        </Box>

        {/* Navigation Menu */}
        <List sx={{ p: 0 }}>
          {menuItems.map((item, index) => (
            <React.Fragment key={item.id}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => handleNavigation(item)}
                  disabled={item.disabled}
                  sx={{
                    py: 2,
                    px: 3,
                    '&:hover': {
                      bgcolor: 'primary.light',
                      color: 'primary.contrastText',
                    },
                    '&.Mui-disabled': {
                      opacity: 0.5,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: item.disabled ? 'text.disabled' : 'primary.main',
                      minWidth: 40,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontWeight: 500,
                        color: item.disabled ? 'text.disabled' : 'text.primary',
                      },
                    }}
                  />
                  {item.badge && (
                    <Chip
                      label={item.badge}
                      size="small"
                      color="secondary"
                      sx={{ fontSize: '0.7rem', height: 20 }}
                    />
                  )}
                  {item.disabled && (
                    <Chip
                      label="Coming Soon"
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.7rem', height: 20 }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
              {index < menuItems.length - 1 && <Divider />}
            </React.Fragment>
          ))}

          {/* Sign Out Section */}
          <Divider sx={{ my: 1 }} />
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleSignOut}
              sx={{
                py: 2,
                px: 3,
                '&:hover': {
                  bgcolor: 'error.light',
                  color: 'error.contrastText',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'error.main', minWidth: 40 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText
                primary="Sign Out"
                sx={{
                  '& .MuiListItemText-primary': {
                    fontWeight: 500,
                    color: 'error.main',
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Paper>
    </Box>
  )
}

export default ProfileNavMenu
