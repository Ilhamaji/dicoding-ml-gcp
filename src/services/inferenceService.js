const tf = require("@tensorflow/tfjs-node");
const inputError = require("../Exception/InputError");

async function predictClassification(model, image) {
  try {
    const tensor = tf.node
      .decodeJpeg(image)
      .resizeNearestNeighbor([224, 224])
      .expandDims()
      .toFloat();

    const prediction = model.predict(tensor);
    const score = await prediction.data();
    const confidenceScore = Math.max(...score) * 100;
    const classResult = tf.argMax(prediction, 1).dataSync()[0];
    const classes = ["Cancer", "Non-cancer"];
    let label = classes[classResult];
    const treshold = 50;

    if (confidenceScore < treshold) {
      label = "Non-cancer";
    }

    let suggestion;

    if (label === "Cancer") {
      suggestion = "Segera periksa ke dokter!";
    } else {
      suggestion = "Penyakit kanker tidak terdeteksi.";
    }

    return { label, suggestion, confidenceScore };
  } catch (error) {
    throw new inputError(`terjadi kesalahan input: ${error.message}`);
  }
}

module.exports = { predictClassification };
