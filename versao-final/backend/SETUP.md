# SETUP

Veja no README como criar os BDs em MYSQL e MONGODB.


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

Instale os pacotes:

```
npm i
```

# MIGRATIONS MYSQL

Rode as migratons para criar as tabelas do BD MySQL

```
npx knex migrate:latest
```

# SEED

* Somente depois de ter rodados as Migrations com: **npx knex migrate:latest**

Atenção: se for rodar o SEED pela segunda vez é melhor deletar o BD, pois
os IDs são autoincrement, e a inserção de Autores e Artigos estão com os IDs fixos.


## SEED NA PRIMEIRA VEZ

```
npx knex seed:run
```

## SEED DA SEGUNDA VEZ EM DIANTE

```
 drop database knowledge_db; 
Query OK, 5 rows affected (0.03 sec)
CREATE DATABASE knowledge_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
```

```
npx knex migrate:latest
npx knex seed:run
```


# RODANDO O BACKEND

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

```
npm start
```

# PRODUÇÃO

Devemos ter o pm2 instalado:

```
npm run production
```