import { describe, expect, test } from '@jest/globals'
import '@testing-library/jest'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Page from '../app/navigator/page'

// Mock the necessary components
jest.mock('@app/clientComponents/current-time', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-current-time">Current Time Mock</div>,
}))

jest.mock('@app/clientComponents/tab-header', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-tab-header">Tab Header Mock</div>,
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => (
    <div {...props} data-testid="mock-image">
      Mock image
    </div>
  ),
}))

describe('Navigator page', () => {
  test('renders the page with correct elements', () => {
    render(<Page />)

    // Check if the main elements are rendered
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByTestId('mock-image')).toBeInTheDocument()
    expect(screen.getByText('yoga exercise')).toBeInTheDocument()
    expect(screen.getByTestId('mock-current-time')).toBeInTheDocument()
    expect(screen.getByTestId('mock-tab-header')).toBeInTheDocument()
  })
})
