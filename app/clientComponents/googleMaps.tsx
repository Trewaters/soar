// import React from 'react'
// import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'

// const containerStyle = {
//   width: '100%',
//   height: '500px',
// }

// const center = {
//   lat: 37.7749, // Example latitude (San Francisco)
//   lng: -122.4194, // Example longitude (San Francisco)
// }

// export default function MyMap() {
//   return (
//     <>
//       <LoadScript googleMapsApiKey={`${process.env.GOOGLE_MAPS_API_KEY}`}>
//         <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
//           {/* Optional: Add marker */}
//           <Marker position={center} />
//         </GoogleMap>
//       </LoadScript>
//       {/* <script
//         async
//         src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY_HERE&callback=console.debug&libraries=maps,marker&v=beta"
//       ></script> */}
//     </>
//   )
// }

import React from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'

const containerStyle = {
  width: '400px',
  height: '400px',
}

const center = {
  lat: -3.745,
  lng: -38.523,
}

function MyComponent() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: `${process.env.GOOGLE_MAPS_API_KEY}`,
  })

  const [map, setMap] = React.useState(null)

  const onLoad = React.useCallback(function callback(map: any) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center)
    map.fitBounds(bounds)

    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map: any) {
    setMap(null)
  }, [])

  return isLoaded ? (
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
  ) : (
    <></>
  )
}

export default React.memo(MyComponent)
