import TosCreateForm from '../TosCreateForm'
import { isAdmin } from '@app/utils/authorization'
import { prisma } from '@lib/prismaClient'
import ActivateButton from '../ActivateButton'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function TosCreatePage() {
  const admin = await isAdmin()
  if (!admin) return <div>Unauthorized</div>

  const versions = await prisma.tosVersion.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          marginBottom: 12,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1 style={{ margin: 0 }}>Create Terms of Service Version</h1>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/profile">Profile</Link>
          <Link href="/admin/tos">← Back to versions</Link>
        </div>
      </div>

      <div style={{ marginBottom: 32 }}>
        <TosCreateForm />
      </div>

      <section>
        <h2>Version History</h2>
        <p>
          <Link href="/admin/tos">All versions</Link> |{' '}
          <Link href="/admin/tos/acceptances">View acceptances</Link>
        </p>

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {versions.map((v) => (
            <li
              key={v.id}
              style={{
                marginBottom: 12,
                borderBottom: '1px solid #eee',
                paddingBottom: 8,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <strong>{v.title}</strong>
                  <div style={{ fontSize: 12, color: '#666' }}>
                    {v.id} — {new Date(v.effectiveAt).toLocaleString()}
                  </div>
                </div>
                <div>
                  {v.active ? (
                    <span
                      style={{
                        color: 'green',
                        fontWeight: 700,
                        marginRight: 8,
                      }}
                    >
                      ACTIVE
                    </span>
                  ) : (
                    <span style={{ color: '#999', marginRight: 8 }}>
                      inactive
                    </span>
                  )}
                  <ActivateButton versionId={v.id} active={v.active} />
                </div>
              </div>
              <div style={{ marginTop: 6 }}>{v.summary}</div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
