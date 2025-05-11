import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';

interface Sport {
    id: number;
    nombre: string;
    descripcion: string;
    imagen?: string;
}

const SportsCatalog: React.FC = () => {
    const [sports, setSports] = useState<Sport[]>([]);
    const [search, setSearch] = useState('');
    const [seguimientos, setSeguimientos] = useState<number[]>([]); // Almacenar deportes seguidos por el usuario

    const usuario_id = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) return;

        // Obtener todos los deportes
        axios.get("http://127.0.0.1:8000/api/deportes", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => setSports(response.data))
        .catch(error => console.error("Error al obtener los deportes:", error));

        // Obtener los deportes que el usuario ya sigue
        axios.get(`http://127.0.0.1:8000/api/deportes/seguidos/${usuario_id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            const seguidos = response.data.map((sport: Sport) => sport.id);
            setSeguimientos(seguidos);
        })
        .catch(error => console.error("Error al obtener los deportes seguidos:", error));

    }, [token, usuario_id]);

    const filteredSports = sports.filter(sport =>
        sport.nombre.toLowerCase().includes(search.toLowerCase())
    );

    // Función para seguir un deporte
    const handleSeguir = (deporte_id: number) => {
        axios.post(`http://127.0.0.1:8000/api/deportes/${deporte_id}/seguir`, { usuario_id }, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => setSeguimientos(prev => [...prev, deporte_id]))
        .catch(error => console.error("Error al seguir el deporte:", error));
    };

    // Función para dejar de seguir un deporte
    const handleDejarSeguir = (deporte_id: number) => {
        axios.delete(`http://127.0.0.1:8000/api/deportes/${deporte_id}/dejar-seguir`, {
            data: { usuario_id },
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => setSeguimientos(prev => prev.filter(id => id !== deporte_id)))
        .catch(error => console.error("Error al dejar de seguir el deporte:", error));
    };

    return (
        <div className="container">
            <h1 className="mb-4">
                Catálogo de Deportes
                <Link to="/home/sports/create" className="btn btn-primary ms-2">
                    <i className="bi bi-plus-square"></i>
                </Link>
            </h1>

            {/* BARRA DE BÚSQUEDA */}
            <input 
                type="text" 
                className="form-control mb-4" 
                placeholder="Buscar deportes..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            
            <div className="row">
                {filteredSports.map(sport => (
                    <div className="col-md-4 mb-4" key={sport.id}>
                        <div className="card shadow h-100">
                            <div className="card-body text-center">
                                {sport.imagen ? (
                                    <img
                                        src={sport.imagen} 
                                        alt={sport.nombre} 
                                        className="img-fluid rounded mb-3"
                                        style={{ maxHeight: '150px', objectFit: 'cover' }} 
                                    />
                                ) : (
                                    <i className="bi bi-person-arms-up display-1 mb-3"></i>
                                )}
                                
                                <h5 className="card-title">{sport.nombre}</h5>
                                <p className="card-text">{sport.descripcion}</p>

                                {/* BOTÓN DE SEGUIMIENTO */}
                                {seguimientos.includes(sport.id) ? (
                                    <button className="btn btn-danger me-2" onClick={() => handleDejarSeguir(sport.id)}>
                                        <i className="bi bi-x-circle me-2"></i> Siguiendo
                                    </button>
                                ) : (
                                    <button className="btn btn-success me-2" onClick={() => handleSeguir(sport.id)}>
                                        <i className="bi bi-plus-circle me-2"></i> Seguir
                                    </button>
                                )}

                                {/* BOTÓN VER MÁS */}
                                <Link to={`/home/sports/${sport.id}`} className="btn btn-primary">
                                    Ver Más
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SportsCatalog;
