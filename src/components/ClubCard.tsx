import {
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonCardSubtitle,
    IonImg,
    IonButton,
    IonBadge,
  } from '@ionic/react';
  
  interface Club {
    id: number;
    nombre: string;
    descripcion: string;
    cantidad_miembros?: number;
    rol?: 'miembro' | 'admin';
    imagen?: string;
  }
  
  interface Props {
    club: Club;
    unido: boolean;
    onUnirse: () => void;
    onVer: () => void;
    onAbandonar?: () => void;
  }  
  
  const ClubCard: React.FC<Props> = ({ club, unido, onUnirse, onVer, onAbandonar }) => {
    return (
      <IonCard className="club-card">
        {club.imagen && (
          <IonImg
            src={club.imagen}
            alt={`Imagen de ${club.nombre}`}
            style={{ objectFit: 'cover', height: '180px', width: '100%' }}
          />
        )}
  
        <IonCardHeader>
          <IonCardTitle className="ion-text-capitalize">
            {club.nombre}{' '}
            {club.rol === 'admin' && <IonBadge color="warning">Admin</IonBadge>}
            {club.rol === 'miembro' && <IonBadge color="success">Miembro</IonBadge>}
          </IonCardTitle>
          <IonCardSubtitle>
            Miembros: {club.cantidad_miembros ?? '—'}
          </IonCardSubtitle>
        </IonCardHeader>
  
        <IonCardContent>
          <p>{club.descripcion}</p>
  
       {unido ? (
        <>
          <IonButton expand="block" color="primary" onClick={onVer}>
            Ver detalles
          </IonButton>

          {club.rol !== 'admin' && (
            <IonButton expand="block" color="danger" onClick={onAbandonar}>
              Abandonar
            </IonButton>
          )}
        </>
      ) : (
        <IonButton expand="block" onClick={onUnirse}>
          Unirse al club
        </IonButton>
      )}

        </IonCardContent>
      </IonCard>
    );
  };
  
  export default ClubCard;
  