const { predictHandler, getHistoryHandler } = require("./handlers");

const routes = [
  {
    method: "POST",
    path: "/predict",
    handler: predictHandler,
    options: {
      payload: {
        allow: "multipart/form-data", // Mengizinkan file upload
        multipart: true,
        maxBytes: 1000000,
      },
    },
  },

  {
    method: "GET",
    path: "/predict/histories",
    handler: getHistoryHandler,
  },
];

module.exports = routes;
