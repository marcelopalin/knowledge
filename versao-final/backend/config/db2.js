const connMongDB = require('mongoose');

connMongDB
  .connect(
    'mongodb://admin_knowledge:knowledge@127.0.0.1:27017/knowledge_mongo_db',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  )
  .catch(e => {
    const msg = 'ERRO! Não foi possível conectar com o MongoDB!';
    console.log(msg);
  });

module.exports = connMongDB;
