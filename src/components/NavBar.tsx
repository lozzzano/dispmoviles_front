import React from 'react';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton } from '@ionic/react';
import { Link } from 'react-router-dom';

const NavBar: React.FC = () => {
    return (
        <IonHeader>
            <IonToolbar color="dark">
                <IonTitle>Mi Aplicación</IonTitle>
                <IonButtons slot="end">
                    <Link to="/home">
                        <IonButton color="light">Inicio</IonButton>
                    </Link>
                    <Link to="/clubs">
                        <IonButton color="light">Clubs</IonButton>
                    </Link>
                    <Link to="/eventos">
                        <IonButton color="light">Eventos</IonButton>
                    </Link>
                    <Link to="/perfil">
                        <IonButton color="light">Perfil</IonButton>
                    </Link>
                </IonButtons>
            </IonToolbar>
        </IonHeader>
    );
};

export default NavBar;
