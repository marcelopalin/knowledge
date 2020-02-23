module.exports = app => {
  const errorHandler = (err, req, res, next) => {
    const error = { ...err };

    error.message = err.message;

    // Log to console for dev
    // err é um objeto que tem stack que nos dá o erro
    // red é do pacote de cors
    console.log(err.stack.red);

    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Server Error',
    });
  };

  app.use(errorHandler);
};
