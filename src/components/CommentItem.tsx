import React from "react";
import { IonItem, IonLabel } from "@ionic/react";

interface CommentProps {
    contenido: string;
}

const CommentItem: React.FC<CommentProps> = ({ contenido }) => {
    return (
        <IonItem>
            <IonLabel>{contenido}</IonLabel>
        </IonItem>
    );
};

export default CommentItem;
