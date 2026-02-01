module.exports = {
  apps: [
    {
      name: "shortlink",
      script: "backend/dist/app.js",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
