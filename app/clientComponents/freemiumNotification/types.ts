export type FreemiumFeatureType =
  | 'createAsana'
  | 'createFlow'
  | 'createSeries'
  | 'createSequence'

export type UserAuthState =
  | 'unauthenticated'
  | 'authenticated-free'
  | 'authenticated-pro'

export type NotificationSeverity = 'info' | 'warning' | 'error' | 'success'

export interface NotificationContent {
  title: string
  message: string
  ctaText?: string
  ctaAction?: () => void
  severity?: NotificationSeverity
}

export interface NotificationState {
  type: FreemiumFeatureType
  content: NotificationContent
  duration?: number
  isVisible: boolean
}

export interface FreemiumNotificationProps {
  featureType: FreemiumFeatureType
  userAuthState: UserAuthState
  isOpen: boolean
  onClose: () => void
  onCtaClick?: () => void
  duration?: number
  position?: {
    vertical: 'top' | 'bottom'
    horizontal: 'left' | 'center' | 'right'
  }
}

export interface UseFreemiumNotificationReturn {
  notificationState: NotificationState | null
  showNotification: (featureType: FreemiumFeatureType) => void
  hideNotification: () => void
  handleCtaClick: () => void
}

export interface FeatureAccessResult {
  hasAccess: boolean
  requiresLogin: boolean
  requiresUpgrade: boolean
  notificationContent: NotificationContent
}
