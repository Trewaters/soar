import React from 'react'
import { render, screen } from '@testing-library/react'
import AsanaPoseProvider, { useAsanaPose } from '@app/context/AsanaPoseContext'

function Consumer() {
  const { state } = useAsanaPose()
  return <div data-testid="pose-name">{state.poses.sort_english_name}</div>
}

describe('AsanaPoseProvider hydration', () => {
  it('applies hydrated asana pose', async () => {
    const hydration = { asanaPose: { sort_english_name: 'Downward Dog' } }
    render(
      <AsanaPoseProvider hydration={hydration}>
        <Consumer />
      </AsanaPoseProvider>
    )

    const el = await screen.findByTestId('pose-name')
    expect(el.textContent).toBe('Downward Dog')
  })
})
