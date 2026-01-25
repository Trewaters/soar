import { Stack, Button, IconButton, SxProps, Theme } from '@mui/material'
import React, { ComponentProps } from 'react'
import HelpIcon from '@mui/icons-material/Help'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface SubNavHeaderProps extends ComponentProps<typeof IconButton> {
  title?: string
  mode: 'back' | 'static'
  link?: string
  sx?: SxProps<Theme>
}

/**
 * SubNavHeader component renders a navigation header with a back button and a help icon button.
 *
 * @component
 * @param {SubNavHeaderProps} props - The properties for the SubNavHeader component.
 * @param {string} props.title - The title to be displayed on the back button.
 * @param {'back' | 'static'} props.mode - Navigation mode: 'back' uses browser history, 'static' navigates to a specific URL.
 * @param {string} [props.link] - The URL to navigate to when mode is 'static'. Required for 'static' mode.
 * @param {function} [props.onClick] - Optional click handler for the help icon button.
 * @param {SxProps<Theme>} [props.sx] - Optional sx prop for custom styling of the container.
 *
 * @example
 * // Using back mode (browser history)
 * <SubNavHeader
 *   title="Dashboard"
 *   mode="back"
 *   onClick={() => console.log('Help icon clicked')}
 * />
 *
 * @example
 * // Using static mode (specific URL)
 * <SubNavHeader
 *   title="Dashboard"
 *   mode="static"
 *   link="/dashboard"
 *   onClick={() => console.log('Help icon clicked')}
 * />
 */
const SubNavHeader: React.FC<SubNavHeaderProps> = ({
  title,
  mode,
  link,
  sx,
  ...props
}) => {
  const router = useRouter()

  const handleBackClick = () => {
    if (mode === 'back') {
      router.back()
    }
  }
  return (
    <Stack
      direction={'row'}
      justifyContent={'space-between'}
      sx={{
        marginTop: 1,
        width: '100%',
        maxWidth: '384px', // Match SplashHeader default width
        alignSelf: 'center', // Center the component
        paddingX: 0, // Remove padding to align with image edges
        ...sx,
      }}
    >
      <Button
        variant="text"
        {...(mode === 'static' && link
          ? { href: link, LinkComponent: 'a' }
          : { onClick: handleBackClick })}
        sx={{
          alignSelf: 'flex-start',
          color: 'primary.contrastText',
          '&:hover': {
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
        }}
        startIcon={
          <>
            <Image
              width={18}
              height={18}
              src="/icons/sub-nav-header-back-arrow-icon.svg"
              alt="back arrow"
            />
          </>
        }
        disableRipple
      >
        {title ? `Back to ${title}` : 'BACK'}
      </Button>
      <IconButton disableRipple onClick={props.onClick}>
        <HelpIcon sx={{ color: 'success.light' }} />
      </IconButton>
    </Stack>
  )
}

export default SubNavHeader
