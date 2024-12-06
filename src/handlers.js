const nanoid = require("nanoid");
const { predictClassification } = require("./services/inferenceService");
const { storeData } = require("./services/storeData");
const { loadData } = require("./services/loadData");

const predictHandler = async (request, h) => {
  try {
    const { image } = request.payload;
    const { model } = request.server.app;

    if (image.length > 1000000) {
      return h
        .response({
          status: "fail",
          message:
            "Payload content length greater than maximum allowed: 1000000",
        })
        .code(413);
    }

    const { label, suggestion } = await predictClassification(model, image);
    const id = nanoid(36);
    const createdAt = new Date().toISOString();
    const data = {
      id: id,
      result: label,
      suggestion: suggestion,
      createdAt: createdAt,
    };

    await storeData(id, data);

    return h
      .response({
        status: "success",
        message: "Model is predicted successfully",
        data,
      })
      .code(201);
  } catch (error) {
    return h
      .response({
        status: "fail",
        message: "Terjadi kesalahan dalam melakukan prediksi",
      })
      .code(400);
  }
};

const getHistoryHandler = async (request, h) => {
  try {
    const history = await loadData();

    return h
      .response({
        status: "success",
        data: history,
      })
      .code(200);
  } catch (error) {
    return h
      .response({
        status: "fail",
        message: "Terjadi kesalahan dalam menerima data",
      })
      .code(400);
  }
};

module.exports = { predictHandler, getHistoryHandler };
