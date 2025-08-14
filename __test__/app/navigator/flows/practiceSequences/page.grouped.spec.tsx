import { render, screen } from '@testing-library/react'

// We need to mock before importing the Page component for flag variations
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(() => ({ get: jest.fn(() => null) })),
}))

jest.mock('@app/clientComponents/splash-header', () => ({
  __esModule: true,
  default: ({ title }: any) => <div data-testid="splash-header">{title}</div>,
}))

jest.mock('@app/clientComponents/sub-nav-header', () => ({
  __esModule: true,
  default: ({ title, link, onClick }: any) => (
    <div data-testid="sub-nav-header">
      <a href={link}>Back to {title}</a>
      <button onClick={onClick}>Help</button>
    </div>
  ),
}))

jest.mock('@serverComponents/navBottom', () => ({
  __esModule: true,
  default: ({ subRoute }: any) => (
    <div data-testid="nav-bottom">Navigation: {subRoute}</div>
  ),
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}))

jest.mock('@mui/icons-material/Search', () => ({
  __esModule: true,
  default: () => <div data-testid="search-icon" />,
}))

jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: { user: { email: 'me@example.com' } },
    status: 'authenticated',
  }),
}))

jest.mock('@lib/alphaUsers', () => ({
  getAlphaUserIds: () => ['alpha@example.com'],
}))

const sampleSequences = [
  {
    id: 1,
    nameSequence: 'Morning Flow',
    created_by: 'me@example.com',
    canonicalAsanaId: 1,
    sequencesSeries: [],
    description: '',
    duration: '',
    image: '',
    breath_direction: '',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 2,
    nameSequence: 'Evening Calm',
    created_by: 'alpha@example.com',
    canonicalAsanaId: 2,
    sequencesSeries: [],
    description: '',
    duration: '',
    image: '',
    breath_direction: '',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 3,
    nameSequence: 'Power Hour',
    created_by: 'other@example.com',
    canonicalAsanaId: 3,
    sequencesSeries: [],
    description: '',
    duration: '',
    image: '',
    breath_direction: '',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 4,
    nameSequence: 'Power Hour',
    created_by: 'other2@example.com',
    canonicalAsanaId: 3,
    sequencesSeries: [],
    description: '',
    duration: '',
    image: '',
    breath_direction: '',
    createdAt: '',
    updatedAt: '',
  },
]

jest.mock('@lib/sequenceService', () => ({
  getAllSequences: jest.fn(async () => sampleSequences),
}))

// Default: flag enabled
jest.mock('@app/FEATURES', () => ({
  FEATURES: { PRIORITIZE_USER_ENTRIES_IN_SEARCH: true },
}))

import Page from '@app/navigator/flows/practiceSequences/page'

describe('Practice Sequences page - grouped sections', () => {
  it('renders grouped list with user/alpha in top and deduped others when flag is on', async () => {
    render(<Page />)

    // Group headers
    expect(
      screen.getByRole('presentation', {
        name: 'Your Sequences',
      })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('presentation', { name: 'Others' })
    ).toBeInTheDocument()

    // Top shows 2 items
    expect(screen.getByText('Morning Flow')).toBeInTheDocument()
    expect(screen.getByText('Evening Calm')).toBeInTheDocument()

    // Others shows deduped Power Hour once
    const power = screen.getAllByText('Power Hour')
    expect(power.length).toBe(1)
  })
})

// Flag-off variant test in a separate block using isolated module registry
describe('Practice Sequences page - feature flag off', () => {
  it('does not render grouped list when feature flag is disabled', async () => {
    jest.resetModules()

    jest.doMock('@app/FEATURES', () => ({
      FEATURES: { PRIORITIZE_USER_ENTRIES_IN_SEARCH: false },
    }))
    jest.doMock('@lib/sequenceService', () => ({
      getAllSequences: jest.fn(async () => sampleSequences),
    }))
    jest.doMock('next-auth/react', () => ({
      useSession: () => ({
        data: { user: { email: 'me@example.com' } },
        status: 'authenticated',
      }),
    }))
    jest.doMock('@lib/alphaUsers', () => ({
      getAlphaUserIds: () => ['alpha@example.com'],
    }))
    jest.doMock('next/navigation', () => ({
      useSearchParams: jest.fn(() => ({ get: jest.fn(() => null) })),
    }))
    jest.doMock('@app/clientComponents/splash-header', () => ({
      __esModule: true,
      default: ({ title }: any) => (
        <div data-testid="splash-header">{title}</div>
      ),
    }))
    jest.doMock('@app/clientComponents/sub-nav-header', () => ({
      __esModule: true,
      default: ({ title, link, onClick }: any) => (
        <div data-testid="sub-nav-header">
          <a href={link}>Back to {title}</a>
          <button onClick={onClick}>Help</button>
        </div>
      ),
    }))
    jest.doMock('@serverComponents/navBottom', () => ({
      __esModule: true,
      default: ({ subRoute }: any) => (
        <div data-testid="nav-bottom">Navigation: {subRoute}</div>
      ),
    }))
    jest.doMock('next/image', () => ({
      __esModule: true,
      default: ({ src, alt }: any) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} />
      ),
    }))
    jest.doMock('@mui/icons-material/Search', () => ({
      __esModule: true,
      default: () => <div data-testid="search-icon" />,
    }))

    const PageFlagOff =
      require('@app/navigator/flows/practiceSequences/page').default
    render(<PageFlagOff />)

    expect(
      screen.queryByRole('presentation', {
        name: 'Your Sequences',
      })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('presentation', { name: 'Others' })
    ).not.toBeInTheDocument()
  })
})
