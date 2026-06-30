import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

const goldIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

interface LocationPickerProps {
  latitude: number | null
  longitude: number | null
  onLocationSelect: (lat: number, lng: number) => void
}

function LocationMarker({ latitude, longitude, onLocationSelect }: LocationPickerProps) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng)
    },
  })

  return latitude && longitude ? (
    <Marker position={[latitude, longitude]} icon={goldIcon} />
  ) : null
}

export default function LocationPicker({ latitude, longitude, onLocationSelect }: LocationPickerProps) {
  const defaultCenter: [number, number] = [27.7172, 85.3240] // Kathmandu

  return (
    <div style={{
      border: '1px solid var(--border)',
      borderRadius: '8px',
      overflow: 'hidden',
      height: '300px'
    }}>
      <MapContainer
        center={latitude && longitude ? [latitude, longitude] : defaultCenter}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker
          latitude={latitude}
          longitude={longitude}
          onLocationSelect={onLocationSelect}
        />
      </MapContainer>
    </div>
  )
}