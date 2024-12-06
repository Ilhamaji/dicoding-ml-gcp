"use strict";

require("dotenv").config();
const Hapi = require("@hapi/hapi");
const routes = require("./src/routes");
const { loadModel } = require("./src/services/loadModel");
const inputError = require("./src/Exception/InputError");

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 8080,
    host: process.env.HOST || "localhost",
    routes: {
      cors: {
        origin: ["*"], // Mengaktifkan CORS untuk semua origin
      },
    },
  });

  const model = await loadModel();
  server.app.model = model;
  server.route(routes);
  server.ext("onPreResponse", function (request, h) {
    const response = request.response;

    if (response instanceof inputError) {
      const newResponse = h.response({
        status: "fail",
        message: "Silahkan gunakan foto lain !",
      });
      newResponse.code(400);
      return newResponse;
    }

    if (response.isBoom) {
      const newResponse = h.response({
        status: "fail",
        message: response.message,
      });
      newResponse.code(response.output.statusCode);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
