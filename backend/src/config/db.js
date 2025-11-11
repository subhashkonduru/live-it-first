const mongoose = require('mongoose');

module.exports = function connect(mongoUri) {
  const uri = mongoUri || process.env.MONGO_URI;
  return mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
};
