import { IconButton, SxProps, Theme } from '@mui/material'
import React from 'react'
import HelpIcon from '@mui/icons-material/Help'

export interface HelpButtonProps {
  onClick: () => void
  sx?: SxProps<Theme>
}

/**
 * HelpButton component renders a help icon button that triggers help content.
 * Typically used with HelpDrawer component for consistent help pattern.
 *
 * @component
 * @param {HelpButtonProps} props - The properties for the HelpButton component.
 * @param {function} props.onClick - Callback function when the help button is clicked.
 * @param {SxProps<Theme>} [props.sx] - Optional sx prop for custom styling.
 *
 * @example
 * // Basic usage with HelpDrawer
 * const [open, setOpen] = useState(false)
 *
 * <HelpButton onClick={() => setOpen(true)} />
 * <HelpDrawer open={open} onClose={() => setOpen(false)} helpText="..." />
 *
 * @example
 * // In a navigation header
 * <Stack direction="row" justifyContent="space-between">
 *   <SubNavHeader mode="back" />
 *   <HelpButton onClick={() => setOpen(true)} />
 * </Stack>
 */
const HelpButton: React.FC<HelpButtonProps> = ({ onClick, sx }) => {
  return (
    <IconButton disableRipple onClick={onClick} sx={sx}>
      <HelpIcon sx={{ color: 'success.light' }} />
    </IconButton>
  )
}

export default HelpButton
