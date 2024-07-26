import EightLimbs from '@app/clientComponents/eight-limbs'
import { Box } from '@mui/material'

export default function Page() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      flexDirection="column"
    >
      <EightLimbs />
    </Box>
  )
}
