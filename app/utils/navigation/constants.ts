// Centralized navigation path constants
export const NAV_PATHS = {
  // Base path for asana pose pages. Update here to change site-wide URLs.
  // Match the actual app folder names (asanaPoses) to avoid 404s
  ASANA_POSES: '/asanaPoses',
  // Page that accepts query params like `?id=...` or `?name=...`
  PRACTICE_ASANAS: '/asanaPoses/practiceAsanas',
  CREATE_ASANA: '/asanaPoses/createAsana',
  // Flows practice page (uses ?id=...)
  FLOWS: '/flows',
  FLOWS_PRACTICE_SERIES: '/flows/practiceSeries',
  FLOWS_PRACTICE_SEQUENCES: '/flows/practiceSequences',
  FLOWS_CREATE_SERIES: '/flows/createSeries',
  FLOWS_CREATE_SEQUENCE: '/flows/createSequence',
  // Sequences base path (id in path)
  SEQUENCES: '/sequences',
  PROFILE: '/profile',
  PROFILE_DASHBOARD: '/profile/dashboard',
  PROFILE_LIBRARY: '/profile/library',
  ABOUT: '/about',
  EIGHT_LIMBS: '/eightLimbs',
  GLOSSARY: '/glossary',
  COMPLIANCE_TERMS_SERVICE: '/compliance/terms',
  VIEW_ASANA_PRACTICE: '/views/viewAsanaPractice',
}

export default NAV_PATHS
