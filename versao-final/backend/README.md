# 1. PROJETO BACKEND ORIGINAL

O projeto original do curso foi feito em POSTGRES e nós vamos alterá-lo para o MYSQL.
O Knex que vamos utilizar para acessar o BD relacional. Vamos remover o componente
"pg": "7.4.3" e vamos instalar o pacote mysql.

Tabelas: 
- Users
- Categories
- Articles


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

# ENTENDENDO COMO FUNCIONA O CONSIGN

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

# BANCO DE DADOS - KNEX - BD RELACIONAL - MIGRATIONS

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

# MIGRATION


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


# RUM MIGRATIONS - Aula 347

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