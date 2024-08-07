// This file is used to register the service worker

const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(
        /^127\.\d+\.\d+\.\d+$/
    )
);

type ServiceWorkerRegistration = {
    waiting?: ServiceWorker;
    installing?: ServiceWorker;
    active?: ServiceWorker;
};

// Register the service worker
export function register(config?: any) {
    if ('serviceWorker' in navigator) {
        const swUrl = `${import.meta.env.BASE_URL}service-worker.js`;

        if (isLocalhost) {
            checkValidServiceWorker(swUrl, config);
        } else {
            registerValidSW(swUrl, config);
        }
    }
}

function registerValidSW(swUrl: string, config?: any) {
    navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
            if (config && config.onUpdate) {
                registration.onupdatefound = () => {
                    const installingWorker = registration.installing;
                    if (installingWorker == null) {
                        return;
                    }
                    installingWorker.onstatechange = () => {
                        if (installingWorker.state === 'installed') {
                            if (navigator.serviceWorker.controller) {
                                console.log('New content is available; please refresh.');
                            } else {
                                console.log('Content is cached for offline use.');
                            }
                        }
                    };
                };
            }
        })
        .catch((error) => {
            console.error('Error during service worker registration:', error);
        });
}

function checkValidServiceWorker(swUrl: string, config?: any) {
    fetch(swUrl)
        .then((response) => {
            const contentType = response.headers.get('Content-Type');
            if (response.status === 404 || (contentType != null && contentType.indexOf('javascript') === -1)) {
                navigator.serviceWorker.ready.then((registration) => {
                    registration.unregister().then(() => {
                        window.location.reload();
                    });
                });
            } else {
                registerValidSW(swUrl, config);
            }
        })
        .catch(() => {
            console.log('No internet connection found. App is running in offline mode.');
        });
}