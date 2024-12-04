const { Firestore } = require("@google-cloud/firestore");

const loadData = async () => {
  const db = new Firestore();
  const historiesCollection = db.collection("predictions");
  const snapshot = await historiesCollection.get();
  const histories = [];

  snapshot.forEach((doc) => {
    histories.push({ id: doc.id, ...doc.data() });
  });

  return histories;
};

module.exports = { loadData };
