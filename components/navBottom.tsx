'use client'
import React, { useState, useEffect } from 'react'
import { Box, IconButton } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import PersonIcon from '@mui/icons-material/Person'
import HomeIcon from '@mui/icons-material/Home'
import DashboardIcon from '@mui/icons-material/Dashboard'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import { useNavigationWithLoading } from '@app/hooks/useNavigationWithLoading'
import { useSession } from 'next-auth/react'
import { usePathname, useSearchParams } from 'next/navigation'
import ShareAsset from '@app/clientComponents/ShareAsset'
import { getPose } from '@lib/poseService'
import { getSingleSeries } from '@lib/seriesService'
import { getSingleSequence } from '@lib/sequenceService'
import { ShareableContent } from 'types/sharing'

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
type ColorFunction = (isAuthenticated: boolean) => string

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
  path: string | (() => string) | 'menu'
  getColor: ColorFunction
}

export default function NavBottom(props: {
  subRoute: string
  onMenuToggle?: () => void
}) {
  const router = useNavigationWithLoading()
  const { status } = useSession()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isAuthenticated = status === 'authenticated'

  const [shareContent, setShareContent] = useState<ShareableContent | null>(
    null
  )

  useEffect(() => {
    const fetchAssetData = async () => {
      // Get params from searchParams or window location if needed
      const id =
        searchParams.get('id') ||
        new URLSearchParams(window.location.search).get('id')
      const sequenceId =
        searchParams.get('sequenceId') ||
        new URLSearchParams(window.location.search).get('sequenceId')

      try {
        if (
          (pathname.includes('/asanaPoses/practiceAsanas') ||
            pathname.includes('/asanaPoses')) &&
          id
        ) {
          const pose = await getPose(id)
          if (pose) {
            setShareContent({ contentType: 'asana', data: pose })
            return
          }
        }

        if (
          (pathname.includes('/flows/practiceSeries') ||
            pathname.includes('/flows')) &&
          id
        ) {
          const series = await getSingleSeries(id)
          if (series) {
            setShareContent({ contentType: 'flow', data: series })
            return
          }
        }

        if (pathname.includes('/flows/practiceSequences') && sequenceId) {
          const sequence = await getSingleSequence(sequenceId)
          if (sequence) {
            setShareContent({ contentType: 'sequence', data: sequence })
            return
          }
        }

        setShareContent(null)
      } catch (error) {
        setShareContent(null)
      }
    }

    fetchAssetData()
  }, [pathname, searchParams])

  // Check if we're in the profile section
  const isInProfileSection = pathname?.includes('/profile')

  // Check if we're on the dashboard page
  const isOnDashboard = pathname === '/profile/dashboard'

  const navItems: NavItem[] = [
    {
      id: 'menu',
      label: 'Open main navigation menu',
      icon: <MenuIcon />,
      path: 'menu',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
      getColor: (_isAuthenticated: boolean) => 'primary.main', // Always primary.main
    },
    {
      id: 'profile',
      label: isInProfileSection
        ? 'Navigate to home page'
        : isAuthenticated
          ? 'Navigate to user profile'
          : 'Login to access profile',
      icon: isInProfileSection ? <HomeIcon /> : <PersonIcon />,
      path: isInProfileSection
        ? '/'
        : isAuthenticated
          ? '/profile'
          : '/auth/signin',
      getColor: (isAuthenticated: boolean) =>
        isAuthenticated ? 'success.main' : 'grey.500', // Green when logged in, gray when logged out
    },
    {
      id: isOnDashboard ? 'library' : 'dashboard',
      label: isOnDashboard
        ? isAuthenticated
          ? 'Navigate to library'
          : 'Login to access library'
        : isAuthenticated
          ? 'Navigate to dashboard'
          : 'Login to access dashboard',
      icon: isOnDashboard ? (
        <LibraryBooksIcon aria-hidden="true" />
      ) : (
        <DashboardIcon aria-hidden="true" />
      ),
      path: isOnDashboard
        ? isAuthenticated
          ? '/profile/library'
          : '/auth/signin'
        : isAuthenticated
          ? '/profile/dashboard'
          : '/auth/signin',
      getColor: (isAuthenticated: boolean) =>
        isAuthenticated ? 'primary.main' : 'grey.500', // Primary when logged in, gray when logged out
    },
  ]

  const handleNavigation = (
    path: string | (() => string) | 'menu',
    itemId?: string
  ) => {
    // Handle menu toggle specially
    if (itemId === 'menu' || path === 'menu') {
      if (props.onMenuToggle) {
        props.onMenuToggle()
      }
      return
    }

    // Handle regular navigation
    const targetPath = typeof path === 'function' ? path() : path
    // Provide an elementId so the NavigationLoadingProvider can track
    // bottom-nav initiated navigations separately and avoid races.
    const elementId = `nav-bottom-${itemId || 'item'}`
    router.push(targetPath, elementId)
  }

  return (
    <Box
      component="nav"
      aria-label="Bottom navigation"
      sx={{
        position: 'fixed',
        backgroundColor: 'info.contrastText',
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0,
        width: '100vw',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 2,
        top: 'auto !important',
        bottom: '0 !important',
        left: '0',
        right: 'auto',
        height: '66px',
        zIndex: (theme) => theme.zIndex.appBar,
        justifySelf: 'center',
      }}
    >
      {navItems.map((item) => {
        // Replace middle button (profile) with ShareAsset if shareContent is available
        if (shareContent && item.id === 'profile') {
          return (
            <ShareAsset
              key="share"
              content={shareContent}
              color="success.main"
              size="medium"
              sx={{
                '&:focus': {
                  outline: 'none',
                },
                '&:focus-visible': {
                  outline: '2px solid',
                  outlineColor: 'primary.main',
                  outlineOffset: '2px',
                },
              }}
            />
          )
        }

        return (
          <IconButton
            key={item.id}
            disableRipple
            disableFocusRipple
            disableTouchRipple
            aria-label={item.label}
            title={item.label}
            role="button"
            onClick={() => handleNavigation(item.path, item.id)}
            sx={{
              color: item.getColor(isAuthenticated),
              '&:focus': {
                outline: 'none', // Remove focus outline
              },
              '&:focus-visible': {
                outline: '2px solid',
                outlineColor: 'primary.main',
                outlineOffset: '2px',
              },
              '&.Mui-disabled': {
                color: item.getColor(isAuthenticated), // Use dynamic color even when disabled
              },
            }}
          >
            {React.cloneElement(item.icon as React.ReactElement, {
              sx: { color: item.getColor(isAuthenticated) },
            })}
          </IconButton>
        )
      })}
    </Box>
  )
}
