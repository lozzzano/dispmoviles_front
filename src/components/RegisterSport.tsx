import React, { useState } from "react";
import { useParams, Link } from 'react-router-dom';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonItem, IonLabel, IonTextarea, IonAlert } from "@ionic/react";
import axios from "axios";

const RegisterSport: React.FC = () => {
    const [nombre, setNombre] = useState<string>("");
    const [descripcion, setDescripcion] = useState<string>("");
    const [imagen, setImagen] = useState<File | null>(null);
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>("");

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setImagen(event.target.files[0]);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        if (!nombre || !descripcion || !imagen) {
            setAlertMessage("Todos los campos son obligatorios.");
            setShowAlert(true);
            return;
        }

        const formData = new FormData();
        formData.append("nombre", nombre);
        formData.append("descripcion", descripcion);
        formData.append("imagen", imagen);
        const token = localStorage.getItem("token");

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/deportes", formData, {
                headers: { "Content-Type": "multipart/form-data",
                            "Authorization": `Bearer ${token}`
                 }
            });
            setAlertMessage("Deporte registrado con éxito.");
            setShowAlert(true);
            console.log(response.data);

            // Limpiar campos
            setNombre("");
            setDescripcion("");
            setImagen(null);
        } catch (error) {
            console.error("Error al registrar el deporte:", error);
            setAlertMessage("Hubo un problema al registrar el deporte.");
            setShowAlert(true);
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Registrar Deporte</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <Link to="/home/sports" className="btn btn-secondary mt-4 mb-4">
                    <i className="bi bi-arrow-left me-2"></i>
                    Volver al Catálogo
                </Link>
                <form onSubmit={handleSubmit}>
                    <IonItem>
                        <IonLabel position="floating">Nombre del Deporte</IonLabel>
                        <IonInput value={nombre} onIonChange={(e) => setNombre(e.detail.value!)} required />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Descripción</IonLabel>
                        <IonTextarea value={descripcion} onIonChange={(e) => setDescripcion(e.detail.value!)} required />
                    </IonItem>
                    <IonItem>
                        <IonLabel>Imagen</IonLabel>
                        <input type="file" accept="image/*" onChange={handleFileChange} required />
                    </IonItem>
                    <IonButton expand="full" type="submit">Guardar</IonButton>
                </form>
                <IonAlert
                    isOpen={showAlert}
                    onDidDismiss={() => setShowAlert(false)}
                    header="Información"
                    message={alertMessage}
                    buttons={["OK"]}
                />
            </IonContent>
        </IonPage>
    );
};

export default RegisterSport;
