import { Button, SxProps, Theme } from '@mui/material'
import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export interface SubNavHeaderProps {
  title?: string
  mode: 'back' | 'static'
  link?: string
  sx?: SxProps<Theme>
}

/**
 * SubNavHeader component renders a navigation header with a back button.
 * Use with HelpButton component for pages that need help functionality.
 *
 * @component
 * @param {SubNavHeaderProps} props - The properties for the SubNavHeader component.
 * @param {string} props.title - The title to be displayed on the back button.
 * @param {'back' | 'static'} props.mode - Navigation mode: 'back' uses browser history, 'static' navigates to a specific URL.
 * @param {string} [props.link] - The URL to navigate to when mode is 'static'. Required for 'static' mode.
 * @param {SxProps<Theme>} [props.sx] - Optional sx prop for custom styling of the container.
 *
 * @example
 * // Using back mode (browser history)
 * <SubNavHeader
 *   title="Dashboard"
 *   mode="back"
 * />
 *
 * @example
 * // Using static mode (specific URL)
 * <SubNavHeader
 *   title="Dashboard"
 *   mode="static"
 *   link="/dashboard"
 * />
 *
 * @example
 * // With HelpButton for help functionality
 * <Stack direction="row" justifyContent="space-between">
 *   <SubNavHeader mode="back" />
 *   <HelpButton onClick={() => setOpen(true)} />
 * </Stack>
 */
const SubNavHeader: React.FC<SubNavHeaderProps> = ({
  title,
  mode,
  link,
  sx,
}) => {
  const router = useRouter()

  const handleBackClick = () => {
    if (mode === 'back') {
      router.back()
    }
  }
  return (
    <Button
      variant="text"
      {...(mode === 'static' && link
        ? { href: link, LinkComponent: 'a' }
        : { onClick: handleBackClick })}
      sx={{
        alignSelf: 'flex-start',
        color: 'primary.contrastText',
        marginTop: 1,
        '&:hover': {
          backgroundColor: 'transparent',
          boxShadow: 'none',
        },
        ...sx,
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
  )
}

export default SubNavHeader
