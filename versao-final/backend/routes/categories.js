const admin = require('../config/admin');

module.exports = app => {
  app
    .route('/categories')
    .all(app.config.passport.authenticate())
    .get(admin(app.api.category.get))
    .post(admin(app.api.category.save));

  // Cuidado com ordem! Tem que vir antes de /categories/:id
  app
    .route('/categories/tree')
    .all(app.config.passport.authenticate())
    .get(app.api.category.getTree);

  app
    .route('/categories/:id')
    .all(app.config.passport.authenticate())
    .get(app.api.category.getById)
    .put(admin(app.api.category.save))
    .delete(admin(app.api.category.remove));

  app
    .route('/stats')
    .all(app.config.passport.authenticate())
    .get(app.api.stat.get);
};
