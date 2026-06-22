module.exports = {
  apps: [
    {
      name: 'agung-sundoro-digital',
      script: 'serve',
      env: {
        PM2_SERVE_PATH: 'dist',
        PM2_SERVE_PORT: 1012,
        PM2_SERVE_SPA: 'true',
      },
    },
  ],
}
