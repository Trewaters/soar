import { render, screen } from '@testing-library/react'
import Home from '@app/page'

jest.mock('@app/navigator/page', () => {
  return function MockNavigatorHome() {
    return <div>home-page-content</div>
  }
})

describe('Home', () => {
  it('should render home page content at root', () => {
    render(<Home />)
    expect(screen.getByText('home-page-content')).toBeInTheDocument()
  })
})
