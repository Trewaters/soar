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
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Home,
} from '@mui/icons-material'
import { useSession, signOut } from 'next-auth/react'
import { useNavigationWithLoading } from '@app/hooks/useNavigationWithLoading'
import { UseUser } from '@context/UserContext'
import { useActiveProfileImage } from '@app/hooks/useActiveProfileImage'
import { AppText } from '../constants/Strings'
import Image from 'next/image'

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
  const router = useNavigationWithLoading()
  const {
    state: { userData },
  } = UseUser()
  const { activeImage, isPlaceholder } = useActiveProfileImage()

  // Get current pathname for highlighting
  const [currentPath, setCurrentPath] = React.useState<string>('')
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname)
    }
  }, [])

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
      // badge: 'New',
    },
    {
      id: 'account-settings',
      label: 'Account Settings',
      icon: <SettingsIcon />,
      href: '/navigator/profile/settings',
      disabled: false, // Settings page is now available
    },
    {
      id: 'home',
      label: 'Home Page',
      icon: <Home />,
      href: '/navigator',
    },
  ]

  const handleNavigation = (item: ProfileNavMenuItem) => {
    if (item.action) {
      item.action()
    } else if (item.href && !item.disabled) {
      router.push(item.href)
      setCurrentPath(item.href)
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
              src={isPlaceholder ? undefined : activeImage}
              sx={{ width: 60, height: 60 }}
            >
              {isPlaceholder && (
                <Image
                  src="/icons/profile/profile-person.svg"
                  width={36}
                  height={36}
                  alt="Default profile icon"
                />
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
          {menuItems.map((item, index) => {
            const isSelected = !!item.href && currentPath === item.href
            return (
              <React.Fragment key={item.id}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => handleNavigation(item)}
                    disabled={item.disabled}
                    selected={Boolean(isSelected)}
                    sx={{
                      py: 2,
                      px: 3,
                      bgcolor: isSelected ? 'primary.light' : undefined,
                      color: isSelected ? 'primary.contrastText' : undefined,
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
                        color: item.disabled
                          ? 'text.disabled'
                          : isSelected
                            ? 'primary.dark'
                            : 'primary.main',
                        minWidth: 40,
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      sx={{
                        '& .MuiListItemText-primary': {
                          fontWeight: 600,
                          color: item.disabled
                            ? 'text.disabled'
                            : isSelected
                              ? 'primary.dark'
                              : 'text.primary',
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
            )
          })}

          {/* Logout Section */}
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
                primary={AppText.APP_LOGOUT}
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
