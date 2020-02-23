const admin = require('../config/admin');

module.exports = app => {
  app
    .route('/users')
    .all(app.config.passport.authenticate())
    .post(admin(app.api.user.save))
    .get(admin(app.api.user.get));

  app
    .route('/users/:id')
    .all(app.config.passport.authenticate())
    .put(admin(app.api.user.save))
    .get(admin(app.api.user.getById))
    .delete(admin(app.api.user.remove));
};
