import { Stack, Button, IconButton, SxProps, Theme } from '@mui/material'
import React, { ComponentProps } from 'react'
import HelpIcon from '@mui/icons-material/Help'
import Image from 'next/image'

interface SubNavHeaderProps extends ComponentProps<typeof IconButton> {
  title: string
  link: string
  sx?: SxProps<Theme>
}

/**
 * SubNavHeader component renders a navigation header with a back button and a help icon button.
 *
 * @component
 * @param {SubNavHeaderProps} props - The properties for the SubNavHeader component.
 * @param {string} props.title - The title to be displayed on the back button.
 * @param {string} props.link - The URL to navigate to when the back button is clicked.
 * @param {function} [props.onClick] - Optional click handler for the help icon button.
 * @param {SxProps<Theme>} [props.sx] - Optional sx prop for custom styling of the container.
 *
 * @example
 * <SubNavHeader
 *   title="Dashboard"
 *   link="/dashboard"
 *   onClick={() => console.log('Help icon clicked')}
 *   sx={{ paddingLeft: 1, paddingRight: 1 }}
 * />
 */
const SubNavHeader: React.FC<SubNavHeaderProps> = ({
  title,
  link,
  sx,
  ...props
}) => {
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
        href={link}
        LinkComponent="a"
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
        Back to {title}
      </Button>
      <IconButton disableRipple onClick={props.onClick}>
        <HelpIcon sx={{ color: 'success.light' }} />
      </IconButton>
    </Stack>
  )
}

export default SubNavHeader
