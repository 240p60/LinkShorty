module.exports = {
  apps: [
    {
      name: "shortlink",
      script: "backend/dist/app.js",
      cwd: "/opt/LinkShorty",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
