import React from 'react';
import Sidebar from '../components/Sidebar';
import SportsCatalog from '../components/SportsCatalog';
import { IonPage, IonContent } from '@ionic/react';

const SportsPage: React.FC = () => {
    return (
        <IonPage>
            <IonContent>
                <div className="d-flex" style={{ overflowX: 'hidden' }}>
                    <Sidebar />
                    <div id="main-content" className="flex-grow-1 p-4">
                        <SportsCatalog />
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default SportsPage;
