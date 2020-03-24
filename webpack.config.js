const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function(env, argv) {
    const conf = await createExpoWebpackConfigAsync(env, argv);
    // Customize the config before returning it.
    // adjust Google Workbox (service worker) config to avoid caching problems

    if (conf['plugins']) {
        conf['plugins'].forEach(plugin => {
            // detect workbox plugin
            if (
                plugin['config'] &&
                plugin['config']['swDest'] === 'service-worker.js'
            ) {
                // tell it never to cache index.html or service-worker.js
                plugin['config']['exclude'].push(/index.html/);
                plugin['config']['exclude'].push('/**/*');
                plugin['config']['exclude'].push('static/**/*');
                plugin['config']['exclude'].push(
                    '/static/**/*.{js,html,css,png,jpg,gif}'
                );
                plugin['config']['exclude'].push(/service-worker.js/);

                // (optional) tell it to start new service worker versions immediately, even if tabs
                // are still running the old one.
                plugin['config']['skipWaiting'] = true;
            }
        });
    }

    return conf;
};
