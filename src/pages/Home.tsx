import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonText } from '@ionic/react';
import './Home.css';

const Home: React.FC = () => {
    const [response, setResponse] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [showInstallButton, setShowInstallButton] = useState<boolean>(false);
    const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);

    useEffect(() => {
        const handleBeforeInstallPrompt = (event: Event) => {
            event.preventDefault();
            setDeferredPrompt(event);
            setShowInstallButton(true); // Show install button when prompt is available
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const paymentDetails = {
            paymentAmount: (document.getElementById('amount') as HTMLInputElement).value,
            itemName: (document.getElementById('item_name') as HTMLInputElement).value
        };

        setResponse('Creating payment...');
        setStatus('');

        try {
            const response = await fetch('https://f1hz3gkona.execute-api.eu-west-1.amazonaws.com/prod/payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'ho7jGi35HS3dYbRtwdzfkDSkgCPYzEr4l28KHBpi'
                },
                body: JSON.stringify(paymentDetails)
            });

            const data = await response.json();
            console.log('Response data:', data);

            if (response.ok && data.paymentUrl) {
                setResponse(`Payment URL: <a href="${data.paymentUrl}" target="_blank">${data.paymentUrl}</a>`);
                window.open(data.paymentUrl, '_blank');

                // Start polling for payment status
                const paymentId = data.paymentId;
                const timeout = 60000; // 60 seconds
                const interval = 5000; // 5 seconds
                let elapsedTime = 0;

                const intervalId = setInterval(async () => {
                    try {
                        const statusResponse = await fetch(`https://f1hz3gkona.execute-api.eu-west-1.amazonaws.com/prod/payment-status?payment_id=${paymentId}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'x-api-key': 'ho7jGi35HS3dYbRtwdzfkDSkgCPYzEr4l28KHBpi'
                            }
                        });

                        const statusData = await statusResponse.json();
                        console.log('Status data:', statusData);

                        if (statusResponse.ok) {
                            setStatus(`Payment Status: ${statusData.payment_status}`);
                            if (statusData.payment_status === 'completed') {
                                clearInterval(intervalId);
                                // Show install button after payment is completed
                                setShowInstallButton(true);
                            }
                        } else {
                            setStatus(`Error fetching payment status: ${statusData.message}`);
                        }
                    } catch (error) {
                        setStatus(`Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
                    }

                    elapsedTime += interval;
                    if (elapsedTime >= timeout) {
                        clearInterval(intervalId);
                        setStatus((prevStatus) => prevStatus + '<br>Polling timed out after 60 seconds.');
                    }
                }, interval); // Poll every 5 seconds
            } else {
                setResponse(`Error: ${data.message}`);
            }
        } catch (error) {
            setResponse(`Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
        }
    };

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            (deferredPrompt as any).prompt();
            const result = await (deferredPrompt as any).userChoice;
            if (result.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            setDeferredPrompt(null);
            setShowInstallButton(false);
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Create Payment</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Create Payment</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <div className="ion-text-center">
                    <h1>Guest Account</h1>
                    <h3>1 Day Fibertime Payment</h3>
                    <form onSubmit={handleFormSubmit}>
                        {/* Hidden inputs */}
                        <input type="text" id="amount" value="5" name="amount" style={{ display: 'none' }} required />
                        <input type="text" id="item_name" name="item_name" value="1 Day Fibertime" style={{ display: 'none' }} required />

                        <IonButton expand="full" type="submit">Create Payment</IonButton>
                    </form>

                    <IonText color="medium">
                        <div dangerouslySetInnerHTML={{ __html: response }}></div>
                    </IonText>
                    <IonText color="medium">
                        <div dangerouslySetInnerHTML={{ __html: status }}></div>
                    </IonText>
                    {showInstallButton && (
                        <IonButton expand="full" onClick={handleInstallClick}>Install App</IonButton>
                    )}
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Home;