/* eslint-env browser */

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker
            .register('SW_PUBLIC_URL/expo-service-worker.js', {
                scope: 'SW_PUBLIC_SCOPE',
            })
            .then(function (registration) {
                console.info('Registered service-worker', registration);
                registration.unregister().then(function (boolean) {
                    // if boolean = true, unregister is successful
                });
            })
            .catch(function (error) {
                console.info('Failed to register service-worker', error);
            });
    });
}
