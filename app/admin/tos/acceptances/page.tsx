import { prisma } from '@lib/prismaClient'
import { requireRole } from '@app/utils/authorization'
import { redirect } from 'next/navigation'

export const revalidate = 0

export default async function AcceptancesPage({
  searchParams,
}: {
  searchParams?: any
}) {
  try {
    await requireRole(['admin'])
  } catch (err: any) {
    // If unauthorized, redirect to sign-in. If forbidden, show 403-style message.
    const msg = String(err?.message || '')
    if (
      msg.toLowerCase().includes('please sign in') ||
      msg.toLowerCase().includes('unauthorized')
    ) {
      // Redirect unauthenticated users to sign-in (preserve return path)
      redirect(
        `/auth/signin?callbackUrl=${encodeURIComponent('/admin/tos/acceptances')}`
      )
    }

    // For other authorization failures, throw a controlled error to render a 403 response
    throw new Error('Forbidden - admin access required')
  }

  const accepts = await prisma.userTosAcceptance.findMany({
    orderBy: { acceptedAt: 'desc' },
    take: 200,
    include: { user: { select: { id: true, email: true, name: true } } },
  })

  return (
    <div style={{ padding: 20 }}>
      <h1>TOS Acceptances</h1>
      <p>Showing recent acceptances (max 200)</p>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: 8 }}>User</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Version</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Method</th>
            <th style={{ textAlign: 'left', padding: 8 }}>At</th>
            <th style={{ textAlign: 'left', padding: 8 }}>IP</th>
          </tr>
        </thead>
        <tbody>
          {accepts.map((a) => (
            <tr key={a.id}>
              <td style={{ padding: 8 }}>{a.user?.email ?? a.userId}</td>
              <td style={{ padding: 8 }}>{a.tosVersionId}</td>
              <td style={{ padding: 8 }}>{a.method}</td>
              <td style={{ padding: 8 }}>
                {new Date(a.acceptedAt).toLocaleString()}
              </td>
              <td style={{ padding: 8 }}>{a.ipAddress}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
