import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';

interface Sport {
    id: number;
    nombre: string;
    descripcion: string;
    imagen?: string;
}

const SportDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [sport, setSport] = useState<Sport | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get(`/api/deportes/${id}`)
            .then(response => {
                setSport(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error(error);
                setError('No se pudo cargar la información del deporte.');
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <div className="container">Cargando...</div>;
    }

    if (error) {
        return <div className="container text-danger">{error}</div>;
    }

    return (
        <div className="container">
            {sport ? (
                <>
                    <h1 className="mb-4">{sport.nombre}</h1>
                    {sport.imagen && (
                        <div className="mb-4">
                            <img 
                                src={`/storage/${sport.imagen}`} 
                                alt={sport.nombre} 
                                className="img-fluid rounded"
                                style={{ maxHeight: '300px', objectFit: 'cover' }}
                            />
                        </div>
                    )}
                    <p>{sport.descripcion}</p>
                    
                    <Link to="/sports" className="btn btn-secondary mt-4">
                        <i className="bi bi-arrow-left me-2"></i>
                        Volver al Catálogo
                    </Link>
                </>
            ) : (
                <p className="text-danger">Deporte no encontrado.</p>
            )}
        </div>
    );
};

export default SportDetail;
