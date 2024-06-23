import type { Session } from 'next-auth'

export default function SessionData({ session }: { session: Session | null }) {
  if (session?.user) {
    return (
      <div>
        <h2>Current Session Data</h2>
        {Object.keys(session.user).length > 3 ? (
          <p>
            In this example, the whole session object is passed to the page,
            including the raw user object. Our recommendation is to{' '}
            <em>only pass the necessary fields</em> to the page, as the raw user
            object may contain sensitive information.
          </p>
        ) : (
          <p>
            In this example, only some fields in the user object is passed to
            the page to avoid exposing sensitive information.
          </p>
        )}
        <div>
          <div>Session</div>
          <pre>{JSON.stringify(session, null, 2)}</pre>
        </div>
      </div>
    )
  }

  return (
    <p>
      No session data, please <em>Sign In</em> first.
    </p>
  )
}
