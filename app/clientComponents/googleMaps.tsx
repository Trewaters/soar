import { memo, useCallback, useState } from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'

const containerStyle = {
  width: '100vw',
  height: '300px',
}

function MyComponent() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: `${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
  })

  // eslint-disable-next-line no-unused-vars, no-undef, @typescript-eslint/no-unused-vars
  const [map, setMap] = useState<google.maps.Map | null>(null)
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const [center, setCenter] = useState({ lat: 32.763, lng: -117.123 })

  const onLoad = useCallback(
    function callback(map: any) {
      const bounds = new window.google.maps.LatLngBounds(center)
      map.fitBounds(bounds)
      setMap(map)
    },
    [center]
  )

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const onUnmount = useCallback(function callback(map: any) {
    setMap(null)
  }, [])

  return isLoaded ? (
    <>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {/* Child components, such as markers, info windows, etc. */}
        <></>
      </GoogleMap>
    </>
  ) : (
    <></>
  )
}

export default memo(MyComponent)
