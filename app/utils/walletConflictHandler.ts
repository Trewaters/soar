// Utility to handle browser extension conflicts
// Particularly useful for crypto wallet extensions like Conflux, MetaMask, etc.

declare global {
  interface Window {
    dataLayer?: Object[]
    // eslint-disable-next-line no-unused-vars
    gtag: (...args: any[]) => void
    conflux?: any
    ethereum?: any
  }
}

export const handleWalletExtensionConflicts = () => {
  // Only run in browser environment
  if (typeof window === 'undefined') return

  try {
    // Prevent wallet extensions from interfering with analytics
    const originalDefineProperty = Object.defineProperty
    Object.defineProperty = function <T>(
      obj: T,
      prop: PropertyKey,
      descriptor: PropertyDescriptor & ThisType<any>
    ): T {
      try {
        return originalDefineProperty.call(this, obj, prop, descriptor) as T
      } catch (error) {
        // Silently ignore redefinition errors from wallet extensions
        if (error instanceof TypeError && error.message.includes('redefine')) {
          console.warn(
            `Wallet extension conflict detected for property: ${prop.toString()}`
          )
          return obj
        }
        throw error
      }
    }

    // Initialize Google Analytics data layer safely
    if (!window.dataLayer) {
      window.dataLayer = []
    }

    if (!window.gtag) {
      window.gtag = function (...args: any[]) {
        if (window.dataLayer) {
          window.dataLayer.push(args)
        }
      }
    }
  } catch (error) {
    console.warn('Wallet extension conflict handling failed:', error)
  }
}

export default handleWalletExtensionConflicts
