import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, createTheme } from '@mui/material/styles'

import ShareAsset from '@app/clientComponents/ShareAsset'
import {
  SeriesShareStrategy,
  SequenceShareStrategy,
} from '../../../types/sharing'

// Mock the resolver to return canonical ids quickly
jest.mock('@app/utils/shareIdResolver', () => ({
  resolveSeriesCanonical: jest.fn(async (d: any) => ({
    ...(d || {}),
    id: d?.id ?? 'resolved-series-id',
  })),
  resolveSequenceCanonical: jest.fn(async (d: any) => ({
    ...(d || {}),
    id: d?.id ?? 'resolved-sequence-id',
  })),
}))

const theme = createTheme()
const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

describe('Share strategies', () => {
  it('SeriesShareStrategy includes ?id= when data.id present', () => {
    const strat = new SeriesShareStrategy()
    const out = strat.generateShareConfig({
      id: '42',
      seriesName: 'S',
      seriesPoses: ['P1;desc'],
    } as any)
    expect(out.url).toContain('?id=42')
  })

  it('SequenceShareStrategy includes ?sequenceId= when data.id present', () => {
    const strat = new SequenceShareStrategy()
    const out = strat.generateShareConfig({
      id: '99',
      nameSequence: 'Morning',
      sequencesSeries: [],
      description: '',
      durationSequence: '',
    } as any)
    expect(out.url).toContain('?sequenceId=99')
  })
})

describe('ShareAsset component', () => {
  beforeEach(() => {
    // reset navigator mocks between tests
    ;(global as any).navigator = { ...(global as any).navigator }
    delete (global as any).navigator.share
    delete (global as any).navigator.canShare
    delete (global as any).navigator.clipboard
  })

  it('copies composed payload to clipboard when native share unavailable', async () => {
    // no navigator.share -> clipboard path
    ;(global as any).navigator.clipboard = {
      writeText: jest.fn().mockResolvedValue(undefined),
    }

    const seq = {
      nameSequence: 'Flow X',
      sequencesSeries: [],
      description: 'desc',
      durationSequence: '10m',
    }

    render(
      <ShareAsset content={{ contentType: 'sequence', data: seq } as any} />,
      { wrapper: Wrapper }
    )

    const btn = screen.getByRole('button', { name: /Share this sequence/i })
    await userEvent.click(btn)

    await waitFor(() => {
      expect((navigator as any).clipboard.writeText).toHaveBeenCalled()
    })

    const calledWith = (navigator as any).clipboard.writeText.mock.calls[0][0]
    expect(calledWith).toContain('Practice with Uvuyoga')
    expect(calledWith).toContain('?sequenceId=resolved-sequence-id')
  })

  it('uses provided custom text when allowCustomText is enabled (clipboard)', async () => {
    ;(global as any).navigator.clipboard = {
      writeText: jest.fn().mockResolvedValue(undefined),
    }

    const seq = {
      nameSequence: 'Flow X',
      sequencesSeries: [],
      description: 'desc',
      durationSequence: '10m',
    }

    render(
      <ShareAsset
        content={{ contentType: 'sequence', data: seq } as any}
        allowCustomText={true}
        defaultMessage={'Hi friend, try this flow'}
      />,
      { wrapper: Wrapper }
    )

    // input should be present with the initial text
    const input = screen.getByLabelText(/Share this sequence message/i)
    expect((input as HTMLInputElement).value).toBe('Hi friend, try this flow')

    const btn = screen.getByRole('button', { name: /Share this sequence/i })
    await userEvent.click(btn)

    await waitFor(() => {
      expect((navigator as any).clipboard.writeText).toHaveBeenCalled()
    })

    const calledWith = (navigator as any).clipboard.writeText.mock.calls[0][0]
    expect(calledWith).toContain('Hi friend, try this flow')
  })

  it('uses native navigator.share when available and shows success snackbar', async () => {
    const shareMock = jest.fn().mockResolvedValue(undefined)
    ;(global as any).navigator.share = shareMock

    const seq = {
      nameSequence: 'Flow Y',
      sequencesSeries: [],
      description: 'desc',
      durationSequence: '5m',
    }

    render(
      <ShareAsset content={{ contentType: 'sequence', data: seq } as any} />,
      { wrapper: Wrapper }
    )

    const btn = screen.getByRole('button', { name: /Share this sequence/i })
    await userEvent.click(btn)

    await waitFor(() => expect(shareMock).toHaveBeenCalled())

    // assert native share was called with payload containing canonical id
    expect(shareMock).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining('?sequenceId=resolved-sequence-id'),
      })
    )

    // Snackbar text for success
    await waitFor(() =>
      expect(screen.getByText('Shared successfully')).toBeInTheDocument()
    )
  })

  it('uses provided custom text when allowCustomText is enabled (native)', async () => {
    const shareMock = jest.fn().mockResolvedValue(undefined)
    ;(global as any).navigator.share = shareMock

    const seq = {
      nameSequence: 'Flow Y',
      sequencesSeries: [],
      description: 'desc',
      durationSequence: '5m',
    }

    render(
      <ShareAsset
        content={{ contentType: 'sequence', data: seq } as any}
        allowCustomText={true}
        defaultMessage={'Custom native message'}
      />,
      { wrapper: Wrapper }
    )

    const btn = screen.getByRole('button', { name: /Share this sequence/i })
    await userEvent.click(btn)

    await waitFor(() => expect(shareMock).toHaveBeenCalled())

    expect(shareMock).toHaveBeenCalledWith(
      expect.objectContaining({
        text: expect.stringContaining('Custom native message'),
      })
    )
  })

  it('does not call navigator.canShare for non-file payloads', async () => {
    const shareMock = jest.fn().mockResolvedValue(undefined)
    const canShareMock = jest.fn()
    ;(global as any).navigator.share = shareMock
    ;(global as any).navigator.canShare = canShareMock

    const series = { seriesName: 'S', seriesPoses: ['P1;desc'] }
    render(
      <ShareAsset content={{ contentType: 'series', data: series } as any} />,
      { wrapper: Wrapper }
    )

    const btn = screen.getByRole('button', { name: /Share this series/i })
    await userEvent.click(btn)

    await waitFor(() => expect(shareMock).toHaveBeenCalled())
    expect(canShareMock).not.toHaveBeenCalled()
  })

  it('renders aria-labels appropriate to contentType', () => {
    render(
      <ShareAsset
        content={
          {
            contentType: 'asana',
            data: { sort_english_name: 'Pose' } as any,
          } as any
        }
      />,
      { wrapper: Wrapper }
    )
    expect(
      screen.getByRole('button', { name: /Share this pose/i })
    ).toBeInTheDocument()
  })
})
