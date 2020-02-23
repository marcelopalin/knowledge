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

  /** Consulta mais elaborada aula 354 */
  app
    .route('/categories/:id/articles')
    .all(app.config.passport.authenticate())
    .get(app.api.article.getByCategory);
};
