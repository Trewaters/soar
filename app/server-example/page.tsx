import SessionData from '@serverComponents/session-data'
import { auth } from 'auth'

export default async function Page() {
  const session = await auth()
  return (
    <div>
      <h1>React Server Component Usage</h1>

      <SessionData session={session} />
    </div>
  )
}
