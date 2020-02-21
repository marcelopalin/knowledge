const dotenv = require("dotenv");
const app = require('express')()
const consign = require('consign')
const db = require('./config/db')
const mongoose = require('mongoose')

dotenv.config({ path: "./config/config.env" });
const connectDBMongo = require('./config/mongodb');
// require('./config/mongodb')

/** BD knowledge_mongo_db */
connectDBMongo();

app.db = db
app.mongoose = mongoose

/** Obs:
 * A ordem da carga é importante, precisamos carregar as rotas depois
 * de carregarmos os arquivos com as funções da pasta api.
 */
consign()
    .include('./config/passport.js')
    .then('./config/middlewares.js')
    .then('./api/validation.js')
    .then('./api') /** Leia os arquivos da pasta */
    .then('./schedule')
    .then('./config/routes.js') /** Apenas para ter controle vamos carregar arquivo por arquivo */
    .into(app)

app.listen(3000, () => {
    console.log(
        `Backend Connected: ${process.env.PORT}`.cyan.underline.bold,
      );
})