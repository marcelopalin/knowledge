# 1. CRIANDO ADMINISTRADOR ANTES DE ATIVAR A AUTENTICAÇÃO NO MONGODB

Seja Windows ou Linux, acesse o Mongodb com o comando:

```
mongo
```

Ative o BD "admin" com **use admin**, verifique os usuários com o comando **show users** e verá que não há nenhum usuário.

```json
> use admin
> show users
> db.createUser(
   {
     user: "mpi",
     pwd:  "senha123",   // passwordPrompt()
     roles: [ 
         {role: "userAdminAnyDatabase" , db:"admin"},
         {role: "readWrite", db: "admin" }]
   }
 )
 > db.grantRolesToUser("mpi",["root"])
```

```
 show users
{
        "_id" : "admin.mpi",
        "userId" : UUID("b5413268-f7ae-4fe3-b52d-049f19ea0a61"),
        "user" : "mpi",
        "db" : "admin",
        "roles" : [
                {
                        "role" : "userAdminAnyDatabase",
                        "db" : "admin"
                },
                {
                        "role" : "readWrite",
                        "db" : "admin"
                }
        ],
        "mechanisms" : [
                "SCRAM-SHA-1",
                "SCRAM-SHA-256"
        ]
}
```

# 2. DELETANDO UM USUÁRIO JÁ EXISTENTE

Vamos supor que encontrou um usuário e deseja deletá-lo, basta fazer
o seguinte comando:

```
> db.dropUser("mpi")
true
```

# 3. HABILITANDO A AUTENTICAÇÃO

Vamos supor que tenha instalado o MongoDB no Windows e tenha criado o usuário administrador "mpi" como descrito acima.
Se tentar logar utilizando password você verá a mensagem: ** WARNING: Access control is not enabled for the database.

Como demonstrado abaixo:

```
C:\wamp\www\_2020\anotacoes_2020>mongo -u mpi -p senha123 --authenticationDatabase admin
MongoDB shell version v4.2.3
connecting to: mongodb://127.0.0.1:27017/?authSource=admin&compressors=disabled&gssapiServiceName=mongodb
Implicit session: session { "id" : UUID("d29f9601-0d0e-4862-b204-73b17bb360f6") }
MongoDB server version: 4.2.3
Server has startup warnings:
2020-02-19T07:47:18.474-0300 I  CONTROL  [initandlisten]
2020-02-19T07:47:18.474-0300 I  CONTROL  [initandlisten] ** WARNING: Access control is not enabled for the database.
2020-02-19T07:47:18.474-0300 I  CONTROL  [initandlisten] **          Read and write access to data and configuration is unrestricted.
2020-02-19T07:47:18.478-0300 I  CONTROL  [initandlisten]
---
Enable MongoDB's free cloud-based monitoring service, which will then receive and display
metrics about your deployment (disk utilization, CPU, operation statistics, etc).

The monitoring data will be available on a MongoDB website with a unique URL accessible to you
and anyone you share the URL with. MongoDB may use this information to make product
improvements and to suggest MongoDB products and deployment options to you.

To enable free monitoring, run the following command: db.enableFreeMonitoring()
To permanently disable this reminder, run the following command: db.disableFreeMonitoring()
---
>
```

## 3.1. ATIVANDO A AUTENTICAÇÃO NO: WINDOWS

A autenticação está ativada no **mongod.conf** ou, no caso do windows, **mongod.cfg**. Depois de ativá-lo e reiniciá-lo mongod, os usuários ainda poderão se conectar ao Mongo sem fazer a autenticação, mas precisarão fornecer um nome de usuário e uma senha para poderem interagir.

Vamos abrir o arquivo de configuração:

```bash
sudo joe /etc/mongod.conf

No Windows:
C:\Program Files\MongoDB\Server\4.2\bin\mongod.cfg
```

Na seção **#security**, removeremos o hash (#) na frente da palavra **security** para ativar a sub-rotina. Então vamos adicionar a configuração de autorização. Quando terminarmos, as linhas devem se parecer com o trecho abaixo:

```ini
# how the process runs
processManagement:
  timeZoneInfo: /usr/share/zoneinfo

security:
  authorization: "enabled"
```

Reinicie o serviço:

```bash
sudo service mongod restart
```

# 4. RESTART NO WINDOWS

No Windows reinicie no **PROMPT ELEVATED**:

```bash
net stop MongoDB
```

```bash
net start MongoDB
```


# 5. MONGODB E MONGOOSE

Uma vez instalado o MONGODB e configurado o Administrador Geral faça:


# 6. DELETANDO BDs no MONGODB

1) Autentique-se como admin

```
mongo -u mpi -p senha123 --authenticationDatabase admin
```

2) Liste os BDs:

```
use admin
> show dbs
admin       0.000GB
cep_201910  0.158GB
cnpj_api    9.124GB
config      0.000GB
local       0.000GB
```

3) Deletando os BDs cep_201910 e cnpj_api:

Problemas de Não autorizado são resolvidos colocando o usuário como:

db.grantRolesToUser("mpi",["root"])

```
> use cep_201910
switched to db cep_201910
> db.dropDatabase()
{ "dropped" : "cep_201910", "ok" : 1 }
> use cnpj_api
switched to db cnpj_api
> db.dropDatabase()
{ "dropped" : "cnpj_api", "ok" : 1 }
> show dbs
admin   0.000GB
config  0.000GB
local   0.000GB
```


# 7. CRIANDO UM BANCO DE DADOS e UM USUARIO ADMIN DO BD

1) Autentique-se

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


## 7.1. PERMISSÕES PARA O USUÁRIO MPI

```
> use admin
switched to db admin
> db.grantRolesToUser("mpi",["readWrite"])
> db.grantRolesToUser("mpi",["root"])
> db.grantRolesToUser("admin",["readWrite"])
> db.grantRolesToUser("admin",["root"])
> db.grantRolesToUser("ampere",["readWrite"])
> db.grantRolesToUser("ampere",["root"])
```

## 7.2. RESTAURANDO O CNPJ .BSON DESCOMPACTADO PARA - knowledge_mongo_db

mongorestore --verbose -u admin_knowledge -p knowledge --authenticationDatabase knowledge_mongo_db --authenticationMechanism SCRAM-SHA-256 -d knowledge_mongo_db --collection cnpj cnpj.bson


## 7.3. RESTAURANDO O CEP .BSON DESCOMPACTADO PARA - knowledge_mongo_db

Dica: abra uma sesão do SCREEN: screen -S recupera_cep

mongorestore --verbose -u admin_knowledge -p knowledge --authenticationDatabase knowledge_mongo_db --authenticationMechanism SCRAM-SHA-256 -d knowledge_mongo_db --collection cep cep.bson



# 8. BACKUP DOS BDs com GZIP - porém na hora de restaurar tem que descompactar

mongodump -v -d knowledge_mongo_db -h localhost -u  mpi -p senha123 --authenticationDatabase admin --authenticationMechanism SCRAM-SHA-256 --gzip --out ./knowledge_mongo_db_`date +"%m-%d-%y"`


mongodump -v -d cnpj_api -h localhost -u  mpi -p senha123 --authenticationDatabase admin --authenticationMechanism SCRAM-SHA-256 --gzip --out ./cnpj_api_bak



# 9. CONEXÃO COM O MONGODB

# 10. CRIANDO UMA CONEXÃO COM O BD - knowledge_mongo_db em MONGODB

O BD knowledge_mongo_db contem as collections de CEP e CNPJ que nos auxiliarão
no cadastro de CLIENTES no BD MySQL.


```
npm i -S mongoose
```

Vamos aproveitar e passar a utilizar as colors do console.
Instale:
```
npm i -S colors
```

Exemplo de uso:
```javascript
  console.log(
    `MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold,
  );
```

Conexão com o BD knowledge_mongo_db

USER: admin_knowledge
PASS: knowledge
BD: knowledge_mongo_db

```ini
# MONGODB 
MONGO_URI=mongodb://admin_knowledge:knowledge@127.0.0.1:27017/knowledge_mongo_db
```


# 11. CONEXAO COM O BD MONGO

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

index.js:

```javascript
require('dotenv').config();
const { ApolloServer, gql } = require('apollo-server');
const { importSchema } = require('graphql-import');
const connectDBMongo = require('./config/mongodb');

/** BD knowledge_mongo_db */
connectDBMongo();

const resolvers = require('./resolvers');
const context = require('./config/context');

const schemaPath = './schema/index.graphql';
const server = new ApolloServer({
  typeDefs: importSchema(schemaPath),
  resolvers,
  context,
});

server.listen().then(({ url }) => {
  console.log(`Executando em ${url}`);
});
```


# 12. EXTRA - DOTENV

Obs: caso deseje trocar o arquivo onde estão as variáveis utilize o seguinte
comando:

```javascript
const dotenv = require("dotenv");

dotenv.config({ path: "./config/config.env" });
```