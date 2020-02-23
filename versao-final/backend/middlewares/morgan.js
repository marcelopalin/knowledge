/**
 * Morgan - Gerando log das requisições HTTP
 * Agora vamos colocar o Morgan como um Middleware e ele vai interceptar
 * toda a requisição que chegar
 */
const morgan = require('morgan');

module.exports = app => {
  // Dev logging middleware
  if (process.env.NODE_ENV === 'development') {
    // Imprime uma saída mais curta
    // app.use(morgan('dev'));

    // Opção II: imprime um Log mais elaborado
    // app.use(morgan('combined'));

    // Opção III: Log Personalizado
    app.use(
      morgan(
        `:method `.brightYellow +
          `:url `.blue +
          `:status `.brightGreen +
          `:res[content-length] bytes `.red +
          `:response-time ms`.green,
      ),
    );
  }
};
