const mongoose = require('mongoose');

const connectDBMongo = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
  console.log(
    `MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold,
  );
};

/* Exportando a conexão e importando em inde.js */
module.exports = connectDBMongo;
