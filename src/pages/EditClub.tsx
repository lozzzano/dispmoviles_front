import {
    IonPage,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonInput,
    IonItem,
    IonLabel,
    IonTextarea,
    IonButton,
    IonSpinner,
  } from '@ionic/react';
  import { useEffect, useState } from 'react';
  import axios from 'axios';
  import { useParams, useHistory } from 'react-router';
import {  Link } from "react-router-dom";
import Sidebar from '../components/Sidebar';
  
  const EditClub: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const token = localStorage.getItem('token');
    const history = useHistory();
  
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [ubicacion, setUbicacion] = useState('');
    const [linkUbicacion, setLinkUbicacion] = useState('');
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [imagen, setImagen] = useState<File | null>(null);
    const [contacto, setContacto] = useState('');
    const [horarios, setHorarios] = useState('');
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      axios
        .get(`http://localhost:8000/api/clubs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const club = res.data;
          setNombre(club.nombre);
          setDescripcion(club.descripcion);
          setUbicacion(club.ubicacion ?? '');
          setLinkUbicacion(club.link_ubicacion ?? '');
          setLatitude(club.latitude ?? null);
          setLongitude(club.longitude ?? null);
          setContacto(club.contacto ?? '');
          setHorarios(club.horarios ?? '');
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }, [id, token]);
  
    const extraerCoords = (link: string) => {
      const regex = /@([-.\d]+),([-.\d]+)/;
      const match = link.match(regex);
      if (match) {
        setLatitude(parseFloat(match[1]));
        setLongitude(parseFloat(match[2]));
      } else {
        alert('No se pudo extraer latitud y longitud del enlace');
      }
    };
  
    const handleSubmit = async () => {
      try {
        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('descripcion', descripcion);
        formData.append('ubicacion', ubicacion);
        formData.append('link_ubicacion', linkUbicacion);
        if (latitude) formData.append('latitude', latitude.toString());
        if (longitude) formData.append('longitude', longitude.toString());
        if (imagen) formData.append('imagen', imagen);
        formData.append('contacto', contacto);
        formData.append('horarios', horarios);
  
        await axios.post(`http://localhost:8000/api/clubs/${id}?_method=PUT`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
  
        alert('Club actualizado con éxito');
        history.push(`/clubs/${id}`);
      } catch (error) {
        console.error('Error al actualizar el club', error);
        alert('Hubo un error al actualizar el club');
      }
    };
  
    if (loading) return <IonSpinner />;
  
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
            <IonInput value={nombre} onIonChange={(e) => setNombre(e.detail.value!)} />
          </IonItem>
  
          <IonItem>
            <IonLabel position="stacked">Descripción</IonLabel>
            <IonTextarea value={descripcion} onIonChange={(e) => setDescripcion(e.detail.value!)} />
          </IonItem>
  
          <IonItem>
            <IonLabel position="stacked">Ubicación (texto)</IonLabel>
            <IonInput value={ubicacion} onIonChange={(e) => setUbicacion(e.detail.value!)} />
          </IonItem>
  
          <IonItem>
            <IonLabel position="stacked">Link de Google Maps</IonLabel>
            <IonInput
              value={linkUbicacion}
              onIonChange={(e) => setLinkUbicacion(e.detail.value!)}
              onBlur={(e) => extraerCoords(String(e.currentTarget.value))}
            />
          </IonItem>
  
          <IonItem>
            <IonLabel position="stacked">Imagen (opcional)</IonLabel>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImagen(e.target.files?.[0] ?? null)}
            />
          </IonItem>
  
          <IonItem>
            <IonLabel position="stacked">Contacto</IonLabel>
            <IonInput value={contacto} onIonChange={(e) => setContacto(e.detail.value!)} />
          </IonItem>
  
          <IonItem>
            <IonLabel position="stacked">Horarios</IonLabel>
            <IonInput value={horarios} onIonChange={(e) => setHorarios(e.detail.value!)} />
          </IonItem>
  
          <IonButton expand="block" onClick={handleSubmit}>
            Guardar cambios
          </IonButton>
          </div>
          </div>
        </IonContent>
      </IonPage>
    );
  };
  
  export default EditClub;
  