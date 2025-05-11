import React from "react";
import { IonItem, IonLabel } from "@ionic/react";

interface ForumProps {
    id: number;
    titulo: string;
    usuario_id: number;
}

const ForumItem: React.FC<ForumProps> = ({ id, titulo, usuario_id }) => {
    return (
        <IonItem routerLink={`/home/forums/${id}`}>
            <IonLabel>
                <h2>{titulo}</h2>
                <p>Creado por Usuario {usuario_id}</p>
            </IonLabel>
        </IonItem>
    );
};

export default ForumItem;
