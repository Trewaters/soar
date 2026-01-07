import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import AutocompleteComponent from '@app/clientComponents/autocomplete-search'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'

const theme = createTheme()
const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
)

const options = [
  {
    id: 'p1',
    sort_english_name: 'Downward Dog',
    sanskrit_names: ['Adho Mukha Svanasana'],
  },
  {
    id: 'p2',
    sort_english_name: 'Warrior I',
    sanskrit_names: ['Virabhadrasana I'],
  },
]

describe('Autocomplete clear button', () => {
  it('shows clear button when typing and clears input on click', async () => {
    const user = userEvent.setup()
    render(
      <AutocompleteComponent
        options={options as any}
        placeholder="Search poses"
        renderInput={(params: any) => (
          <TextField {...params} placeholder="Search poses" />
        )}
      />,
      { wrapper: Wrapper }
    )

    // Find the input by placeholder
    const input = screen.getByPlaceholderText(
      'Search poses'
    ) as HTMLInputElement

    // Type into input
    await user.type(input, 'Down')

    // Clear button should appear
    const clearButton = await screen.findByLabelText('Clear search')
    expect(clearButton).toBeInTheDocument()

    // Click clear and assert input cleared
    await user.click(clearButton)

    await waitFor(() => {
      expect(input.value).toBe('')
    })
  })
})
