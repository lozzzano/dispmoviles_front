import { useEffect, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonInput,
  IonTextarea,
  IonButton,
  IonLabel,
  IonItem,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonSelect,
  IonSelectOption
} from '@ionic/react';
import axios from 'axios';
import {  Link } from "react-router-dom";
import Sidebar from '../components/Sidebar';

const CreateClub: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [linkUbicacion, setLinkUbicacion] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [imagen, setImagen] = useState<File | null>(null);
  const [contacto, setContacto] = useState('');
  const [horarios, setHorarios] = useState('');
  const [tipoDeporte, setTipoDeporte] = useState<number | null>(null);
  const [deportes, setDeportes] = useState<{ id: number; nombre: string }[]>([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const token = localStorage.getItem('token');
  
    axios
      .get('http://localhost:8000/api/deportes', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => {
        setDeportes(res.data);
        console.log(res.data);
      })
      .catch(error => {
        console.error('Error al cargar deportes', error);
      });
  }, []);  

  const extraerCoords = (link: string) => {
    let lat: number | null = null;
    let lng: number | null = null;
  
    // Intenta primero con !3dLAT!4dLNG
    const dMatch = link.match(/!3d([-.\d]+)!4d([-.\d]+)/);
    if (dMatch) {
      lat = parseFloat(dMatch[1]);
      lng = parseFloat(dMatch[2]);
    }
  
    // Luego intenta con @LAT,LNG
    if (!lat || !lng) {
      const atMatch = link.match(/@([-.\d]+),([-.\d]+)/);
      if (atMatch) {
        lat = parseFloat(atMatch[1]);
        lng = parseFloat(atMatch[2]);
      }
    }
  
    // Luego con ?q=LAT,LNG
    if (!lat || !lng) {
      const qMatch = link.match(/[?&]q=([-.\d]+),([-.\d]+)/);
      if (qMatch) {
        lat = parseFloat(qMatch[1]);
        lng = parseFloat(qMatch[2]);
      }
    }
  
    if (lat !== null && lng !== null) {
      setLatitude(lat);
      setLongitude(lng);
      console.log(`✔ Coordenadas extraídas: ${lat}, ${lng}`);
    } else {
      alert('❌ No se pudieron extraer las coordenadas del link.');
    }
  };
  
  

  const handleSubmit = async () => {
    if (!latitude || !longitude) {
      alert('Debes extraer primero la ubicación');
      return;
    }
  
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('ubicacion', ubicacion);
    formData.append('link_ubicacion', linkUbicacion);
    formData.append('latitude', String(latitude));
    formData.append('longitude', String(longitude));
    formData.append('contacto', contacto);
    formData.append('horarios', horarios);
    if (tipoDeporte) formData.append('tipo_deporte', String(tipoDeporte));
    if (imagen) formData.append('imagen', imagen);
  
    try {
      await axios.post('http://localhost:8000/api/clubs', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Club creado correctamente');
    } catch (error) {
      console.error(error);
      alert('Error al crear el club');
    }
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
        <IonItem>
          <IonLabel position="stacked">Nombre</IonLabel>
          <IonInput value={nombre} onIonChange={e => setNombre(e.detail.value!)} />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Descripción</IonLabel>
          <IonTextarea value={descripcion} onIonChange={e => setDescripcion(e.detail.value!)} />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Tipo de deporte</IonLabel>
          <IonSelect value={tipoDeporte} onIonChange={e => setTipoDeporte(e.detail.value)}>
            {deportes.map(d => (
              <IonSelectOption key={d.id} value={d.id}>
                {d.nombre}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Ubicación (texto)</IonLabel>
          <IonInput value={ubicacion} onIonChange={e => setUbicacion(e.detail.value!)} />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Link de Google Maps</IonLabel>
          <IonInput
            value={linkUbicacion}
            onIonChange={e => setLinkUbicacion(e.detail.value!)}
            onBlur={e => extraerCoords(String(e.currentTarget.value))}
            placeholder="https://maps.google.com/?q=25.67,-100.31"
          />
        </IonItem>

        {latitude && longitude && (
          <IonItem>
            <IonLabel>Latitud: {latitude}, Longitud: {longitude}</IonLabel>
          </IonItem>
        )}

        <IonItem>
          <IonLabel position="stacked">Contacto</IonLabel>
          <IonInput value={contacto} onIonChange={e => setContacto(e.detail.value!)} />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Horarios</IonLabel>
          <IonInput value={horarios} onIonChange={e => setHorarios(e.detail.value!)} />
        </IonItem>

        <IonItem>
            <IonLabel position="stacked">Imagen del club</IonLabel>
            <input
                type="file"
                accept="image/*"
                onChange={e => {
                const file = e.target.files?.[0];
                if (file) setImagen(file);
                }}
            />
        </IonItem>

        <IonButton expand="block" onClick={handleSubmit}>
          Crear Club
        </IonButton>
        </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CreateClub;
