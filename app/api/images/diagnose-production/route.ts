import { NextResponse } from 'next/server'
import { auth } from '../../../../auth'
import { prisma } from '../../../lib/prismaClient'
import { storageManager } from '../../../../lib/storage/manager'

// Force this route to be dynamic since it requires authentication
export const dynamic = 'force-dynamic'

/**
 * Diagnostic endpoint to check image storage and configuration in production
 * Usage: GET /api/images/diagnose-production
 */
export async function GET() {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Only allow in non-production or for admin users
    const isDev = process.env.NODE_ENV === 'development'
    if (!isDev) {
      // In production, check if user is admin
      const { isAdmin } = await import('@app/utils/authorization')
      const userIsAdmin = await isAdmin()
      if (!userIsAdmin) {
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        )
      }
    }

    const diagnostics: any = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      checks: {},
    }

    // 1. Check BLOB_READ_WRITE_TOKEN configuration
    const hasToken = !!process.env.BLOB_READ_WRITE_TOKEN
    diagnostics.checks.blobToken = {
      configured: hasToken,
      tokenPrefix: hasToken
        ? process.env.BLOB_READ_WRITE_TOKEN?.substring(0, 10) + '...'
        : 'NOT SET',
    }

    // 2. Check storage manager configuration
    try {
      const storageConfig = await storageManager.getConfigurationStatus()
      diagnostics.checks.storageManager = {
        status: 'ok',
        activeProvider: storageConfig.activeProvider,
        providerReady: storageConfig.providers['vercel-blob']?.isReady,
        config: storageConfig.providers['vercel-blob']?.configured,
      }
    } catch (error) {
      diagnostics.checks.storageManager = {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }

    // 3. Check database - get sample images
    try {
      const imageCount = await prisma.poseImage.count()
      const sampleImages = await prisma.poseImage.findMany({
        take: 5,
        orderBy: { uploadedAt: 'desc' },
        select: {
          id: true,
          url: true,
          fileName: true,
          fileSize: true,
          poseId: true,
          poseName: true,
          uploadedAt: true,
        },
      })

      diagnostics.checks.database = {
        status: 'ok',
        totalImages: imageCount,
        sampleImages: sampleImages.map((img) => ({
          id: img.id,
          url: img.url,
          urlValid: img.url.startsWith('https://'),
          fileName: img.fileName,
          poseId: img.poseId,
          uploadedAt: img.uploadedAt,
        })),
      }
    } catch (error) {
      diagnostics.checks.database = {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }

    // 4. Check if we can access sample image URLs
    if (diagnostics.checks.database?.sampleImages?.length > 0) {
      const firstImageUrl = diagnostics.checks.database.sampleImages[0].url
      try {
        const response = await fetch(firstImageUrl, {
          method: 'HEAD',
          signal: AbortSignal.timeout(5000), // 5 second timeout
        })

        diagnostics.checks.imageAccessibility = {
          status: response.ok ? 'ok' : 'failed',
          httpStatus: response.status,
          testedUrl: firstImageUrl,
          headers: {
            contentType: response.headers.get('content-type'),
            contentLength: response.headers.get('content-length'),
            cacheControl: response.headers.get('cache-control'),
          },
        }
      } catch (error) {
        diagnostics.checks.imageAccessibility = {
          status: 'error',
          testedUrl: firstImageUrl,
          error: error instanceof Error ? error.message : 'Unknown error',
        }
      }
    }

    // 5. Check Next.js image configuration
    diagnostics.checks.nextjsConfig = {
      imageRemotePatterns: [
        '*.public.blob.vercel-storage.com',
        'public.blob.vercel-storage.com',
        '*.vercel-storage.com',
        'vercel-storage.com',
      ],
      note: 'Verify these patterns in next.config.js',
    }

    // Summary
    const allChecksOk =
      diagnostics.checks.blobToken?.configured &&
      diagnostics.checks.storageManager?.status === 'ok' &&
      diagnostics.checks.database?.status === 'ok' &&
      (diagnostics.checks.imageAccessibility?.status === 'ok' ||
        !diagnostics.checks.imageAccessibility)

    diagnostics.summary = {
      allChecksOk,
      issues: [],
    }

    if (!diagnostics.checks.blobToken?.configured) {
      diagnostics.summary.issues.push(
        'BLOB_READ_WRITE_TOKEN not configured - add to Vercel environment variables'
      )
    }
    if (diagnostics.checks.storageManager?.status !== 'ok') {
      diagnostics.summary.issues.push('Storage manager not configured properly')
    }
    if (diagnostics.checks.database?.status !== 'ok') {
      diagnostics.summary.issues.push('Database connection issue')
    }
    if (diagnostics.checks.imageAccessibility?.status === 'failed') {
      diagnostics.summary.issues.push(
        `Sample image not accessible (HTTP ${diagnostics.checks.imageAccessibility.httpStatus})`
      )
    }

    return NextResponse.json(diagnostics, { status: 200 })
  } catch (error) {
    console.error('Diagnostic check failed:', error)
    return NextResponse.json(
      {
        error: 'Diagnostic check failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
