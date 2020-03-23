module.exports = function(api) {
    api.cache.using(() => process.env.NODE_ENV === 'production');
    return {
        plugins: api.env('production')
            ? [['transform-remove-console'], ['babel-plugin-idx']]
            : [['babel-plugin-idx']],
        presets: ['babel-preset-expo'],
    };
};
