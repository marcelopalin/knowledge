const db = require('../config/db');

/** Chame o código com Ctrl+Alt+N - o resultado é uma promisse */
/** Depois de rodar não esqueça de Finalizar o código pois o Knex
 * abre o Pool de conexão e não fecha (Padrão)
 */
// db('users')
//   .count('id as count')
//   .first()
//   .then(res => console.log(res.count));

/** Usando async / await */

const conta = async () => {
  const res = await db('users')
    .count('id as contagem')
    .first();
  return res.contagem;
};

conta().then(res => console.log(res));
