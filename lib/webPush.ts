import webpush from 'web-push'

webpush.setVapidDetails(
  'mailto:support@happyyoga.app',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

export async function sendWebPush(
  subscription: webpush.PushSubscription,
  payload: any
) {
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload))
    return { ok: true }
  } catch (e: any) {
    // 410 Gone -> remove stale subscription
    return { ok: false, code: e?.statusCode }
  }
}
