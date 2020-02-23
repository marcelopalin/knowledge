const dotenv = require('dotenv');
const app = require('express')();
const consign = require('consign');
const mongoose = require('mongoose');
const colors = require('colors');
const db = require('./config/db');

dotenv.config({ path: './config/config.env' });
const connectDBMongo = require('./config/mongodb');
// require('./config/mongodb')

/** BD knowledge_mongo_db */
connectDBMongo();

app.db = db;
app.mongoose = mongoose;

/** Obs:
 * A ordem da carga é importante, precisamos carregar as rotas depois
 * de carregarmos os arquivos com as funções da pasta api.
 */
consign()
  .include('./config/passport.js')
  .then('./middlewares/middlewares.js')
  .then('./middlewares/morgan.js')
  .then('./middlewares/errorHandler.js')
  .then(
    './middlewares/logger.js',
  ) /** Apenas para entender como funciona o middleware */
  .then('./api/validation.js')
  .then('./api') /** Leia os arquivos da pasta */
  .then('./schedule')
  /** Apenas para ter controle vamos carregar arquivo por arquivo */
  .then('./routes/articles.js')
  .then('./routes/categories.js')
  .then('./routes/login.js')
  .then('./routes/stats.js')
  .then('./routes/users.js')
  .into(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `Backend Connected: ${process.env.PORT}`.cyan.underline.bold,
  );
});
