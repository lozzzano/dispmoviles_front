import React, { useEffect, useState } from "react";
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonButton, IonItem, IonLabel } from "@ionic/react";
import axios from "axios";
import { useHistory, Link } from "react-router-dom";
import Sidebar from '../components/Sidebar';

interface Foro {
    id: number;
    titulo: string;
    usuario: { id: number, nombre: string };
    created_at: string; 
}

const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString("es-ES", options);
};

const ForumList: React.FC = () => {
    const [foros, setForos] = useState<Foro[]>([]);
    const token = localStorage.getItem("token");
    const history = useHistory();

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/foros", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => setForos(response.data)).catch(error => console.error("Error al obtener foros:", error));
    }, []);

    return (
        <IonPage>
            <IonContent className="ion-padding">
            <div className="d-flex" style={{ overflowX: 'hidden' }}>
                    <Sidebar />
                    <div id="main-content" className="flex-grow-1 p-4">

                <IonButton className="mb-3" expand="block" color="primary" onClick={() => history.push("/home/forums/create")}>
                    Crear nuevo tema
                </IonButton>

                <IonList>
                    {foros.map(foro => (
                        <IonItem key={foro.id} routerLink={`/home/forums/${foro.id}`}>
                            <IonLabel>
                                <h2>{foro.titulo}</h2>
                                <p><strong>Creado por:</strong> {foro.usuario?.nombre} - <small>{formatDate(foro.created_at)}</small></p> {/* 👈 Muestra creador + fecha */}
                            </IonLabel>
                        </IonItem>
                    ))}
                </IonList>
                <Link to="/home" className="btn btn-secondary mt-4 mb-4">
                    <i className="bi bi-arrow-left me-2"></i>
                    Volver al menú
                </Link>
                </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default ForumList;
