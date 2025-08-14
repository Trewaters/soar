import '@testing-library/jest-dom'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PostureSearch from '@app/navigator/asanaPostures/posture-search'
import React from 'react'

jest.mock('next/navigation')
jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: { user: { id: 'user-1', email: 'user1@email.com' } },
  }),
}))
jest.mock('@/app/context/AsanaPostureContext', () => ({
  useAsanaPosture: () => ({ state: { postures: [] }, dispatch: jest.fn() }),
}))
jest.mock('@app/lib/alphaUsers', () => () => ['alpha-1'])

const samplePostures = [
  {
    id: 'pose-1',
    sort_english_name: 'Cobra',
    created_by: 'user-1',
    displayName: 'Cobra',
    label: 'Cobra',
  },
  {
    id: 'pose-2',
    sort_english_name: 'Downward Dog',
    created_by: 'alpha-1',
    displayName: 'Downward Dog',
    label: 'Downward Dog',
  },
  {
    id: 'pose-3',
    sort_english_name: 'Triangle',
    created_by: 'other-1',
    displayName: 'Triangle',
    label: 'Triangle',
  },
]

describe('PostureSearch order', () => {
  it('shows user-created poses at the top, then alpha, then others', async () => {
    render(<PostureSearch posturePropData={samplePostures as any} />)
    // Open the dropdown
    const input = screen.getByPlaceholderText('Search for a Yoga Posture')
    await userEvent.click(input)
    // All options should be visible in order
    const options = screen.getAllByRole('option')
    expect(options[0]).toHaveTextContent('Cobra') // user pose
    expect(options[1]).toHaveTextContent('Downward Dog') // alpha pose
    expect(options[2]).toHaveTextContent('Triangle') // other pose
  })
})
