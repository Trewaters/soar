import { Stack, Button, IconButton } from '@mui/material'
import React, { ComponentProps } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import HelpIcon from '@mui/icons-material/Help'

interface SubNavHeaderProps extends ComponentProps<typeof IconButton> {
  title: string
  link: string
}

/**
 * SubNavHeader component renders a navigation header with a back button and a help icon button.
 *
 * @component
 * @param {SubNavHeaderProps} props - The properties for the SubNavHeader component.
 * @param {string} props.title - The title to be displayed on the back button.
 * @param {string} props.link - The URL to navigate to when the back button is clicked.
 * @param {function} [props.onClick] - Optional click handler for the help icon button.
 *
 * @example
 * <SubNavHeader
 *   title="Dashboard"
 *   link="/dashboard"
 *   onClick={() => console.log('Help icon clicked')}
 * />
 */
const SubNavHeader: React.FC<SubNavHeaderProps> = ({
  title,
  link,
  ...props
}) => {
  return (
    <Stack direction={'row'} justifyContent={'space-between'}>
      <Button
        variant="text"
        href={link}
        LinkComponent="a"
        sx={{
          my: 3,
          alignSelf: 'flex-start',
          color: 'primary.contrastText',
          '&:hover': {
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
        }}
        startIcon={<ArrowBackIcon />}
        disableRipple
      >
        Back to {title}
      </Button>
      <IconButton disableRipple onClick={props.onClick}>
        <HelpIcon sx={{ color: 'info.light' }} />
      </IconButton>
    </Stack>
  )
}

export default SubNavHeader
