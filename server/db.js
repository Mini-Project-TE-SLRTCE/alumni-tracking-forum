const mongoose = require('mongoose');

// online MongoDB
const { MONGODB_URI: url } = require('./utils/config');

// offline MongoDB
// const url = "mongodb://127.0.0.1:27017/atf";

const connectToDB = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    console.log('Connected to MongoDB!');
  } catch (error) {
    console.error(`Error while connecting to MongoDB: `, error.message);
  }
};

module.exports = connectToDB;
