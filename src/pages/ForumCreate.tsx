import React, { useState } from "react";
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonTextarea, IonButton } from "@ionic/react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Sidebar from '../components/Sidebar';

const ForumCreate: React.FC = () => {
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const history = useHistory();
    const usuario_id = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");

    const handleCreate = () => {
        if (!titulo.trim() || !descripcion.trim()) return;
        
        axios.post("http://127.0.0.1:8000/api/foros", { titulo, descripcion, usuario_id }, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => history.push("/home/forums"))
        .catch(error => console.error("Error al crear foro:", error));
    };

    return (
        <IonPage>
            <IonContent className="ion-padding">
            <div className="d-flex" style={{ overflowX: 'hidden' }}>
                    <Sidebar />
                    <div id="main-content" className="flex-grow-1 p-4">

                <IonItem>
                    <IonLabel position="stacked">Título</IonLabel>
                    <IonInput value={titulo} onIonChange={e => setTitulo(e.detail.value!)} required />
                </IonItem>
                <IonItem>
                    <IonLabel position="stacked">Descripción</IonLabel>
                    <IonTextarea value={descripcion} onIonChange={e => setDescripcion(e.detail.value!)} required />
                </IonItem>
                <IonButton expand="block" color="primary" onClick={handleCreate}>
                    Publicar Foro
                </IonButton>
                <IonButton expand="block" color="secondary" onClick={() => history.push("/home/forums")}>
                    Volver
                </IonButton>
                </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default ForumCreate;
