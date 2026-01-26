import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../../auth'
import { prisma } from '../../../lib/prismaClient'

export const dynamic = 'force-dynamic'

/**
 * Comprehensive image troubleshooting endpoint
 * Tests actual image accessibility and HTTP responses
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const diagnostics: any = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      tests: {},
    }

    // Test 1: Environment variables
    diagnostics.tests.environment = {
      hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
      tokenPrefix: process.env.BLOB_READ_WRITE_TOKEN?.substring(0, 15) + '...',
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
      vercelUrl: process.env.VERCEL_URL,
    }

    // Test 2: Get sample images from database
    const images = await prisma.poseImage.findMany({
      take: 3,
      orderBy: { uploadedAt: 'desc' },
      select: {
        id: true,
        url: true,
        fileName: true,
        poseId: true,
        poseName: true,
        uploadedAt: true,
      },
    })

    diagnostics.tests.database = {
      totalImagesFound: images.length,
      sampleUrls: images.map((img) => ({
        id: img.id,
        url: img.url,
        fileName: img.fileName,
      })),
    }

    // Test 3: Test actual HTTP accessibility of each image
    if (images.length > 0) {
      const accessibilityTests = []

      for (const image of images.slice(0, 3)) {
        const testResult: any = {
          imageId: image.id,
          url: image.url,
          fileName: image.fileName,
        }

        try {
          // Try to fetch the image with timeout
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

          const response = await fetch(image.url, {
            method: 'HEAD',
            signal: controller.signal,
          })

          clearTimeout(timeoutId)

          testResult.accessible = response.ok
          testResult.httpStatus = response.status
          testResult.statusText = response.statusText
          testResult.headers = {
            contentType: response.headers.get('content-type'),
            contentLength: response.headers.get('content-length'),
            cacheControl: response.headers.get('cache-control'),
            accessControlAllowOrigin: response.headers.get(
              'access-control-allow-origin'
            ),
            xVercelCache: response.headers.get('x-vercel-cache'),
          }

          // If HEAD succeeded, try GET to verify actual content
          if (response.ok) {
            try {
              const getResponse = await fetch(image.url, {
                method: 'GET',
                signal: AbortSignal.timeout(10000),
              })
              const contentLength = (await getResponse.arrayBuffer()).byteLength
              testResult.actualContentLength = contentLength
              testResult.contentReadable = true
            } catch (getError) {
              testResult.contentReadable = false
              testResult.getError =
                getError instanceof Error ? getError.message : 'Unknown error'
            }
          }
        } catch (error) {
          testResult.accessible = false
          testResult.error =
            error instanceof Error ? error.message : 'Unknown error'
          testResult.errorType =
            error instanceof Error ? error.name : 'UnknownError'
        }

        accessibilityTests.push(testResult)
      }

      diagnostics.tests.imageAccessibility = {
        totalTested: accessibilityTests.length,
        accessible: accessibilityTests.filter((t) => t.accessible).length,
        failed: accessibilityTests.filter((t) => !t.accessible).length,
        results: accessibilityTests,
      }
    }

    // Test 4: Check Next.js config (from memory)
    diagnostics.tests.nextConfig = {
      remotePatterns: [
        '*.public.blob.vercel-storage.com',
        'public.blob.vercel-storage.com',
        '*.vercel-storage.com',
        'vercel-storage.com',
      ],
      note: 'These patterns should be configured in next.config.js',
    }

    // Test 5: Check Vercel Blob storage list (if possible)
    try {
      const { list } = await import('@vercel/blob')
      const blobList = await list({ limit: 5 })
      diagnostics.tests.vercelBlobStorage = {
        status: 'accessible',
        blobsFound: blobList.blobs.length,
        sampleBlobs: blobList.blobs.slice(0, 3).map((blob) => ({
          url: blob.url,
          pathname: blob.pathname,
          size: blob.size,
          uploadedAt: blob.uploadedAt,
        })),
      }
    } catch (error) {
      diagnostics.tests.vercelBlobStorage = {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }

    // Test 6: URL pattern matching
    if (images.length > 0) {
      const sampleUrl = images[0].url
      const urlAnalysis = {
        url: sampleUrl,
        hostname: sampleUrl ? new URL(sampleUrl).hostname : 'N/A',
        matchesPattern1: sampleUrl?.includes('.public.blob.vercel-storage.com'),
        matchesPattern2: sampleUrl?.includes('.vercel-storage.com'),
        startsWithHttps: sampleUrl?.startsWith('https://'),
      }
      diagnostics.tests.urlPatternMatch = urlAnalysis
    }

    // Generate summary and recommendations
    const issues = []
    const recommendations = []

    if (!diagnostics.tests.environment.hasBlobToken) {
      issues.push('BLOB_READ_WRITE_TOKEN not configured')
      recommendations.push(
        'Add BLOB_READ_WRITE_TOKEN to Vercel environment variables'
      )
    }

    if (diagnostics.tests.database.totalImagesFound === 0) {
      issues.push('No images found in database')
      recommendations.push('Upload images through the application interface')
    }

    if (diagnostics.tests.imageAccessibility) {
      const failedCount = diagnostics.tests.imageAccessibility.failed
      if (failedCount > 0) {
        issues.push(`${failedCount} images failed accessibility test`)

        // Analyze common failure patterns
        const results = diagnostics.tests.imageAccessibility.results
        const status403 = results.filter(
          (r: { httpStatus: number }) => r.httpStatus === 403
        ).length
        const status404 = results.filter(
          (r: { httpStatus: number }) => r.httpStatus === 404
        ).length
        const timeouts = results.filter(
          (r: { errorType: string }) => r.errorType === 'AbortError'
        ).length
        const corsErrors = results.filter((r: { error: string }) =>
          r.error?.toLowerCase().includes('cors')
        ).length

        if (status403 > 0) {
          issues.push(
            `${status403} images return 403 Forbidden - check Vercel Blob permissions`
          )
          recommendations.push(
            'Verify images are uploaded with access: "public" in upload route'
          )
        }
        if (status404 > 0) {
          issues.push(
            `${status404} images return 404 Not Found - files may not exist in Vercel Blob`
          )
          recommendations.push(
            'Re-upload missing images through production interface'
          )
        }
        if (timeouts > 0) {
          issues.push(
            `${timeouts} requests timed out - possible network issues`
          )
        }
        if (corsErrors > 0) {
          issues.push(`${corsErrors} CORS errors detected`)
          recommendations.push('Check Vercel Blob CORS configuration')
        }
      }
    }

    if (diagnostics.tests.vercelBlobStorage?.status === 'error') {
      issues.push('Cannot access Vercel Blob storage API')
      recommendations.push(
        'Verify BLOB_READ_WRITE_TOKEN has correct permissions'
      )
    }

    diagnostics.summary = {
      allTestsPassed: issues.length === 0,
      issuesFound: issues.length,
      issues: issues.length > 0 ? issues : ['No issues detected'],
      recommendations:
        recommendations.length > 0
          ? recommendations
          : ['All systems operational'],
    }

    return NextResponse.json(diagnostics, { status: 200 })
  } catch (error) {
    console.error('Diagnostic check failed:', error)
    return NextResponse.json(
      {
        error: 'Diagnostic check failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}
