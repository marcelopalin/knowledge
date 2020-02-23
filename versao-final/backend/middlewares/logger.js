module.exports = app => {
  // @desc    Logs request to console
  const logger = (req, res, next) => {
    console.log(
      `${`Log: ${req.method}`.green +
        ` ${req.protocol}://${req.get('host')}`.red}${
        req.originalUrl
      }`,
    );
    next();
  };

  app.use(logger);
};
