import {
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonLabel,
    IonImg,
    IonSpinner,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Club {
    id: number;
    nombre: string;
}

interface Publicacion {
    id: number;
    titulo: string;
    contenido: string;
    imagen?: string;
    tipo: string;
    created_at: string;
    club_id: number;
}

interface Evento {
    id: number;
    nombre: string;
    descripcion: string;
    fecha: string;
    hora: string;
    lugar: string;
    imagen?: string;
    tipo: string;
    created_at: string;
    club_id: number;
}

interface Props {
    misClubes: Club[];
}

const UserFeed: React.FC<Props> = ({ misClubes }) => {
    const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const allPublicaciones: Publicacion[] = [];
                const allEventos: Evento[] = [];

                for (const club of misClubes) {
                    const [pubs, evts] = await Promise.all([
                        axios.get(`http://localhost:8000/api/clubs/${club.id}/publicacions`, {
                            headers: { Authorization: `Bearer ${token}` },
                        }),
                        axios.get(`http://localhost:8000/api/clubs/${club.id}/eventos`, {
                            headers: { Authorization: `Bearer ${token}` },
                        }),
                    ]);
                    allPublicaciones.push(...pubs.data);
                    allEventos.push(...evts.data);
                }

                setPublicaciones(allPublicaciones);
                setEventos(allEventos);
            } catch (error) {
                console.error('Error al cargar feed:', error);
            } finally {
                setLoading(false);
            }
        };

        if (misClubes.length > 0) {
            fetchData();
        } else {
            setLoading(false);
        }
    }, [misClubes]);

    if (loading) return <IonSpinner />;

    return (
        <>
            <h3 className="mt-4 mb-2">📌 Publicaciones</h3>
            {publicaciones.map((pub) => (
                <IonCard key={`pub-${pub.id}`}>
                    <IonCardHeader>
                        <IonCardTitle>{pub.titulo}</IonCardTitle>
                        <IonLabel className="text-white small">
                            {new Date(pub.created_at).toLocaleString('es-MX', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </IonLabel>
                    </IonCardHeader>

                    <IonCardContent className='text-white'>{pub.contenido}</IonCardContent>

                    {pub.imagen && (
                        <div style={{ padding: '0.5rem' }}>
                            <IonImg
                                src={`http://localhost:8000/${pub.imagen}`}
                                style={{ maxHeight: '100vh', objectFit: 'cover', borderRadius: '10px' }}
                            />
                        </div>
                    )}
                </IonCard>
            ))}

            <h3 className="mt-4 mb-2">📅 Eventos</h3>
            {eventos.map((evt) => (
                <IonCard key={`evt-${evt.id}`}>
                    <IonCardHeader>
                        <IonCardTitle>{evt.nombre}</IonCardTitle>
                        <IonLabel className="text-white small">
                            {new Date(evt.fecha).toLocaleDateString('es-MX', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}{' '}
                            a las{' '}
                            {evt.hora.slice(0, 5)} {/* Solo HH:mm */}
                        </IonLabel>
                    </IonCardHeader>

                    {evt.imagen && (
                        <div style={{ padding: '0.5rem' }}>
                            <IonImg
                                src={`http://localhost:8000/${evt.imagen}`}
                                style={{ maxHeight: '200px', objectFit: 'cover', borderRadius: '10px' }}
                            />
                        </div>
                    )}

                    <IonCardContent>{evt.descripcion}</IonCardContent>
                </IonCard>
            ))}
        </>
    );

};

export default UserFeed;
