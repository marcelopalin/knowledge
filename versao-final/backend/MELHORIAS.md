# 1. INTENÇÃO

Aplicar o que foi aprendido nos outros cursos neste aqui com a intenção de melhorá-lo.

- Dicas de outros cursos:
- Node.js API Masterclass With Express & MongoDB (CURSO I)
- API REST em Node.JS aplicando testes (TDD) desde o princípio (CURSO II)

Do curso Node.js API Masterclass With Express & MongoDB - (https://github.com/marcelopalin/devcamper-api)

Utilizar como fazer a documentação utilizando o POSTMAN e também os Middlewares de Captura de Erros do Express.

A forma de criar corretamente uma rota é criando um Teste no JEST (CURSO II) e documentando ela no POSTMAN (CURSO I).

Para isto colocarei um tutorial dentro do DOC.

# 2. ALTERAÇÃO: lugar de middlewares.js

Coloquei o arquivo middleware.js dentro da pasta **middlewares**.

https://medium.com/@mmajdanski/express-body-parser-and-why-may-not-need-it-335803cd048c

Não será mais necessário instalarmos o pacote body-parser.

A partir de Express 4.16+ utilize:

```javascript
app.use(express.json()); //Used to parse JSON bodies
```

No package.json removi:   "body-parser": "1.18.3",
Porque o Express usado é: "express": "4.16.3",

# 3. UTILIZANDO O MIDDLEWARE MORGAN NO DESENVOLVIMENTO

```
npm i -S morgan
```
No index.js importe:

```js
const morgan = require('morgan');
```

E coloque o seguinte código abaixo da instância do app:

```

```

# 4. FAZENDO O LINT DOS ARQUIVOS

Leia em ESLINT-VSCODE.md

# 5. DEFINIDO AS PASTAS ESTÁTICAS

https://expressjs.com/pt-br/guide/using-middleware.html

Em middlewares\middlewares.js

```js
    // Set static folder
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.static(path.join(__dirname, 'uploads')));
```


# 6. ALTERAÇÃO: Usando COLORS e DOTENV

As configurações estão agora dentro do arquivo config\config.env e agora
vamos utilizar o pacote colors para imprimir mensagens coloridas no console.

```js
var colors = require('colors');
 
console.log('hello'.green); // outputs green text
console.log('i like cake and pies'.underline.red) // outputs red underlined text
console.log('inverse the color'.inverse); // inverses the color
console.log('OMG Rainbows!'.rainbow); // rainbow
console.log('Run the trap'.trap); // Drops the bass
```

A alteração no index.js:

```js
const colors = require('colors')
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
```

> ATENÇÃO: depois que foram importados no index.js eles podem ser utilizados
> em qualquer arquivo do projeto sem a necessidade de ficar importanto devido o Consign.


# 7. ALTERAÇÃO: ERROR HANDLER DO EXPRESS

No curso I ela foi definida inicialmente como:

```js
const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  // Log to console for dev
  // err é um objeto que tem stack que nos dá o erro
  // red é do pacote de cors
  console.log(err.stack.red);


  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};

module.exports = errorHandler;
```

Onde deveríamos importar no index.js e depois utilizar o middleware:

```js
const errorHandler = require('./middleware/error');
app.use(errorHandler);
```

Seguindo o padrão do CONSIGN temos:

```js
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
```


# 8. ALTERAÇÃO 02 - ROUTES

Utilizando o pacote routes do express. As rotas estavam tudo em um único arquivo, agora colocamos dentro da pasta routes em arquivos separados.

routes\articles.js
routes\categories.js
routes\users.js ...

# COPIADO A PASTA Utils do projeto

Do curso Node.js API Masterclass With Express & MongoDB - (https://github.com/marcelopalin/devcamper-api)

Instalado os packages: 
- npm i -S nodemailer
- npm i -S node-geocoder

# JEST - TDD

