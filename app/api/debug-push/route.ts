import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const diagnostics = {
      timestamp: new Date().toISOString(),
      vapidKeysPresent: {
        public: !!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        private: !!process.env.VAPID_PRIVATE_KEY,
      },
      vapidKeyLength: {
        public: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.length || 0,
      },
      environment: process.env.NODE_ENV,
      commonSolutions: [
        'Clear browser data and restart browser',
        'Check if notifications are blocked in browser settings',
        'Try in incognito/private mode',
        'Test in different browser (Firefox vs Chrome)',
        'Ensure HTTPS or localhost',
        'Check network connectivity to FCM services',
      ],
      troubleshootingSteps: {
        step1: 'Open browser console and look for specific error details',
        step2: 'Check Application tab → Service Workers in DevTools',
        step3: 'Verify /sw.js is accessible in browser',
        step4: 'Test notification permission: Notification.requestPermission()',
        step5: 'Check if push notifications work in other sites',
      },
    }

    return NextResponse.json(diagnostics)
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to get diagnostics', details: errorMessage },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { error, diagnostics } = body

    // Log the error details for debugging
    console.error('Push notification error reported:', {
      error,
      diagnostics,
      timestamp: new Date().toISOString(),
      userAgent: req.headers.get('user-agent'),
    })

    // Return suggestions based on the error
    let suggestions = []

    if (error?.includes('AbortError')) {
      suggestions = [
        'Clear browser data (cookies, cache, storage)',
        'Restart browser completely',
        'Check if browser push service is available',
        'Verify VAPID keys are correct',
        'Try in incognito mode',
        'Test in different browser',
      ]
    } else if (error?.includes('NotAllowedError')) {
      suggestions = [
        'Check notification permissions in browser settings',
        'Ensure site is not blocked for notifications',
        'Try granting permission manually in address bar',
      ]
    } else if (error?.includes('NotSupportedError')) {
      suggestions = [
        'Ensure browser supports push notifications',
        'Check if service worker is supported',
        'Verify secure context (HTTPS/localhost)',
      ]
    } else {
      suggestions = [
        'Check browser console for detailed error messages',
        'Verify service worker registration',
        'Test basic notification API first',
      ]
    }

    return NextResponse.json({
      received: true,
      suggestions,
      nextSteps: [
        'Try the suggested solutions above',
        'Test in different browser/device',
        'Check if issue persists across different networks',
      ],
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process error report' },
      { status: 500 }
    )
  }
}
