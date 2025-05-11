import React, { useState } from "react";
import { IonItem, IonLabel, IonInput, IonTextarea, IonButton } from "@ionic/react";

interface ForumFormProps {
    onSubmit: (titulo: string, descripcion: string) => void;
    isComment?: boolean;
}

const ForumForm: React.FC<ForumFormProps> = ({ onSubmit, isComment = false }) => {
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");

    const handleSubmit = () => {
        if (!descripcion.trim()) return;
        if (!isComment && !titulo.trim()) return;

        onSubmit(titulo, descripcion);
        setTitulo("");
        setDescripcion("");
    };

    return (
        <>
            {!isComment && (
                <IonItem>
                    <IonLabel position="stacked">Título</IonLabel>
                    <IonInput value={titulo} onIonChange={e => setTitulo(e.detail.value!)} required />
                </IonItem>
            )}
            <IonItem>
                <IonLabel position="stacked">{isComment ? "Comentario" : "Descripción"}</IonLabel>
                <IonTextarea value={descripcion} onIonChange={e => setDescripcion(e.detail.value!)} required />
            </IonItem>
            <IonButton expand="block" color="primary" onClick={handleSubmit}>
                {isComment ? "Comentar" : "Publicar Foro"}
            </IonButton>
        </>
    );
};

export default ForumForm;
