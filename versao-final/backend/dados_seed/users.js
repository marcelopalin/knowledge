const bcrypt = require('bcrypt-nodejs');

const getHash = pass => {
  // Se usasse bcrypt.genSalt espera uma callback
  const salt = bcrypt.genSaltSync();
  const senhaFinal = bcrypt.hashSync(pass, salt);
  console.log(senhaFinal);
  return senhaFinal;
};

module.exports = [
  {
    name: 'Marcelo Facio Palin',
    email: 'palin@mail.com',
    password: getHash('senha123'),
    admin: true,
  },
  {
    name: 'Autor Artigos 01',
    email: 'autor01@mail.com',
    password: getHash('senha123'),
    admin: false,
  },
  {
    name: 'Autor Artigos 02',
    email: 'autor02@mail.com',
    password: getHash('senha123'),
    admin: false,
  },
];
