import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ThemeProvider } from '@mui/material/styles'
import { SearchField } from '@app/clientComponents/form'
import theme from '@styles/theme'

describe('SearchField', () => {
  it('renders with placeholder and shows clear button when value present', () => {
    const handleChange = jest.fn()
    const handleClear = jest.fn()

    render(
      <ThemeProvider theme={theme}>
        <SearchField
          value="hello"
          onChange={handleChange}
          onClear={handleClear}
          placeholder="Search here"
        />
      </ThemeProvider>
    )

    const input = screen.getByPlaceholderText('Search here') as HTMLInputElement
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue('hello')

    const clearButton = screen.getByTestId('clear-search-button')
    expect(clearButton).toBeInTheDocument()

    fireEvent.click(clearButton)
    expect(handleClear).toHaveBeenCalled()
  })

  it('does not show clear button when value is empty', () => {
    const handleChange = jest.fn()
    const handleClear = jest.fn()

    render(
      <ThemeProvider theme={theme}>
        <SearchField value="" onChange={handleChange} onClear={handleClear} />
      </ThemeProvider>
    )

    const input = screen.getByPlaceholderText('Search...') as HTMLInputElement
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue('')

    expect(screen.queryByTestId('clear-search-button')).toBeNull()
  })
})
