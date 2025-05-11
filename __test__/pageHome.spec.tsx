import { render } from '@testing-library/react'
import * as navigation from 'next/navigation'
import Home from '@app/page'

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}))

describe('Home', () => {
  it('should call redirect to /navigator', () => {
    const redirectMock = jest.spyOn(navigation, 'redirect')
    render(<Home />) // Ensure JSX is properly parsed
    expect(redirectMock).toHaveBeenCalledWith('/navigator')
  })
})
