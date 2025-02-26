import React from 'react';
import Sidebar from '../components/Sidebar';
import { IonPage, IonContent } from '@ionic/react';

const Home: React.FC = () => {
    return (
        <IonPage>
            <div className="d-flex" style={{ overflowX: 'hidden' }}>
                <Sidebar />
                
                {/* Contenido Principal sin necesidad de ajustar márgenes manualmente */}
                <div 
                    id="main-content"
                    className="flex-grow-1 p-3"
                >
                    <div className="container">
                        <h1 className="mb-4 mt-5">Bienvenido a la App Deportiva</h1>
                        <p>El contenido se ajusta dinámicamente según el estado del sidebar.</p>
                        
                        <div className="row">
                            <div className="col-md-4 mb-4">
                                <a href="/clubs" className="text-decoration-none">
                                    <div className="card shadow hover-card">
                                        <div className="card-body text-center">
                                            <i className="bi bi-people-fill display-1 mb-3"></i>
                                            <h5 className="card-title">Explora Clubs</h5>
                                            <p className="card-text">Encuentra y únete a clubs deportivos de tu interés.</p>
                                        </div>
                                    </div>
                                </a>
                            </div>

                            <div className="col-md-4 mb-4">
                                <a href="/eventos" className="text-decoration-none">
                                    <div className="card shadow hover-card">
                                        <div className="card-body text-center">
                                            <i className="bi bi-calendar-event-fill display-1 mb-3"></i>
                                            <h5 className="card-title">Participa en Eventos</h5>
                                            <p className="card-text">Asiste y participa en eventos deportivos organizados.</p>
                                        </div>
                                    </div>
                                </a>
                            </div>

                            <div className="col-md-4 mb-4">
                                <a href="/perfil" className="text-decoration-none">
                                    <div className="card shadow hover-card">
                                        <div className="card-body text-center">
                                            <i className="bi bi-person-fill display-1 mb-3"></i>
                                            <h5 className="card-title">Tu Perfil</h5>
                                            <p className="card-text">Gestiona tu perfil, notificaciones y más.</p>
                                        </div>
                                    </div>
                                </a>
                            </div>

                            <div className="col-md-4 mb-4">
                                <a href="/home/sports" className="text-decoration-none">
                                    <div className="card shadow hover-card">
                                        <div className="card-body text-center">
                                            <i className="bi bi-trophy display-1 mb-3"></i>
                                            <h5 className="card-title">Catálogo de Deportes</h5>
                                            <p className="card-text">Encuentra tu deporte favorito y explora nuevas oportunidades.</p>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </IonPage>
    );
};

export default Home;
