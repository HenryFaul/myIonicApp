import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonText, IonButton } from '@ionic/react';
import './payment-successful.page.css';

const PaymentSuccessful: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Payment Successful</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <div className="ion-text-center">
                    <h1>Payment Successful!</h1>
                    <IonText color="medium">
                        <p>Your payment has been processed successfully. Thank you for your purchase.</p>
                    </IonText>
                    <IonButton expand="full" routerLink="/home">Back to Home</IonButton>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default PaymentSuccessful;