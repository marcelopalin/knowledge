const config = require('../knexfile.js');
const knex = require('knex')(config);

// Este código não deve ser utilizado no projeto
// Este comando deve ser executado no SETUP MANUALMENTE
// knex.migrate.latest([config])
module.exports = knex;
