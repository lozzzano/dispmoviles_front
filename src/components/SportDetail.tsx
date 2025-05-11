import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const SportDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [sport, setSport] = useState<Sport | null>(null);
    const [seguido, setSeguido] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    const usuario_id = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!usuario_id || !token) {
            setError("Usuario no autenticado.");
            setLoading(false);
            return;
        }

        // Obtener la información del deporte
        axios.get(`http://127.0.0.1:8000/api/deportes/${id}`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
        .then(response => {
            setSport(response.data);
            setLoading(false);
        })
        .catch(error => {
            console.error("Error al cargar el deporte:", error);
            setError("No se pudo cargar la información del deporte.");
            setLoading(false);
        });

        // Verificar si el usuario ya sigue el deporte
        axios.get(`http://127.0.0.1:8000/api/deportes/seguidos/${usuario_id}`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
        .then(response => {
            const seguidos = response.data.map((d: Sport) => d.id);
            setSeguido(seguidos.includes(parseInt(id)));
        })
        .catch(error => console.error("Error al verificar seguimiento:", error));
        
    }, [id, usuario_id, token]);

    // Manejar el seguimiento del deporte con actualización en tiempo real
    const handleSeguir = () => {
        axios.post(`http://127.0.0.1:8000/api/deportes/${id}/seguir`, { usuario_id }, {
            headers: { "Authorization": `Bearer ${token}` }
        })
        .then(() => {
            setSeguido(true);
            setSport(prevSport => prevSport ? { ...prevSport, seguidores: prevSport.seguidores + 1 } : null);
        })
        .catch(error => console.error("Error al seguir el deporte:", error));
    };

    // Manejar la acción de dejar de seguir con actualización en tiempo real
    const handleDejarSeguir = () => {
        axios.delete(`http://127.0.0.1:8000/api/deportes/${id}/dejar-seguir`, {
            data: { usuario_id },
            headers: { "Authorization": `Bearer ${token}` }
        })
        .then(() => {
            setSeguido(false);
            setSport(prevSport => prevSport ? { ...prevSport, seguidores: prevSport.seguidores - 1 } : null);
        })
        .catch(error => console.error("Error al dejar de seguir el deporte:", error));
    };

    if (loading) {
        return <div className="container text-center">Cargando...</div>;
    }

    if (error) {
        return <div className="container text-danger text-center">{error}</div>;
    }

    return (
        <div className="container d-flex flex-column align-items-center text-center p-4">
            {sport ? (
                <>
                    {/* TÍTULO DEL DEPORTE */}
                    <h1 className="mb-4 fw-bold">{sport.nombre}</h1>

                    {/* IMAGEN DEL DEPORTE */}
                    {sport.imagen && (
                        <div className="mb-4">
                            <img 
                                src={sport.imagen} 
                                alt={sport.nombre} 
                                className="img-fluid rounded shadow-lg"
                                style={{ maxWidth: "350px", height: "auto", borderRadius: "15px" }}
                            />
                        </div>
                    )}

                    {/* CONTADOR DE SEGUIDORES */}
                    <p className="text-white fs-5">
                        <i className="bi bi-people-fill me-2"></i> {sport.seguidores} {sport.seguidores === 1 ? "seguidor" : "seguidores"}
                    </p>

                    {/* DESCRIPCIÓN */}
                    <p className="text-white fs-5">{sport.descripcion}</p>

                    {/* BOTONES DE SEGUIR Y VOLVER */}
                    <div className="d-flex justify-content-center gap-3 mt-4">
                        {seguido ? (
                            <button className="btn btn-danger px-4 py-2" onClick={handleDejarSeguir}>
                                <i className="bi bi-x-circle me-2"></i> Dejar de Seguir
                            </button>
                        ) : (
                            <button className="btn btn-success px-4 py-2" onClick={handleSeguir}>
                                <i className="bi bi-plus-circle me-2"></i> Seguir
                            </button>
                        )}

                        <Link to="/home/sports" className="btn btn-secondary px-4 py-2">
                            <i className="bi bi-arrow-left me-2"></i> Volver al Catálogo
                        </Link>
                    </div>
                </>
            ) : (
                <p className="text-danger fs-4">Deporte no encontrado.</p>
            )}
        </div>
    );
};

export default SportDetail;
