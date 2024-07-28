const mongoose = require('mongoose');

exports.Connect = async (cb) => {
  try {
    const db = await mongoose.connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8zkrf2w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
      {
        dbName: 'ecom-24',
      }
    );

    cb();
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
};
