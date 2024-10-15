import { Stack, Button, IconButton } from '@mui/material'
import React, { ComponentProps } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import HelpIcon from '@mui/icons-material/Help'

interface SubNavHeaderProps extends ComponentProps<typeof IconButton> {
  title: string
  link: string
}

const SubNavHeader: React.FC<SubNavHeaderProps> = ({
  title,
  link,
  ...props
}) => {
  return (
    // <div className="sub-nav-header">
    //   <h2>{title}</h2>
    //   <nav>
    //     <ul>
    //       {links.map((link, index) => (
    //         <li key={index}>
    //           <a href={link.href}>{link.name}</a>
    //         </li>
    //       ))}
    //     </ul>
    //   </nav>
    // </div>
    <Stack
      direction={'row'}
      gap={2}
      justifyContent={'space-between'}
      sx={{ px: 4, mt: 3 }}
    >
      <Button
        variant="text"
        // href="/navigator/flows"
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
