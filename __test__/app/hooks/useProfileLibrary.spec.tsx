import React from 'react'
import { render, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useProfileLibrary } from '@app/hooks/useProfileLibrary'

// Mock fetch globally
const mockFetch = jest.fn()
;(global as any).fetch = mockFetch

function TestComponent({ type = 'asanas' }: { type?: any }) {
  const { items, loading, hasMore, loadMore } = useProfileLibrary({
    type,
    pageSize: 2,
  })
  return (
    <div>
      <div data-testid="count">{items.length}</div>
      <div data-testid="loading">{loading ? '1' : '0'}</div>
      <div data-testid="hasMore">{hasMore ? '1' : '0'}</div>
      <button onClick={() => void loadMore()} data-testid="load">
        load
      </button>
    </div>
  )
}

describe('useProfileLibrary', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('loads initial items and can load more', async () => {
    // first call returns 2 items and a nextCursor
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        items: [{ id: '1' }, { id: '2' }],
        nextCursor: 'c1',
        hasMore: true,
      }),
    })
    // second call returns 1 item and no more
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        items: [{ id: '3' }],
        nextCursor: null,
        hasMore: false,
      }),
    })

    await act(async () => {
      render(<TestComponent />)
    })

    // initial load should populate 2 items
    expect(screen.getByTestId('count').textContent).toBe('2')

    // trigger loadMore
    await act(async () => {
      screen.getByTestId('load').click()
    })

    expect(screen.getByTestId('count').textContent).toBe('3')
    expect(screen.getByTestId('hasMore').textContent).toBe('0')
  })
})
