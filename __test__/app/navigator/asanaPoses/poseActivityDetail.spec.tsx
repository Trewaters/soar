import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'

// Mock next-auth session as unauthenticated by default
jest.mock('next-auth/react', () => ({
  useSession: () => ({ data: null, status: 'unauthenticated' }),
  SessionProvider: ({ children }: any) => children,
}))

// Mock can-edit hook
jest.mock('../../../../app/context/UserContext', () => ({
  useCanEditContent: () => ({ canEdit: false }),
}))

import PoseActivityDetail from '../../../../app/navigator/asanaPoses/poseActivityDetail'

const samplePose = {
  id: '6918f02c6acd4db7be385ad7',
  sort_english_name: 'Test Pose',
  english_names: ['Test Pose'],
  description: 'A sample pose for tests',
}

describe('PoseActivityDetail', () => {
  it('renders pose title and description from prop', () => {
    render(<PoseActivityDetail poseCardProp={samplePose as any} />)

    expect(screen.getByText(/Test Pose/i)).toBeInTheDocument()
    expect(screen.getByText(/A sample pose for tests/i)).toBeInTheDocument()
  })
})
