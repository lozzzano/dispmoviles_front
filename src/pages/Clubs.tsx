import { useEffect, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSpinner,
  IonItem,
  IonLabel
} from '@ionic/react';
import axios from 'axios';
import ClubCard from '../components/ClubCard';
import { useHistory } from 'react-router';
import {  Link } from "react-router-dom";
import Sidebar from '../components/Sidebar';

interface Club {
  id: number;
  nombre: string;
  descripcion: string;
  latitude: number;
  longitude: number;
}

const Clubs: React.FC = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [misClubes, setMisClubes] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
  
        const [todos, mios] = await Promise.all([
          axios.get('http://localhost:8000/api/clubs', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:8000/api/mis-clubs', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
  
        setClubs(todos.data);
        setMisClubes(mios.data.map((club: any) => club.id));
      } catch (error) {
        console.error('Error al cargar clubes', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);  

  const handleUnirse = async (clubId: number) => {
    try {
      await axios.post(
        `http://localhost:8000/api/clubs/${clubId}/unirse`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMisClubes([...misClubes, clubId]);
    } catch (error) {
      alert('Ya estás en este club o hubo un error');
    }
  };

  const handleAbandonar = async (clubId: number) => {
    try {
      await axios.post(
        `http://localhost:8000/api/clubs/${clubId}/abandonar`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMisClubes(misClubes.filter(id => id !== clubId));
    } catch (error) {
      alert('No se pudo abandonar el club (quizás eres el admin)');
    }
  };  
  const history = useHistory();

  return (
    <IonPage>
      <IonContent className="ion-padding">
      <div className="d-flex" style={{ overflowX: 'hidden' }}>
      <Sidebar />
      <div id="main-content" className="flex-grow-1 p-4">
                                <Link to="/home" className="btn btn-secondary px-4 py-2">
                                    <i className="bi bi-arrow-left me-2"></i> Volver
                                </Link>
        <h2>Explora Clubs</h2>
        <IonButton routerLink="/clubs/nearby">
            <IonLabel>Ver Mapa de Clubes Cercanos</IonLabel>
        </IonButton>

        <IonButton routerLink="/clubs/create" expand="block">Crear un Club</IonButton>
        {loading ? (
          <IonSpinner />
        ) : (
          clubs.map((club) => (
            <ClubCard
                key={club.id}
                club={club}
                unido={misClubes.includes(club.id)}
                onUnirse={() => handleUnirse(club.id)}
                onVer={() => history.push(`/clubs/${club.id}`)}
                onAbandonar={() => handleAbandonar(club.id)}
                />
          ))
        )}
        </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Clubs;
