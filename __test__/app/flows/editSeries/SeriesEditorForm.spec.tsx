import '@testing-library/jest-dom'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from '@styles/theme'
import SeriesEditorForm from '@app/flows/editSeries/SeriesEditorForm'

jest.mock('@app/clientComponents/SeriesImageManager', () => () => (
  <div data-testid="series-image-manager" />
))

jest.mock('@clientComponents/AddAsanasDialog', () => () => null)

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
)

describe('SeriesEditorForm', () => {
  const baseSeries = {
    id: 'series-1',
    name: 'Morning Flow',
    description: 'Wake up sequence',
    duration: '20 min',
    asanas: [
      {
        id: 'asana-1',
        name: 'Mountain Pose',
        alignment_cues: 'Stand tall',
        breathSeries: '',
      },
    ],
    created_by: 'user-1',
  }

  it('shows flow duration and does not show removed top-level fields', () => {
    render(
      <SeriesEditorForm
        series={baseSeries as any}
        mode="edit"
        onSave={jest.fn()}
      />,
      { wrapper: TestWrapper }
    )

    expect(screen.getByText('Flow Duration')).toBeInTheDocument()
    expect(screen.getByDisplayValue('20 min')).toBeInTheDocument()

    expect(screen.queryByText(/^Difficulty$/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/created by/i)).not.toBeInTheDocument()
  })

  it('renders breath cue selector options with labels', async () => {
    const user = userEvent.setup()
    render(
      <SeriesEditorForm
        series={baseSeries as any}
        mode="edit"
        onSave={jest.fn()}
      />,
      { wrapper: TestWrapper }
    )

    // Use aria-label for breath cue chips
    const inhaleChip = screen.getByLabelText(
      'Select Inhale breath cue for Mountain Pose'
    )
    const holdFullChip = screen.getByLabelText(
      'Select Hold full breath cue for Mountain Pose'
    )
    const exhaleChip = screen.getByLabelText(
      'Select Exhale breath cue for Mountain Pose'
    )
    const holdEmptyChip = screen.getByLabelText(
      'Select Hold empty breath cue for Mountain Pose'
    )

    expect(inhaleChip).toBeInTheDocument()
    expect(holdFullChip).toBeInTheDocument()
    expect(exhaleChip).toBeInTheDocument()
    expect(holdEmptyChip).toBeInTheDocument()
  })

  it('saves selected breathSeries and flow duration in payload', async () => {
    const user = userEvent.setup()
    const onSave = jest.fn()

    render(
      <SeriesEditorForm
        series={baseSeries as any}
        mode="edit"
        onSave={onSave}
      />,
      { wrapper: TestWrapper }
    )

    const exhaleChip = screen.getByLabelText(
      'Select Exhale breath cue for Mountain Pose'
    )
    await user.click(exhaleChip)

    const durationInput = screen.getByDisplayValue('20 min')
    await user.clear(durationInput)
    await user.type(durationInput, '30 min')

    await user.click(screen.getByRole('button', { name: 'Save Changes' }))

    expect(onSave).toHaveBeenCalledTimes(1)
    const saved = onSave.mock.calls[0][0]

    expect(saved.duration).toBe('30 min')
    expect(saved.asanas[0].breathSeries).toBe('Exhale')
  })
})
