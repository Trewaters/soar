import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../../auth'
import { prisma } from '../../../lib/prismaClient'

// Force dynamic to check real-time database state
export const dynamic = 'force-dynamic'

/**
 * Quick check of image URLs in database
 * This helps diagnose if URLs are correct Vercel Blob URLs or incorrect local URLs
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')

    // Get sample images from database
    const images = await prisma.poseImage.findMany({
      take: limit,
      orderBy: { uploadedAt: 'desc' },
      select: {
        id: true,
        url: true,
        fileName: true,
        poseId: true,
        poseName: true,
        uploadedAt: true,
        userId: true,
      },
    })

    // Analyze URLs
    const analysis = images.map((img) => {
      const url = img.url || ''
      const isVercelBlob = url.includes('vercel-storage.com')
      const isLocalhost = url.includes('localhost')
      const isRelative = url.startsWith('/') && !url.startsWith('//')
      const isDataUrl = url.startsWith('data:')
      const isValid = url.startsWith('https://') || url.startsWith('http://')

      return {
        id: img.id,
        url: img.url,
        fileName: img.fileName,
        poseId: img.poseId,
        poseName: img.poseName,
        uploadedAt: img.uploadedAt,
        urlAnalysis: {
          isVercelBlob,
          isLocalhost,
          isRelative,
          isDataUrl,
          isValid,
          protocol: url.split(':')[0],
          hostname: url.includes('://') ? url.split('/')[2] : 'N/A',
        },
      }
    })

    // Summary statistics
    const summary = {
      total: images.length,
      vercelBlobUrls: analysis.filter((a) => a.urlAnalysis.isVercelBlob).length,
      localhostUrls: analysis.filter((a) => a.urlAnalysis.isLocalhost).length,
      relativeUrls: analysis.filter((a) => a.urlAnalysis.isRelative).length,
      dataUrls: analysis.filter((a) => a.urlAnalysis.isDataUrl).length,
      invalidUrls: analysis.filter((a) => !a.urlAnalysis.isValid).length,
    }

    // Issues detected
    const issues = []
    if (summary.localhostUrls > 0) {
      issues.push(
        `${summary.localhostUrls} images have localhost URLs - these won't work in production`
      )
    }
    if (summary.relativeUrls > 0) {
      issues.push(
        `${summary.relativeUrls} images have relative URLs - these might not work correctly`
      )
    }
    if (summary.invalidUrls > 0) {
      issues.push(`${summary.invalidUrls} images have invalid URLs`)
    }

    // Recommendations
    const recommendations = []
    if (summary.localhostUrls > 0 || summary.relativeUrls > 0) {
      recommendations.push(
        'Re-upload affected images through the production interface'
      )
      recommendations.push(
        'OR: Create a migration script to update URLs to Vercel Blob storage'
      )
    }
    if (summary.vercelBlobUrls === 0 && images.length > 0) {
      recommendations.push(
        'No Vercel Blob URLs found - check if BLOB_READ_WRITE_TOKEN was configured when images were uploaded'
      )
    }

    return NextResponse.json(
      {
        summary,
        issues: issues.length > 0 ? issues : ['No issues detected'],
        recommendations:
          recommendations.length > 0
            ? recommendations
            : ['All URLs appear to be valid Vercel Blob URLs'],
        sampleImages: analysis.slice(0, 5), // Show first 5 for inspection
        allImages: analysis, // All images for detailed inspection
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error checking image URLs:', error)
    return NextResponse.json(
      {
        error: 'Failed to check image URLs',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
