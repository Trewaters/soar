// Centralized navigation path constants
export const NAV_PATHS = {
  // Base path for asana pose pages. Update here to change site-wide URLs.
  // Match the actual app folder names (asanaPoses) to avoid 404s
  ASANA_POSES: '/navigator/asanaPoses',
  // Page that accepts query params like `?id=...` or `?name=...`
  PRACTICE_ASANAS: '/navigator/asanaPoses/practiceAsanas',
  CREATE_ASANA: '/navigator/asanaPoses/createAsana',
  // Flows practice page (uses ?id=...)
  FLOWS_PRACTICE_SERIES: '/navigator/flows/practiceSeries',
  // Sequences base path (id in path)
  SEQUENCES: '/navigator/sequences',
  COMPLIANCE_TERMS_SERVICE: '/compliance/terms',
}

export default NAV_PATHS
