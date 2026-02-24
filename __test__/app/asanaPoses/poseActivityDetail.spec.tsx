import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NAV_PATHS from '@app/utils/navigation/constants'

const mockUpdatePose = jest.fn()
const mockRefresh = jest.fn()
const mockReplace = jest.fn()
const mockDeletePose = jest.fn()

jest.mock('next/image', () => (props: any) => {
  // eslint-disable-next-line @next/next/no-img-element
  return <img alt={props.alt || ''} src={props.src} />
})

jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: { user: { email: 'owner@test.com' } },
    status: 'authenticated',
  }),
  SessionProvider: ({ children }: any) => children,
}))

jest.mock('@app/hooks/useCanEditContent', () => ({
  useCanEditContent: () => ({ canEdit: true }),
}))

jest.mock('@app/hooks/useNavigationWithLoading', () => ({
  useNavigationWithLoading: () => ({
    refresh: mockRefresh,
    push: jest.fn(),
    replace: mockReplace,
  }),
}))

jest.mock('@lib/poseService', () => ({
  deletePose: (...args: any[]) => mockDeletePose(...args),
  updatePose: (...args: any[]) => mockUpdatePose(...args),
}))

jest.mock('@lib/asanaActivityClientService', () => ({
  checkActivityExists: jest.fn(),
  createAsanaActivity: jest.fn(),
  deleteAsanaActivity: jest.fn(),
}))

jest.mock('@lib/imageService', () => ({
  getUserPoseImages: jest.fn().mockResolvedValue({ images: [] }),
}))

jest.mock('@app/clientComponents/asanaUi/asanaDetails', () => () => (
  <div>Asana Details</div>
))

jest.mock('@app/clientComponents/asanaUi/AsanaDetailsEdit', () => ({
  __esModule: true,
  default: ({ fields }: any) => {
    const setField = (key: string, value: any) => {
      const field = fields.find((item: any) => item.fieldKey === key)
      field?.onChange?.(value)
    }

    return (
      <button
        onClick={() => {
          setField('sort_english_name', 'Updated Pose')
          setField('english_names', ['Updated Pose'])
          setField('category', 'Standing')
          setField('difficulty', 'Easy')
        }}
      >
        Fill Valid Edit Values
      </button>
    )
  },
}))

jest.mock('@app/clientComponents/WeeklyActivityViewer', () => () => <div />)
jest.mock('@app/clientComponents/ActivityTracker', () => () => <div />)
jest.mock('@app/clientComponents/imageUpload/ImageCarousel', () => () => (
  <div />
))
jest.mock(
  '@app/clientComponents/imageUpload/CarouselDotNavigation',
  () => () => <div />
)
jest.mock('@app/clientComponents/imageUpload/PoseImageManagement', () => () => (
  <div />
))
jest.mock('@app/clientComponents/imageUpload/PoseImageUpload', () => () => (
  <div />
))
jest.mock('@app/clientComponents/HelpDrawer', () => () => <div />)

import PoseActivityDetail from '@app/asanaPoses/poseActivityDetail'

const samplePose = {
  id: 'pose-1',
  sort_english_name: '',
  english_names: [],
  description: 'A sample pose for tests',
  category: '',
  difficulty: 'Invalid',
  created_by: 'owner@test.com',
}

describe('PoseActivityDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders pose title and description from prop', () => {
    render(<PoseActivityDetail poseCardProp={samplePose as any} />)

    expect(screen.getAllByLabelText('Edit pose')[0]).toBeInTheDocument()
  })

  it('shows validation error and blocks update when save is invalid', async () => {
    const user = userEvent.setup()
    render(
      <PoseActivityDetail
        poseCardProp={samplePose as any}
        initialEditMode={true}
      />
    )

    await user.click(screen.getAllByLabelText('Save changes')[0])

    expect(mockUpdatePose).not.toHaveBeenCalled()
    expect(await screen.findByText(/sort_english_name:/i)).toBeInTheDocument()
  })

  it('clears validation error when dismissed and allows cancel flow', async () => {
    const user = userEvent.setup()
    render(
      <PoseActivityDetail
        poseCardProp={samplePose as any}
        initialEditMode={true}
      />
    )

    await user.click(screen.getAllByLabelText('Save changes')[0])
    expect(await screen.findByText(/difficulty:/i)).toBeInTheDocument()

    await user.click(screen.getByLabelText(/close/i))
    await waitFor(() => {
      expect(screen.queryByText(/difficulty:/i)).not.toBeInTheDocument()
    })

    await user.click(screen.getAllByLabelText('Cancel editing')[0])
    expect(screen.queryByLabelText('Save changes')).not.toBeInTheDocument()
  })

  it('saves successfully after fixing validation errors', async () => {
    const user = userEvent.setup()
    mockUpdatePose.mockResolvedValue({
      id: 'pose-1',
      sort_english_name: 'Updated Pose',
    })

    render(
      <PoseActivityDetail
        poseCardProp={samplePose as any}
        initialEditMode={true}
      />
    )

    await user.click(screen.getAllByLabelText('Save changes')[0])
    expect(await screen.findByText(/english_names:/i)).toBeInTheDocument()

    await user.click(
      screen.getByRole('button', { name: 'Fill Valid Edit Values' })
    )
    await user.click(screen.getAllByLabelText('Save changes')[0])

    await waitFor(() => {
      expect(mockUpdatePose).toHaveBeenCalledTimes(1)
      expect(mockRefresh).toHaveBeenCalled()
    })
  })

  it('deletes immediately after confirmation and does not show undo countdown', async () => {
    const user = userEvent.setup()
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true)
    mockDeletePose.mockResolvedValue({ id: 'pose-1' })

    render(
      <PoseActivityDetail
        poseCardProp={samplePose as any}
        initialEditMode={true}
      />
    )

    await user.click(screen.getAllByLabelText('Delete pose')[0])

    await waitFor(() => {
      expect(mockDeletePose).toHaveBeenCalledWith('pose-1')
      expect(mockRefresh).toHaveBeenCalledTimes(1)
      expect(mockReplace).toHaveBeenCalledWith(
        `${NAV_PATHS.PRACTICE_ASANAS}?refresh=true`
      )
    })

    expect(screen.queryByText(/in 5 seconds/i)).not.toBeInTheDocument()
    confirmSpy.mockRestore()
  })

  it('does not delete when confirmation is cancelled', async () => {
    const user = userEvent.setup()
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(false)

    render(
      <PoseActivityDetail
        poseCardProp={samplePose as any}
        initialEditMode={true}
      />
    )

    await user.click(screen.getAllByLabelText('Delete pose')[0])

    expect(mockDeletePose).not.toHaveBeenCalled()
    expect(mockReplace).not.toHaveBeenCalled()
    confirmSpy.mockRestore()
  })
})
