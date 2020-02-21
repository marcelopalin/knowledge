https://github.com/marcelopalin/knowledge

OBS:
Se estiver trabalhando no Windows não esqueça de inicializar o MySQL ou WampServer.


Verificando antes se o usuário admin já existe:

```
select user, password, host from mysql.user;
```

```
mysql> select user, host from mysql.user;           
+--------------------+-----------+
| user               | host      |
+--------------------+-----------+
| admin_grapql       | %         |
| admin_grapql       | localhost |
| homestead          | localhost |
| mysql.session      | localhost |
| mysql.sys          | localhost |
| root               | localhost |
+--------------------+-----------+
14 rows in set (0.00 sec)
```

Podemos ver que não existe o usuário então vamos criá-lo.

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

