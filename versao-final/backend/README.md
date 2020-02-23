# 1. PROJETO BACKEND ORIGINAL

O projeto original do curso foi feito em POSTGRES e nós vamos alterá-lo para o MYSQL.
O Knex que vamos utilizar para acessar o BD relacional. Vamos remover o componente
"pg": "7.4.3" e vamos instalar o pacote mysql.

Tabelas: 
- Users
- Categories
- Articles

OBS: ao mudarmos o KNEX com MYSQL - é preciso rever o retorno das consultas, pois é diferente do retorno do POSTGRES. Provavelmente não irão funcionar as consultas das estatísticas nem a consulta aninhada.

Utilize o código da pasta **testando** para conseguir visualizar o que precisa.


A aplicação é formada pelo **backend** e **frontend**. O **backend** precisa do **NODEJS** para executar, porém, o **frontend** será apenas **construído** usando o **NODEJS** gerando arquivos estáticos que serão disponibilizados pelo servidor **NGNIX** - também podemos configurar o S3 da Amazon para servir os arquivos do FRONTEND!.
Mesmo que a a aplicação rode na MESMA MÁQUINA nós só iremos acessar a API se habilitarmos o CORS!! (que está nas nossas dependências).

O CORS será importando dentro do arquivo **middleware.js**:

```javascript
const bodyParser = require('body-parser')
const cors = require('cors')

/** Padrão do Consign */
module.exports = app => {
    /** Utilizamos o método use para aplicar o Middleware */
    app.use(bodyParser.json())
    app.use(cors())
}
```

No **index.js** diremos para o **consign** injetar o **app** na função de middleware e carregá-los como padrão:

index.js
```javascript

const dotenv = require("dotenv");
const app = require('express')();
const consign = require('consign');

/** Esta parte fica responsável por passar o app para
 * os middlewares para injetarem o cors e o body.parser
 * no meu app
 */
consign()
    .then('./config/middlewares.js')
    .into(app)
```


OBS: este projeto utiliza o **CONSIGN** que nos ajuda a lidar com as dependências.
O **const app = require('express')** dentro de index.js é nosso centralizador e o **CONSIGN** será o responsável por CENTRALIZAR tudo dentro de **app**

Porém, lembre-se que devemos seguir um **PADRÃO DO CONSIGN** que sempre coloca no final dos arquivos:

```javascript
module.exports = app => {

}
```

# 2. OUTROS PACOTES ALÉM DO CONSIGN

Também vamos utilizar o pacote **colors** e **dotenv**.

Já ajustei o package.json:

```json
  "dependencies": {
    "bcrypt-nodejs": "0.0.3",
    "body-parser": "1.18.3",
    "consign": "0.1.6",
    "cors": "2.8.4",
    "express": "4.16.3",
    "jwt-simple": "0.5.1",
    "knex": "0.15.2",
    "moment": "2.22.2",
    "mongoose": "^5.2.17",
    "node-schedule": "1.3.0",
    "passport": "0.4.0",
    "passport-jwt": "4.0.0",
    "mysql": "^2.18.1",
    "colors": "^1.4.0",
    "pm2": "3.0.4"
  },
```

Não esqueça de importá-los no index.js:
```javascript
const colors = require('colors')
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
```

E o acesso as variáveis do config/config.env se darão fazendo:

```javascript
process.env.CONSTANTE
```


# 3. KNEX GLOBAL OU LOCAL

Temos o knex instalado na forma LOCALMENTE, para utilizá-lo sempre faça:

```
npx knex ....
```


# 4. CRIANDO O BD FINAL - AGORA EM MYSQL


```sql
BD knowledge_db;
User: admin_knowledge
Pass: knowledge

CREATE DATABASE knowledge_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
CREATE USER 'admin_knowledge'@'localhost' IDENTIFIED BY 'knowledge';
CREATE USER 'admin_knowledge'@'%' IDENTIFIED WITH mysql_native_password BY 'knowledge';
GRANT ALL PRIVILEGES ON *.* TO 'admin_knowledge'@'localhost';
GRANT ALL PRIVILEGES ON *.* TO 'admin_knowledge'@'%';
flush privileges;
quit;
```

# 5. CRIANDO O BD FINAL EM MONGODB

Conexão com o BD knowledge_mongo_db

USER: admin_knowledge
PASS: knowledge
BD: knowledge_mongo_db

# 6. CRIANDO UM BANCO DE DADOS e UM USUARIO ADMIN DO BD

1) Autentique-se com administrador do MongoDB, alterne para o BD admin

```
mongo -u mpi -p 
use admin
```

2) Execute o comando:

```json
> use knowledge_mongo_db
switched to db knowledge_mongo_db
> db.createUser(
...    {
...      user: "admin_knowledge",
...      pwd:  "knowledge", //passwordPrompt(), 
...      roles: [ { role: "readWrite", db: "knowledge_mongo_db" }]
...    }
...  )
Successfully added user: {
	"user" : "admin_knowledge",
	"roles" : [
		{
			"role" : "readWrite",
			"db" : "knowledge_mongo_db"
		}
	]
}
```

# 7. URI de Conexão com o MongoDB

```ini
# MONGODB 
MONGO_URI=mongodb://admin_knowledge:knowledge@127.0.0.1:27017/knowledge_mongo_db
```

# 8. CONEXAO COM O BD MONGO

O arquivo de conexão atual é:

```javascript
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/knowledge_stats', { useNewUrlParser: true })
    .catch(e => {
        const msg = 'ERRO! Não foi possível conectar com o MongoDB!'
        console.log('\x1b[41m%s\x1b[37m', msg, '\x1b[0m')
    })
```

Nós vamos alterá-lo para:

config/mongodb.js:

```javascript
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
```

# 9. Conexão no index.js:

```javascript
require('dotenv').config();
const connectDBMongo = require('./config/mongodb');

/** BD knowledge_mongo_db */
connectDBMongo();

server.listen().then(({ url }) => {
  console.log(`Executando em ${url}`);
});
```


# 10. EXTRA - DOTENV

Obs: caso deseje trocar o arquivo onde estão as variáveis utilize o seguinte
comando:

```javascript
const dotenv = require("dotenv");

dotenv.config({ path: "./config/config.env" });
```

# 11. CRIANDO O .ENV EM CONFIG.ENV para usarmos o DOTENV

O projeto original não utiliza o pacote **dotenv** nós por sua vez alteraremos
isto.

O que o projeto atual utiliza é o arquivo .env configurado assim:

```javascript
module.exports = {
    authSecret: '',
    db: {
        host : '127.0.0.1',
        port: 5432,
        database: '',
        user: '',
        password: ''
    }
}
```

Porém, nós instalaremos o **dotenv@8.2.0** e conviguraremos o arquivo **.env** da seguinte maneira:

```
npm i -S dotenv
```

O nosso arquivo de configuração será alterado para **config/config.env** e ele terá o seguinte conteúdo:

```ini
NODE_ENV=development

# MYSQL
APP_DB_HOST=localhost
APP_DB_PORT=3306
APP_DB_NAME=knowledge_db
APP_DB_USER=admin_knowledge
APP_DB_PASSWORD=knowledge

APP_AUTH_SECRET=ADADFDAKFJASDFJADSJFA

# MONGODB 
MONGO_URI=mongodb://admin_knowledge:knowledge@127.0.0.1:27017/knowledge_mongo_db
```

Para utilizá-lo basta importar:

```javascript
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
```


# 12. ALTERANDO O KNEXFILE


Atual do curso:

```javascript
const { db } = require('./.env')

module.exports = {
	client: 'postgresql',
	connection: db,
	pool: {
		min: 2,
		max: 10
	},
	migrations: {
		tableName: 'knex_migrations'
	}
};
```

Vamos alterá-lo para:

```javascript
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

module.exports = {
  client: 'mysql',
  connection: {
    host: process.env.APP_DB_HOST,
    port: process.env.APP_DB_PORT,
    database: process.env.APP_DB_NAME,
    user: process.env.APP_DB_USER,
    password: process.env.APP_DB_PASSWORD,
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
  },
};
```

Isto será testado quando formos rodar as migrations para criar as tabelas do BD:

```
npx knex migrate:latest
```

# 13. ENTENDENDO COMO FUNCIONA O CONSIGN

Vamos criar uma pasta chamada **api** e dentro vamos criar todos os códigos da nossa api.
Para entendermos melhor, criamos o arquivo **api\user.js** e o arquivo **config\routes.js**.

Ambos foram carregados pelo **consign** em index.js:

```javascript
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
```

# 14. BANCO DE DADOS - KNEX - BD RELACIONAL - MIGRATIONS

Já criamos o BD MySQL chamado:

BD knowledge_db;
User: admin_knowledge
Pass: knowledge

Ao executarmos o **knex init** criaremos o **knexfile.js** e vamos configurá-lo:

```javascript
require('dotenv').config();

module.exports = {
  client: 'mysql',
  connection: {
    host: process.env.APP_DB_HOST,
    port: process.env.APP_DB_PORT,
    database: process.env.APP_DB_NAME,
    user: process.env.APP_DB_USER,
    password: process.env.APP_DB_PASSWORD,
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
  },
};
```

Vamos criar o novo arquivo chamado **config\db.js**:

```javascript
const config = require('../knexfile.js')
const knex = require('knex')(config)

knex.migrate.latest([config])
module.exports = knex
```

> COMO VAMOS UTILIZÁ-LO?

```javascript
/** db = knex */
const db = require('./config/db')

/** Vamos adicionar dentro de app */
app.db = db
```

Com a variável **db** que nós vamos fazer os comandos SELECT... 

# 15. MIGRATION


```
npx knex migrate:make create_table_users
```
Arquivo: migrations\20180927160211_create_table_users.js

```javascript
exports.up = function (knex, Promise) {
    return knex.schema.createTable('users', table => {
        table.increments('id').primary()
        table.string('name').notNull()
        table.string('email').notNull().unique()
        table.string('password').notNull()
        table.boolean('admin').notNull().defaultTo(false)
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('users')
};
```

Antes de prosseguirmos criando os arquivos vamos criar um VALIDADOR.


# 16. RUM MIGRATIONS - Aula 347

Problemas, tive que definir o tamanho do e-mail para 200 caracteres devido ao erro:

```
npx knex migrate:latest
migration file "20181001102706_add_deleted_at_table_users.js" failed
migration failed with error: alter table `users` add unique `users_email_unique`(`email`) - ER_TOO_LONG_KEY: Specified key was too long; max key length is 1000 
bytes
```

Alterei para

```javascript
exports.up = function (knex, Promise) {
    return knex.schema.createTable('users', table => {
        table.increments('id').primary()
        table.string('name').notNull()
        table.string('email', 200).notNull().unique()
        table.string('password').notNull()
        table.boolean('admin').notNull().defaultTo(false)
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('users')
};

```


```
 npx knex migrate:latest
Batch 1 run: 4 migrations 
C:\wamp64\www\_2020\knowledge\versao-final\backend\migrations\20180927160211_create_table_users.js
C:\wamp64\www\_2020\knowledge\versao-final\backend\migrations\20180927160306_create_table_categories.js
C:\wamp64\www\_2020\knowledge\versao-final\backend\migrations\20180927160322_create_table_articles.js
C:\wamp64\www\_2020\knowledge\versao-final\backend\migrations\20181001102706_add_deleted_at_table_users.js
```

# 17. DEPOIS DAS MIGRATIONS - VAMOS CONSTRUIR OS SEEDERS

Vamos criar a pasta **dados_seed** e lá iremos colocar os
arquivos de JSON com os dados que serão inseridos.


## 17.1. SEEDS USERS

Antes de iniciarmos precisaremos criptografar as senhas dos usuários. Para isto vamos instalar o pacote: bcrypt-nodejs.

```
npm i -S bcrypt-nodejs
```

Vamos criar o arquivo de SEED chamado addUsers.js na pasta seed com o comando:

```
npx knex seed:make addUsers --env development
```

O arquivo inicial:

```javascript
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('table_name').del()
    .then(function () {
      // Inserts seed entries
      return knex('table_name').insert([
        {id: 1, colName: 'rowValue1'},
        {id: 2, colName: 'rowValue2'},
        {id: 3, colName: 'rowValue3'}
      ]);
    });
};
```

O arquivo backend\seeds\addUsers.js final:


```javascript
const usersData = require('../dados_seed/users');

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('users').insert(usersData);
    });
};
```

Acerte o arquivo de Dados a serem inseridos conforme a tabela **users**:

Descrição da tabela users:
Field | Type | Null | key | Default | Extra
```js
id	int(10) unsigned	NO	PRI		auto_increment
name	varchar(255)	NO	""		""
email	varchar(200)	NO	UNI		""
password	varchar(255)	NO	""		""
admin	tinyint(1)	NO	""	0	""
deletedAt	timestamp	YES	""		""
```

Nesta tabela o e-mail deve ser único.

backend\dados_seed\users.js

```javascript
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
    name: 'User Comum',
    email: 'user@mail.com',
    password: getHash('senha123'),
    admin: false,
  },
];
```

## 17.2. RODANDO O SEED DE USERS

* Somente depois de ter rodados as Migrations com: **npx knex migrate:latest**
* Rode os seeds com: **npx knex seed:run**
```
npx knex seed:run
```

Se verificarmos a tabela users no BD teremos:

1	Marcelo Facio Palin	palin@mail.com	$2a$10$JqnpzKhxy4QAr2B2Zp96Keu.DHEQttyugUBPF/8H5r5eClbIaFZ0.	1	
2	User Comum	user@mail.com	$2a$10$nQ1L1Y8GYwdvLXQDPhr/BuITIqqzSrEorklPoL.PSvqxKgbl1EZrW	0	


# 18. SEED PARA TABELA CATEGORIES

Descrição da tabela:

Field | Type | Null | key | Default | Extra

```js
id	int(10) unsigned	NO	PRI		auto_increment
name	varchar(255)	NO	""		""
parentId	int(11)	YES	MUL		""
```

O detalhe desta tabela é que o parentId pode ser NULO.

Vamos criar o arquivo de SEED chamado **addCategories.js** na pasta seed com o comando:

```
npx knex seed:make addCategories --env development
```

O arquivo inicial backend\seeds\addCategories.js:

```javascript
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('table_name').del()
    .then(function () {
      // Inserts seed entries
      return knex('table_name').insert([
        {id: 1, colName: 'rowValue1'},
        {id: 2, colName: 'rowValue2'},
        {id: 3, colName: 'rowValue3'}
      ]);
    });
};
```

O arquivo backend\seeds\addCategories.js final:


```javascript
const usersData = require('../dados_seed/users');

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('users').insert(usersData);
    });
};
```

## 18.1. RODANDO O SEED

* Somente depois de ter rodados as Migrations com: **npx knex migrate:latest**

Irá rodar todas os SEEDs novamente. Não há problema pois antes de executar o seed deletamos os dados da tabela para conseguirmos rodar novamente.

```
npx knex seed:run
```
id | name | parentId
1	Frontend	 null
2	 VueJS	    1
3	Javascript	1


# 19. SEED PARA TABELA ARTICLES

Descrição da tabela:

Field | Type | Null | key | Default | Extra

```js
id	int(10) unsigned	NO	PRI		auto_increment
name	varchar(255)	NO	""		""
description	varchar(1000)	NO	""		""
imageUrl	varchar(1000)	YES	""		""
content	blob	NO	""		""
userId	int(11)	NO	MUL		""
categoryId	int(11)	NO	MUL		""
```

O detalhe desta tabela é que o parentId pode ser NULO.

Vamos criar o arquivo de SEED chamado **addArticles.js** na pasta seed com o comando:

```
npx knex seed:make addArticles --env development
```

O arquivo inicial backend\seeds\addArticles.js:

```javascript
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('table_name').del()
    .then(function () {
      // Inserts seed entries
      return knex('table_name').insert([
        {id: 1, colName: 'rowValue1'},
        {id: 2, colName: 'rowValue2'},
        {id: 3, colName: 'rowValue3'}
      ]);
    });
};
```

O arquivo backend\seeds\addArticles.js final:


```javascript
const dados = require('../dados_seed/articles');

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('articles')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('articles').insert(dados);
    });
};
```

## 19.1. DADOS DA TABELA ARTICLES

```javascript
module.exports = [
  {
    name: 'Introdução ao VueJS',
    description: 'Você aprenderá o VueJS do início ao fim',
    content: 'Conteúdo do Curso',
    userId: 2,
    categoryId: 2,
  },
  {
    name: 'Introdução aos Componentes VueJS',
    description: 'Você aprenderá sobre os Componentes do VueJS do início ao fim',
    content: 'Conteúdo do Curso de Componentes de Vue',
    userId: 3,
    categoryId: 2,
  },
  {
    name: 'Introdução ao Javascript',
    description: 'Você aprenderá o Javascript do início ao fim',
    content: 'Conteúdo do Curso de Javascript',
    userId: 3,
    categoryId: 3,
  },

];
```


## 19.2. RODANDO O SEED PARA USERS, CATEGORIES E ARTICLES

* Somente depois de ter rodados as Migrations com: **npx knex migrate:latest**

Irá rodar todas os SEEDs novamente. Não há problema pois antes de executar o seed deletamos os dados da tabela para conseguirmos rodar novamente.

```
npx knex seed:run
```

# EXECUTANDO O BACKEND

O comando **start** executa o nodemon conforme configurado em **package.json**

```json
  "scripts": {
    "start": "nodemon --inspect --ext js,graphql",
    "production": "pm2 start index.js --name knowledge-backend"
  },
```

* A opção **--ext** especifica quais extensões de arquivos o nodemon deve monitorar.
* A opção **--inspect** permite depurarmos a API com o nodemon e VSCode

Como é feita a depuração, marque a linha que está dentro da rota que deseja investigar e chame a rota no browser ou pelo Postman e verá que a requisição ficará parada no VSCode aguardando você.


Atenção:
Como introduzimos o uso do dotenv com as cofigurações no arquivo **config/config.env** temos que alterar os arquivos auth.js e passport.js
para que troquem **authSecret** por **process.env.APP_AUTH_SECRET**

```javascript
// const { authSecret } = require('../.env')
const dotenv = require("dotenv");
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')
dotenv.config({ path: "./config/config.env" })
// substitua authSecret por process.env.APP_AUTH_SECRET
```

```
npm start
```