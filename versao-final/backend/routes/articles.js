const admin = require('../config/admin');

module.exports = app => {
                          app
                            .route('/articles')
                            .all(app.config.passport.authenticate())
                            .get(admin(app.api.article.get))
                            .post(admin(app.api.article.save));

                          app
                            .route('/articles/:id')
                            .all(app.config.passport.authenticate())
                            .get(app.api.article.getById)
                            .put(admin(app.api.article.save))
                            .delete(admin(app.api.article.remove));

                          /** Consulta mais elaborada aula 354
                           *  Dado o ID da categoria busca todos os artigos
                           *  relacionados a esta categoria usando uma consulta
                           *
                           */
                          /**
                           * Ref.: https://web.archive.org/web/20181221162916/http://mikehillyer.com/articles/managing-hierarchical-data-in-mysql/
                           * https://stackoverflow.com/questions/20215744/how-to-create-a-mysql-hierarchical-recursive-query
                           * Diferença de sintaxe entre MySQL 8 e MySQL 5.x
                           */
                          app
                            .route('/categories/:id/articles')
                            .all(app.config.passport.authenticate())
                            .get(app.api.article.getByCategory);
                        };
