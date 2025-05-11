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
  IonSpinner,
} from '@ionic/react';
import { useState } from 'react';
import { useParams, useHistory } from 'react-router';
import axios from 'axios';

const CreatePublication: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // ID del club
  const token = localStorage.getItem('token');
  const history = useHistory();

  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [imagen, setImagen] = useState<File | null>(null);
  const [tipo, setTipo] = useState('general');
  const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
  setLoading(true);
  try {
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('contenido', contenido);
    formData.append('tipo', tipo);
    if (imagen) {
      formData.append('imagen', imagen); // imagen es tipo File
    }

    await axios.post(`http://localhost:8000/api/clubs/${id}/publicacions`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    alert('Publicación creada correctamente');
    history.push(`/clubs/${id}`);
  } catch (error) {
    alert('Error al crear publicación');
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Crear publicación</IonTitle>
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
          <IonLabel position="floating">Título</IonLabel>
          <IonInput value={titulo} onIonChange={(e) => setTitulo(e.detail.value!)} />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Contenido</IonLabel>
          <IonTextarea rows={6} value={contenido} onIonChange={(e) => setContenido(e.detail.value!)} />
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
          {loading ? <IonSpinner name="dots" /> : 'Publicar'}
        </IonButton>

      </IonContent>
    </IonPage>
  );
};

export default CreatePublication;
