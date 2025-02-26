import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';

interface Sport {
    id: number;
    nombre: string; // Asegúrate de usar el nombre correcto de la API
    descripcion: string;
    icon?: string;
}

const SportsCatalog: React.FC = () => {
    const [sports, setSports] = useState<Sport[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log('Token para la petición:', token);
        
        axios.get('https://dispmovilesapi-production.up.railway.app/api/deportes', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            console.log('Datos de deportes:', response.data);
            setSports(response.data);
        })
        .catch(error => {
            console.error('Error al obtener los deportes:', error);
        });
    }, []);
    
    const filteredSports = sports.filter(sport =>
        sport.nombre.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container">
            <h1 className="mb-4">Catálogo de Deportes</h1>
            
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
                                {sport.icon && <i className={`bi ${sport.icon} display-1 mb-3`}></i>}
                                <h5 className="card-title">{sport.nombre}</h5>
                                <p className="card-text">{sport.descripcion}</p>
                                <Link to={`/sports/${sport.id}`} className="btn btn-primary">
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
