https://github.com/marcelopalin/knowledge

```sql
BD knowledge_db;
User: admin
Pass: 123456

CREATE DATABASE knowledge_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
CREATE USER 'admin'@'localhost' IDENTIFIED BY '123456';
CREATE USER 'admin'@'%' IDENTIFIED WITH mysql_native_password BY '123456';
GRANT ALL PRIVILEGES ON *.* TO 'admin'@'localhost';
CREATE USER 'admin'@'%' IDENTIFIED WITH mysql_native_password BY '123456';
GRANT ALL PRIVILEGES ON *.* TO 'admin'@'%';
flush privileges;
quit;
```

