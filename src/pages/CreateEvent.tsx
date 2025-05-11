import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonInput,
  IonTextarea,
  IonButton,
  IonLabel,
  IonItem,
  IonDatetime,
  IonSpinner
} from '@ionic/react';
import { useState } from 'react';
import { useParams, useHistory } from 'react-router';
import axios from 'axios';

const CreateEvent: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // club id
  const token = localStorage.getItem('token');
  const history = useHistory();

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [lugar, setLugar] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [link_ubicacion, setLinkUbicacion] = useState('');
  const [imagen, setImagen] = useState<File | null>(null);
  const [tipo, setTipo] = useState('general');
  const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
  setLoading(true);
  try {
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('fecha', fecha);
    formData.append('hora', hora);
    formData.append('lugar', lugar);
    formData.append('ubicacion', ubicacion);
    formData.append('link_ubicacion', link_ubicacion);
    formData.append('tipo', tipo);
    if (imagen) {
      formData.append('imagen', imagen); // imagen es tipo File
    }

    await axios.post(`http://localhost:8000/api/clubs/${id}/eventos`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    alert('Evento creado correctamente');
    history.push(`/clubs/${id}`);
  } catch (error) {
    alert('Error al crear evento');
    console.error(error);
  } finally {
    setLoading(false);
  }
};


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Crear evento</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">

        <IonButton
        color="medium"
        expand="block"
        routerLink={`/clubs/${id}`}
        >
        Volver
        </IonButton>

        <IonItem>
          <IonLabel position="floating">Nombre</IonLabel>
          <IonInput value={nombre} onIonChange={(e) => setNombre(e.detail.value!)} />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Descripción</IonLabel>
          <IonTextarea value={descripcion} onIonChange={(e) => setDescripcion(e.detail.value!)} />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Fecha</IonLabel>
          <IonDatetime
            presentation="date"
            value={fecha}
            onIonChange={(e) => setFecha(e.detail.value as string)}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Hora</IonLabel>
          <IonDatetime
            presentation="time"
            value={hora}
            onIonChange={(e) => setHora(e.detail.value as string)}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Lugar</IonLabel>
          <IonInput value={lugar} onIonChange={(e) => setLugar(e.detail.value!)} />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Ubicación (texto)</IonLabel>
          <IonInput value={ubicacion} onIonChange={(e) => setUbicacion(e.detail.value!)} />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Link de ubicación</IonLabel>
          <IonInput value={link_ubicacion} onIonChange={(e) => setLinkUbicacion(e.detail.value!)} />
        </IonItem>

        <IonItem>
            <IonLabel>Seleccionar imagen</IonLabel>
            <input
                type="file"
                accept="image/*"
                onChange={(e) => setImagen(e.target.files?.[0] || null)}
            />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Tipo (opcional)</IonLabel>
          <IonInput value={tipo} onIonChange={(e) => setTipo(e.detail.value!)} />
        </IonItem>

        <IonButton expand="block" onClick={handleSubmit} disabled={loading}>
          {loading ? <IonSpinner name="dots" /> : 'Crear evento'}
        </IonButton>

      </IonContent>
    </IonPage>
  );
};

export default CreateEvent;
