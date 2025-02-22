const nextConfig = {
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        minimize: true,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            default: false,
            vendors: false,
            commons: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all'
            },
            shared: {
              name: 'shared',
              minChunks: 2,
              chunks: 'all'
            }
          }
        }
      };
    }
    return config;
  },
  compress: true,
  productionBrowserSourceMaps: false
};

module.exports = nextConfig;
