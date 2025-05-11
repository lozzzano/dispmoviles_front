import {
  IonPage,
  IonContent,
  IonSpinner,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonRange,
  IonLabel,
} from '@ionic/react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Link } from "react-router-dom";
import Sidebar from '../components/Sidebar';

interface Club {
  id: number;
  nombre: string;
  latitude: number;
  longitude: number;
  descripcion: string;
}

const NearbyClubs: React.FC = () => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDistance, setSelectedDistance] = useState(500); // valor inicial: 10 km
  const token = localStorage.getItem('token');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];
        setPosition(coords);
      },
      (error) => {
        console.error("Error obteniendo ubicación", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, []);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/clubs', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClubs(res.data);
      } catch (err) {
        console.error('Error cargando clubes', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, [token]);

  const icon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [32, 32],
  });
  const userIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149059.png', // ícono de persona
    iconSize: [30, 30],
  });

  const ForceMapResize = () => {
    const map = useMap();

    useEffect(() => {
      setTimeout(() => {
        map.invalidateSize();
      }, 300); // tiempo suficiente para que Ionic termine de animar la vista
    }, [map]);

    return null;
  };
  const history = useHistory();

  if (loading || !position) return <IonSpinner />;

  const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // radio de la tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const filteredClubs = clubs.filter(club =>
    getDistanceFromLatLonInKm(
      position[0], position[1],
      club.latitude, club.longitude
    ) <= selectedDistance / 1000
  );

  return (
    <IonPage>

      <IonContent>
        <div className="d-flex" style={{ overflowX: 'hidden' }}>
          <Sidebar />
          <div id="main-content" className="flex-grow-1 p-4">

            <Link to="/clubs" className="btn btn-secondary px-4 py-2 my-4">
              <i className="bi bi-arrow-left me-2"></i> Volver
            </Link>

            <IonLabel className='py-1 d-inline-block'>
              Filtrar por distancia: {selectedDistance} metros
            </IonLabel>

            <IonRange
              min={100}
              max={5000}
              step={100}
              value={selectedDistance}
              onIonChange={(e) => setSelectedDistance(Number(e.detail.value))}
              snaps
              ticks
              pin
            />

            <MapContainer
              center={position}
              zoom={15}
              scrollWheelZoom
              style={{ height: '90vh', width: '100%' }}
            >
              <ForceMapResize />

              <TileLayer
                attribution="&copy; OpenStreetMap"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Tu ubicación */}
              <Marker position={position}>
                <Popup>Estás aquí</Popup>
              </Marker>

              {/* Círculo de distancia desde tu ubicación */}
              <Circle
                center={position}
                radius={selectedDistance} // ya está en metros
                pathOptions={{ color: 'blue', fillOpacity: 0.1 }}
              />

              {/* Clubes */}
              {filteredClubs.map((club) => (
                <Marker
                  key={club.id}
                  position={[club.latitude, club.longitude]}
                  icon={icon}
                >

                  <Popup>
                    <div style={{ minWidth: '150px' }}>
                      <strong>{club.nombre}</strong>
                      <p style={{ margin: '5px 0' }}>{club.descripcion}</p>
                      <button
                        className="btn btn-sm btn-outline-primary w-100"
                        onClick={() => history.push(`/clubs/${club.id}`)}
                      >
                        Ver detalles
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default NearbyClubs;
