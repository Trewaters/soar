import React from 'react'
import { render, screen } from '@testing-library/react'
import UserStateProvider, { UseUser } from '@app/context/UserContext'

function Consumer() {
  const { state } = UseUser()
  return <div data-testid="user-email">{state.userData.email}</div>
}

describe('UserStateProvider hydration', () => {
  it('applies hydrated user state', async () => {
    const hydration = { userState: { id: 'u1', email: 'test@example.com' } }
    render(
      <UserStateProvider hydration={hydration}>
        <Consumer />
      </UserStateProvider>
    )

    const el = await screen.findByTestId('user-email')
    expect(el.textContent).toBe('test@example.com')
  })
})
