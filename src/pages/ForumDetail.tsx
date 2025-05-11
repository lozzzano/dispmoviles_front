import React, { useEffect, useState } from "react";
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonTextarea, IonButton } from "@ionic/react";
import axios from "axios";
import { useParams, useHistory } from "react-router-dom";
import Sidebar from '../components/Sidebar';

interface Forum {
    id: number;
    titulo: string;
    descripcion: string;
    usuario: { id: number, nombre: string };
    created_at: string;
}

interface Comment {
    id: number;
    contenido: string;
    usuario: { id: number, nombre: string };
    created_at: string;
}

const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString("es-ES", options);
};

const ForumDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    // Si el ID es "create", no renderiza nada aquí
    if (id === "create") {
        return null;
    }

    const [forum, setForum] = useState<Forum | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const history = useHistory();
    const token = localStorage.getItem("token");
    const usuario_id = localStorage.getItem("user_id");

    useEffect(() => {
        if (id === "create") return; 
        axios.get(`http://127.0.0.1:8000/api/foros/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            setForum(response.data);
            setComments(response.data.comentarios || []);
        })
        .catch(error => console.error("Error al obtener foro:", error));
    }, [id]);

    const handleComment = () => {
        if (!newComment.trim()) return;

        axios.post(`http://127.0.0.1:8000/api/foros/${id}/comentarios`, {
            contenido: newComment,
            usuario_id
        }, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            setComments([...comments, response.data]);
            setNewComment("");
        })
        .catch(error => console.error("Error al comentar:", error));
    };

    return (
        <IonPage>
            <IonContent className="ion-padding">
            <div className="d-flex" style={{ overflowX: 'hidden' }}>
                    <Sidebar />
                    <div id="main-content" className="flex-grow-1 p-4">

            <p><strong>Creado por: </strong>{forum?.usuario?.nombre} - <small>{forum?.created_at ? formatDate(forum.created_at) : ""}</small></p>  {/* 👈 Muestra quién creó el foro */}
                <p>{forum?.descripcion}</p>

                <h3>Comentarios</h3>
                <IonList>
                    {comments.map(comment => (
                        <IonItem key={comment.id}>
                            <IonLabel>
                            <p><strong>{comment.usuario?.nombre}</strong> - <small>{formatDate(comment.created_at)}</small></p> {/* 👈 Muestra quién comentó */}
                                <p>{comment.contenido}</p>
                            </IonLabel>
                        </IonItem>
                    ))}
                </IonList>

                <IonItem>
                    <IonLabel position="stacked">Agregar Comentario</IonLabel>
                    <IonTextarea value={newComment} onIonChange={e => setNewComment(e.detail.value!)} />
                </IonItem>
                <IonButton expand="block" color="primary" onClick={handleComment}>
                    Comentar
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

export default ForumDetail;