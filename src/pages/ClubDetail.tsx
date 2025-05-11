import { useEffect, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonSpinner,
  IonImg,
  IonButton,
  IonLabel,
  IonBadge,
} from '@ionic/react';
import { useParams, useHistory } from 'react-router';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import {  Link } from "react-router-dom";
import Sidebar from '../components/Sidebar';

interface Club {
  id: number;
  nombre: string;
  descripcion: string;
  ubicacion?: string;
  link_ubicacion?: string;
  imagen?: string;
  latitude?: number;
  longitude?: number;
  contacto?: string;
  horarios?: string;
  cantidad_miembros?: number;
  rol?: 'miembro' | 'admin';
}

const ClubDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const history = useHistory();

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/clubs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setClub(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id, token]);

  const handleAbandonar = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/clubs/${id}/abandonar`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Has abandonado el club');
      history.push('/home'); // o a donde quieras redirigir
    } catch (err) {
      alert('No se pudo abandonar el club');
    }
  };

  if (loading) return <IonSpinner />;

  if (!club) return <p>Error al cargar el club.</p>;

  const ForceMapResize = () => {
    const map = useMap();
  
    useEffect(() => {
      setTimeout(() => {
        map.invalidateSize(); //  fuerza el recalculo
      }, 100); // espera un poco para que Ionic termine de animar
    }, [map]);
  
    return null;
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
      <div className="d-flex" style={{ overflowX: 'hidden' }}>
      <Sidebar />
      <div id="main-content" className="flex-grow-1 p-4">

        <Link to="/clubs" className="btn btn-secondary px-4 py-2">
                                                                <i className="bi bi-arrow-left me-2"></i> Volver
                                                            </Link>
        {club.imagen && (
          <IonImg
            src={club.imagen}
            style={{ objectFit: 'cover', height: '200px', borderRadius: '8px' }}
          />
        )}

        <h2>{club.nombre}</h2>
        {club.rol && (
          <IonBadge color={club.rol === 'admin' ? 'warning' : 'success'}>
            {club.rol}
          </IonBadge>
        )}

        <p><strong>Miembros:</strong> {club.cantidad_miembros ?? '—'}</p>

        {club.descripcion && (
          <p><strong>Descripción:</strong> {club.descripcion}</p>
        )}

        {club.ubicacion && (
          <p><strong>Ubicación:</strong> {club.ubicacion}</p>
        )}

        {club.link_ubicacion && (
          <p>
            <a href={club.link_ubicacion} target="_blank" rel="noopener noreferrer">
              Ver en Google Maps
            </a>
          </p>
        )}

        {club.contacto && <p><strong>Contacto:</strong> {club.contacto}</p>}

        {club.horarios && <p><strong>Horarios:</strong> {club.horarios}</p>}

        {club.rol === 'miembro' && (
          <IonButton color="danger" expand="block" onClick={handleAbandonar}>
            Abandonar club
          </IonButton>
        )}
        {club.rol === 'admin' && (
        <IonButton
            color="warning"
            expand="block"
            routerLink={`/clubs/${club.id}/edit`}
        >
            Editar Club
        </IonButton>
        )}

        {club.rol === 'admin' && (
          <IonButton
            color="success"
            expand="block"
            routerLink={`/clubs/${club.id}/crear-publicacion`}
          >
            Crear publicación
          </IonButton>
        )}

        {club.rol === 'admin' && (
          <IonButton
            color="primary"
            expand="block"
            routerLink={`/clubs/${club.id}/crear-evento`}
          >
            Crear evento
          </IonButton>
        )}

        {club.latitude && club.longitude && (
            <div style={{ height: '300px', marginTop: '1rem', borderRadius: '10px', overflow: 'hidden' }}>
                <MapContainer
                center={[club.latitude, club.longitude]}
                zoom={16}
                scrollWheelZoom={false}
                style={{ height: '300px', width: '100%' }}
                >
                <ForceMapResize />
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[club.latitude, club.longitude]}>
                    <Popup>{club.nombre}</Popup>
                </Marker>
                </MapContainer>
            </div>
        )}
        </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ClubDetail;
