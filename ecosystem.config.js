module.exports = {
  apps: [
    {
      name: 'server_app',
      script: './dist/src/app.js',
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
