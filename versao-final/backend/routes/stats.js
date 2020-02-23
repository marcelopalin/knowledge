const admin = require('../config/admin');

module.exports = app => {
  app
    .route('/stats')
    .all(app.config.passport.authenticate())
    .get(app.api.stat.get);
};
