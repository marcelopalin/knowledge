# O FATO DE ESTARMOS UTILIZANDO MYSQL 8

É necessário colocarmos .unsigned() nas chaves estrangeiras.

Inicialmente alteramos migrations/20180927160306_create_table_categories.js colocando .unsigned() para parentId:

```js
exports.up = function(knex, Promise) {
  return knex.schema.createTable('categories', table => {
    table.increments('id').primary();
    table.string('name').notNull();
    table
      .integer('parentId')
      .unsigned()
      .references('id')
      .inTable('categories');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('categories');
};
```

E nas chaves estrangeiras de migrations/20180927160322_create_table_articles.js


```js
exports.up = function(knex, Promise) {
  return knex.schema.createTable('articles', table => {
    table.increments('id').primary();
    table.string('name').notNull();
    table.string('description', 1000).notNull();
    table.string('imageUrl', 1000);
    table.binary('content').notNull();
    table
      .integer('userId')
      .unsigned()
      .references('id')
      .inTable('users')
      .notNull();
    table
      .integer('categoryId')
      .unsigned()
      .references('id')
      .inTable('categories')
      .notNull();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('articles');
};
```

