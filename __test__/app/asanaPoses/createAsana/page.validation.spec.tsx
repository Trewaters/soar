import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mockPush = jest.fn()
const mockCreatePose = jest.fn()

jest.mock('@lib/poseService', () => ({
  createPose: (...args: any[]) => mockCreatePose(...args),
}))

jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: { user: { id: 'user-1', email: 'user@test.com' } },
    status: 'authenticated',
  }),
}))

jest.mock('@app/hooks/useNavigationWithLoading', () => ({
  useNavigationWithLoading: () => ({
    push: mockPush,
  }),
}))

jest.mock('@app/clientComponents/splash-header', () => {
  const React = require('react')
  const Mock = () => <div />
  Mock.displayName = 'SplashHeader'
  return Mock
})

jest.mock('@app/clientComponents/sub-nav-header', () => {
  const React = require('react')
  const Mock = () => <div />
  Mock.displayName = 'SubNavHeader'
  return Mock
})

jest.mock('@app/clientComponents/HelpButton', () => {
  const React = require('react')
  const Mock = () => <button>Help</button>
  Mock.displayName = 'HelpButton'
  return Mock
})

jest.mock('@app/clientComponents/HelpDrawer', () => {
  const React = require('react')
  const Mock = () => <div />
  Mock.displayName = 'HelpDrawer'
  return Mock
})

jest.mock('@app/clientComponents/freemiumNotification', () => ({
  FreemiumNotification: () => null,
  useFreemiumNotification: () => ({
    userAuthState: { isAuthenticated: true, hasPremiumAccess: true },
    checkFeatureAccess: () => ({ hasAccess: true }),
    handleCtaAction: jest.fn(),
  }),
}))

jest.mock('@app/clientComponents/imageUpload/ImageUploadWithFallback', () => {
  const React = require('react')
  return React.forwardRef(function MockUpload(_: any, ref: any) {
    React.useImperativeHandle(ref, () => ({
      saveStagedImages: jest.fn().mockResolvedValue(undefined),
    }))
    return <div />
  })
})

jest.mock('@lib/imageService', () => ({
  deletePoseImage: jest.fn(),
}))

jest.mock('@app/clientComponents/asanaUi/AsanaDetailsEdit', () => ({
  __esModule: true,
  default: ({ fields }: any) => {
    const setField = (key: string, value: any) => {
      const field = fields.find((item: any) => item.fieldKey === key)
      field?.onChange?.(value)
    }

    return (
      <div>
        <button
          onClick={() => {
            setField('sort_english_name', 'Warrior II')
            setField('english_names', ['Warrior II'])
            setField('category', 'Standing')
            setField('difficulty', 'Easy')
          }}
        >
          Fill Valid Values
        </button>
      </div>
    )
  },
}))

import CreateAsanaPage from '@app/asanaPoses/createAsana/page'

describe('Create Asana page validation feedback', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows validation error and blocks submit for invalid form', async () => {
    const user = userEvent.setup()
    render(<CreateAsanaPage />)

    await user.click(screen.getByRole('button', { name: 'Create Asana' }))

    // english_names is optional; expect required sort_english_name error
    expect(await screen.findByText(/sort_english_name:/i)).toBeInTheDocument()
    expect(mockCreatePose).not.toHaveBeenCalled()
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('dismisses error toast and submits successfully after fixing input', async () => {
    const user = userEvent.setup()
    mockCreatePose.mockResolvedValue({
      id: 'pose-1',
      sort_english_name: 'Warrior II',
    })

    render(<CreateAsanaPage />)

    await user.click(screen.getByRole('button', { name: 'Create Asana' }))
    // expect the required sort_english_name validation error (english_names optional)
    expect(await screen.findByText(/sort_english_name:/i)).toBeInTheDocument()

    await user.click(screen.getByLabelText(/close/i))
    await waitFor(() => {
      expect(screen.queryByText(/english_names:/i)).not.toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: 'Fill Valid Values' }))
    await user.click(screen.getByRole('button', { name: 'Create Asana' }))

    await waitFor(() => {
      expect(mockCreatePose).toHaveBeenCalledTimes(1)
      expect(mockPush).toHaveBeenCalledWith(
        '/asanaPoses/practiceAsanas?id=pose-1'
      )
    })
  })
})
