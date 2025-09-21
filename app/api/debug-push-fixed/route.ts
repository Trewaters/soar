import { NextResponse } from 'next/server'

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
