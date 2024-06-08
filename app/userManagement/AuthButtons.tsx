import { signIn, signOut, useSession } from 'next-auth/client'

export default function AuthButtons() {
  const [session, loading] = useSession()

  return (
    <div>
      {!session && (
        <>
          <button onClick={() => signIn('google')}>Sign in with Google</button>
          <button onClick={() => signIn('facebook')}>
            Sign in with Facebook
          </button>
        </>
      )}
      {session && (
        <>
          <p>Welcome, {session.user.name}</p>
          <button onClick={() => signOut()}>Sign out</button>
        </>
      )}
    </div>
  )
}
