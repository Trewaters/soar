import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@mui/material/styles'
import theme from '@styles/theme'
import SequenceFlowCard from '@app/clientComponents/SequenceFlowCard'

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

describe('SequenceFlowCard', () => {
  it('should render flow title and rich pose list', () => {
    render(
      <SequenceFlowCard
        seriesName="Morning Flow"
        seriesPoses={[
          {
            sort_english_name: 'Mountain Pose',
            secondary: 'Tadasana',
            alignment_cues: 'Stand tall',
            breathSeries: 'Inhale',
          },
        ]}
      />,
      { wrapper: Wrapper }
    )

    expect(screen.getByText('Morning Flow')).toBeInTheDocument()
    expect(screen.getByText('Mountain Pose')).toBeInTheDocument()
    expect(screen.getByText('Tadasana')).toBeInTheDocument()
    expect(screen.getByText('(Stand tall)')).toBeInTheDocument()
    expect(
      screen.getByTestId('sequence-flow-card-pose-0-breath-icon')
    ).toBeInTheDocument()
  })

  it('should render stale indicator and disabled semantics', () => {
    render(
      <SequenceFlowCard seriesName="Archived Flow" seriesPoses={[]} isStale />,
      { wrapper: Wrapper }
    )

    expect(
      screen.getByText(/Removed — no longer available/i)
    ).toBeInTheDocument()
    expect(screen.getByTestId('sequence-flow-card-card')).toHaveAttribute(
      'aria-disabled',
      'true'
    )
  })

  it('should invoke click callback when card is clicked', async () => {
    const user = userEvent.setup()
    const onSeriesClick = jest.fn()

    render(
      <SequenceFlowCard
        seriesName="Clickable Flow"
        seriesPoses={[]}
        onSeriesClick={onSeriesClick}
      />,
      { wrapper: Wrapper }
    )

    await user.click(screen.getByTestId('sequence-flow-card-card'))
    expect(onSeriesClick).toHaveBeenCalledTimes(1)
  })
})
