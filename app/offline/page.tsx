'use client'

export default function OfflinePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <div>
        <h1>Offline Mode</h1>
        <p>You appear to be offline. Some features may be unavailable.</p>
        <p>
          We’ll automatically sync and refresh when your connection returns.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          style={{
            marginTop: '1rem',
            padding: '0.75rem 1.25rem',
            borderRadius: 8,
            border: '1px solid #ccc',
            background: '#fafafa',
            cursor: 'pointer',
          }}
          aria-label="Retry loading the app"
        >
          Retry
        </button>
      </div>
    </main>
  )
}
