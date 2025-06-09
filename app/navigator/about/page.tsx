import Typography from '@mui/material/Typography'
import { Box } from '@mui/material'

export default function Page() {
  return (
    <>
      <Box sx={{ marginTop: 4, mx: 4 }} aria-labelledby="about">
        <Typography
          variant="body1"
          id="page-title"
          sx={{ marginBottom: 2, textAlign: 'center' }}
        >
          Yoga exercise app
        </Typography>

        <Typography variant="h6" component="h2">
          About uvuyoga
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 2 }}>
          Welcome to uvuyoga, your all-in-one yoga companion designed to guide
          practitioners of all levels along the transformative Eight-Limb Path
          of yoga. Whether you’re new to the mat or a seasoned yogi, uvuyoga
          provides a supportive space to explore asanas (postures), build
          dynamic flows, deepen your breathwork, and cultivate a holistic
          practice rooted in yogic tradition.
        </Typography>
        <Typography variant="h6" component="h2">
          Key Highlights
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
          Practice Made Easy:
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 2 }}>
          Access a growing library of asanas, flows, and sequences—complete with
          timing tools, safety cues, and posture breakdowns—so you can practice
          anytime, anywhere.
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
          Eight-Limb Path Reference:
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 2 }}>
          Dive deeper into yoga philosophy with quick references to each of the
          eight limbs, from Asana and Pranayama to Dhyana and Samadhi.
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
          Personalization:
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 2 }}>
          Create a profile, track progress, mark favorites, and record your own
          journey via journaling and practice planners.
        </Typography>
      </Box>
    </>
  )
}
