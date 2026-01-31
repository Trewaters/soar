import { prisma } from '@lib/prismaClient'
import Link from 'next/link'
import ActivateButton from './ActivateButton'
import { isAdmin } from '@app/utils/authorization'

export const revalidate = 0

export default async function TosAdminPage() {
  const admin = await isAdmin()
  if (!admin) {
    return <div>Unauthorized</div>
  }

  const versions = await prisma.tosVersion.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1 style={{ margin: 0 }}>Terms of Service - Versions</h1>
        <div>
          <Link href="/admin/tos/create">
            <button style={{ padding: '8px 12px', cursor: 'pointer' }}>
              Create new version
            </button>
          </Link>{' '}
          <Link href="/admin/tos/acceptances" style={{ marginLeft: 8 }}>
            View acceptances
          </Link>
        </div>
      </div>

      <ul style={{ marginTop: 16 }}>
        {versions.map((v) => (
          <li key={v.id} style={{ marginBottom: 12 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <strong>{v.title}</strong> —{' '}
                <span style={{ color: '#666' }}>{v.id}</span>
                <div style={{ fontSize: 12, color: '#666' }}>
                  effective {new Date(v.effectiveAt).toLocaleString()}
                </div>
              </div>
              <div>
                <span style={{ marginRight: 8 }}>
                  {v.active ? (
                    <span style={{ color: 'green', fontWeight: 700 }}>
                      ACTIVE
                    </span>
                  ) : (
                    <span style={{ color: '#999' }}>inactive</span>
                  )}
                </span>
                <ActivateButton versionId={v.id} active={v.active} />
              </div>
            </div>
            <div style={{ marginTop: 6 }}>{v.summary}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
