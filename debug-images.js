// Debug script to check image data
console.log('=== IMAGE DEBUG SCRIPT ===')

// Check if we're in a browser environment
if (typeof window !== 'undefined') {
  console.log('Running in browser environment')

  // Check IndexedDB for local images
  const checkLocalImages = async () => {
    try {
      console.log('Checking IndexedDB for local images...')
      const request = indexedDB.open('YogaAppImages', 1)

      request.onsuccess = () => {
        const db = request.result
        const transaction = db.transaction(['images'], 'readonly')
        const store = transaction.objectStore('images')
        const getAllRequest = store.getAll()

        getAllRequest.onsuccess = () => {
          const images = getAllRequest.result
          console.log(`Found ${images.length} local images:`, images)

          images.forEach((img, index) => {
            console.log(`Local Image ${index + 1}:`, {
              id: img.id,
              fileName: img.fileName,
              fileSize: img.fileSize,
              hasDataUrl: !!img.dataUrl,
              dataUrlLength: img.dataUrl ? img.dataUrl.length : 0,
              dataUrlPreview: img.dataUrl
                ? img.dataUrl.substring(0, 50) + '...'
                : 'none',
            })
          })
        }

        getAllRequest.onerror = () => {
          console.error('Error getting local images:', getAllRequest.error)
        }
      }

      request.onerror = () => {
        console.error('Error opening IndexedDB:', request.error)
      }

      request.onupgradeneeded = () => {
        console.log('IndexedDB does not exist yet or needs upgrade')
      }
    } catch (error) {
      console.error('Error checking local images:', error)
    }
  }

  // Check API for cloud images
  const checkCloudImages = async () => {
    try {
      console.log('Checking API for cloud images...')
      const response = await fetch('/api/images/upload')

      if (response.ok) {
        const data = await response.json()
        console.log(`Found ${data.images?.length || 0} cloud images:`, data)

        if (data.images) {
          data.images.forEach((img, index) => {
            console.log(`Cloud Image ${index + 1}:`, {
              id: img.id,
              url: img.url,
              fileName: img.fileName,
              storageType: img.storageType,
              isValidUrl: img.url && !img.url.startsWith('local://'),
              urlPreview: img.url ? img.url.substring(0, 80) + '...' : 'none',
            })
          })
        }
      } else {
        console.error(
          'API response error:',
          response.status,
          response.statusText
        )
        const errorText = await response.text()
        console.error('Error details:', errorText)
      }
    } catch (error) {
      console.error('Error checking cloud images:', error)
    }
  }

  // Run checks
  checkLocalImages()
  checkCloudImages()
} else {
  console.log('Running in server environment - cannot check browser storage')
}
