import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { IonPage, IonContent, IonSpinner } from '@ionic/react';
import UserFeed from '../components/UserFeed';
import axios from 'axios';

interface Club {
  id: number;
  nombre: string;
}

const Home: React.FC = () => {
  const [misClubes, setMisClubes] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchMisClubes = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/mis-clubs', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMisClubes(res.data);
      } catch (err) {
        console.error('Error al cargar clubes del usuario', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMisClubes();
  }, []);

  return (
    <IonPage>
      <div className="d-flex" style={{ overflowX: 'hidden' }}>
        <Sidebar />

        {/* Contenido Principal */}
        <div id="main-content" className="flex-grow-1 p-3">
          <div className="container">
            {/* Encabezado de bienvenida */}
            <h1 className="mb-4 mt-5 d-flex align-items-center">
              <img
                src="/icon.png"
                alt="App Icon"
                style={{ width: '50px', height: '50px', marginRight: '10px' }}
              />
              ¡Bienvenido a TeamFinder!
            </h1>

            <p className="lead text-white mb-5">
              Explora, únete y disfruta eventos deportivos cerca de ti. Crea y participa en clubes deportivos, descubre nuevas actividades, interactúa en foros comunitarios y encuentra personas con tus mismos intereses. Hacer deporte nunca fue tan fácil.
            </p>

            {/* Secciones principales */}
            <div className="row">
              <SectionCard
                link="/clubs"
                icon="bi-people-fill"
                title="Explora Clubs"
                text="Encuentra y únete a clubs deportivos de tu interés."
              />
              <SectionCard
                link="/home/forums"
                icon="bi-chat-dots-fill"
                title="Foros de Discusión"
                text="Crea temas, comenta e interactúa con la comunidad."
              />
              <SectionCard
                link="/eventos"
                icon="bi-calendar-event-fill"
                title="Participa en Eventos"
                text="Inscríbete a eventos deportivos organizados por los clubs."
              />
              <SectionCard
                link="/perfil"
                icon="bi-person-fill"
                title="Tu Perfil"
                text="Edita tu perfil, cambia tus datos o revisa tus notificaciones."
              />
              <SectionCard
                link="/home/sports"
                icon="bi-trophy"
                title="Catálogo de Deportes"
                text="Descubre y explora nuevos deportes disponibles en la app."
              />
            </div>

            {/* Feed de publicaciones y eventos */}
            <div className="mt-5">
              <h2 className="mb-3">📰 Tu Actividad Reciente</h2>
              {loading ? (
                <IonSpinner name="dots" />
              ) : (
                <UserFeed misClubes={misClubes} />
              )}
            </div>
          </div>
        </div>
      </div>
    </IonPage>
  );
};

export default Home;

// Componente reutilizable para cada sección del home
const SectionCard: React.FC<{
  link: string;
  icon: string;
  title: string;
  text: string;
}> = ({ link, icon, title, text }) => (
  <div className="col-md-4 mb-4">
    <a href={link} className="text-decoration-none">
      <div className="card shadow hover-card h-100">
        <div className="card-body text-center d-flex flex-column justify-content-center">
          <i className={`bi ${icon} display-1 mb-3`}></i>
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{text}</p>
        </div>
      </div>
    </a>
  </div>
);
