import React from 'react'
import { render, screen } from '@testing-library/react'
import FlowSeriesProvider, {
  useFlowSeries,
} from '@app/context/AsanaSeriesContext'

function Consumer() {
  const { state } = useFlowSeries()
  return <div data-testid="series-name">{state.flowSeries.seriesName}</div>
}

describe('FlowSeriesProvider hydration', () => {
  it('applies hydrated flow series', async () => {
    const hydration = { flowSeries: { seriesName: 'Morning Flow' } }
    render(
      <FlowSeriesProvider hydration={hydration}>
        <Consumer />
      </FlowSeriesProvider>
    )

    const el = await screen.findByTestId('series-name')
    expect(el.textContent).toBe('Morning Flow')
  })
})
