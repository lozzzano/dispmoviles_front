import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Sidebar: React.FC = () => {
    const location = useLocation();
    const [show, setShow] = useState(true);

    const handleToggle = () => {
        setShow(!show);
    };

    const isActive = (path: string) => {
        return location.pathname === path ? 'active' : '';
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    useEffect(() => {
        // Ajustar el margen del contenido principal automáticamente
        const contentElement = document.getElementById('main-content');
        if (contentElement) {
            contentElement.style.marginLeft = show ? '200px' : '0';
            contentElement.style.transition = 'margin-left 0.3s';
        }
    }, [show]);

    return (
        <div>
            {/* Sidebar Deslizante */}
            <div 
                className="bg-dark text-white vh-100 p-3 position-fixed top-0"
                style={{ 
                    width: '200px',
                    left: show ? '0' : '-200px',
                    transition: 'left 0.3s',
                    zIndex: 1040,
                    overflow: 'hidden'
                }}
            >
                <h5 className="mb-4 mt-5">App Deportiva</h5>
                <ul className="nav flex-column">
                    <li className={`nav-item mb-2 ${isActive('/home')}`}>
                        <Link to="/home" className="nav-link text-white" onClick={handleToggle}>
                            <i className="bi bi-house-door-fill me-2"></i>
                            Inicio
                        </Link>
                    </li>
                    <li className={`nav-item mb-2 ${isActive('/home/sports')}`}>
                        <Link to="/home/sports" className="nav-link text-white" onClick={handleToggle}>
                            <i className="bi bi-calendar-event-fill me-2"></i>
                            Deportes
                        </Link>
                    </li>
                    <li className={`nav-item mb-2 ${isActive('/clubs')}`}>
                        <Link to="/clubs" className="nav-link text-white" onClick={handleToggle}>
                            <i className="bi bi-people-fill me-2"></i>
                            Clubs
                        </Link>
                    </li>
                    <li className={`nav-item mb-2 ${isActive('/eventos')}`}>
                        <Link to="/eventos" className="nav-link text-white" onClick={handleToggle}>
                            <i className="bi bi-calendar-event-fill me-2"></i>
                            Eventos
                        </Link>
                    </li>
                    <li className={`nav-item mb-2 ${isActive('/perfil')}`}>
                        <Link to="/perfil" className="nav-link text-white" onClick={handleToggle}>
                            <i className="bi bi-person-fill me-2"></i>
                            Perfil
                        </Link>
                    </li>
                    <li className="nav-item mt-5">
                        <button onClick={handleLogout} className="btn btn-danger w-100">
                            <i className="bi bi-box-arrow-right me-2"></i>
                            Cerrar Sesión
                        </button>
                    </li>
                </ul>
            </div>

            {/* Botón de Menú Hamburguesa SIEMPRE visible */}
            <button 
                className="btn position-fixed top-0 start-0 m-2" 
                onClick={handleToggle}
                style={{ zIndex: 1050 }}
            >
                <i className="bi bi-list text-white" style={{ fontSize: '1.5rem' }}></i>
            </button>
        </div>
    );
};

export default Sidebar;
