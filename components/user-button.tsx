import { auth } from '@/auth'
import SignIn, { SignOut } from './auth-components'

export default async function UserButton() {
  /*  
  Docs for `auth()` method v5: 
  * https://authjs.dev/getting-started/migrating-to-v5#authentication-methods
  */
  const session = await auth()

  if (!session?.user) return <SignIn />
  return (
    <>
      <SignOut />
    </>
  )
}
