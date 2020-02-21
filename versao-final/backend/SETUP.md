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

Depois rode as migratons para criar as tabelas do BD MySQL com o comando:
```
npx knex migrate:latest
```