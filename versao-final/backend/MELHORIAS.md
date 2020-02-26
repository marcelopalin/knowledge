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

# 5. DEFINIDO AS PASTAS STATICS

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


# 7. SCHEDULER - atualizando as estatísticas do MYSQL -> MONGODB

Inicializando o projeto com nodemon e debug do vscode:

```bash
 npm start

> backend@1.0.0 start C:\wamp64\www\_2020\knowledge\versao-final\backend
> nodemon --inspect --ext js,graphql

[nodemon] 1.18.4
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: *.*
[nodemon] starting `node --inspect index.js`
Debugger listening on ws://127.0.0.1:9229/d9a13e19-6105-4f67-9f9c-4fc1160d9506
For help, see: https://nodejs.org/en/docs/inspector
consign v0.1.6 Initialized in C:\wamp64\www\_2020\knowledge\versao-final\backend
+ .\config\passport.js
+ .\middlewares\middlewares.js
+ .\middlewares\morgan.js
+ .\middlewares\errorHandler.js
+ .\middlewares\logger.js
+ .\api\validation.js
+ .\api\article.js
+ .\api\auth.js
+ .\api\category.js
+ .\api\queries.js
+ .\api\stat.js
+ .\api\user.js
+ .\schedule\statsSchedule.js
+ .\routes\articles.js
+ .\routes\categories.js
+ .\routes\login.js
+ .\routes\stats.js
+ .\routes\users.js
Loaded CORS!
NODE_ENV: development
Backend Connected: 3000
```

Lembrando que nós configuramos o Scheduler e colocamos ele para iniciar junto com o Consign():

```js
/** Obs:
 * A ordem da carga é importante, precisamos carregar as rotas depois
 * de carregarmos os arquivos com as funções da pasta api.
 */
consign()
  .include('./config/passport.js')
  .then('./middlewares/middlewares.js')
  .then('./middlewares/morgan.js')
  .then('./middlewares/errorHandler.js')
  .then(
    './middlewares/logger.js',
  ) /** Apenas para entender como funciona o middleware */
  .then('./api/validation.js')
  .then('./api') /** Leia os arquivos da pasta */
  .then('./schedule')
  /** Apenas para ter controle vamos carregar arquivo por arquivo */
  .then('./routes/articles.js')
  .then('./routes/categories.js')
  .then('./routes/login.js')
  .then('./routes/stats.js')
  .then('./routes/users.js')
  .into(app);
```

Vamos fazer uma ajuste para que as estatísticas sejam atualizadas a cada 5 minutos no momento do desenvolvimento, senão ficará aparecendo a saída:

```bash
Rodando as estatísticas!
Numero de Users 3
Numero de Categorias 3
Numero de Artigos 1
```

Vá no arquivo schedule\statsSchedule.js e altere a linha:

```js
const schedule = require('node-schedule');

module.exports = app => {
  schedule.scheduleJob('*/30 * * * * *', async function() {
    console.log(`Rodando as estatísticas!`.red);
```

Para rodar a cada 5 minutos imprimindo a hora que atualizou as estatísticas.
O que é atualizar as estatísticas? É consultar o BD1 - MySQL e atualizar o BD2 - MongoDB.

```js
module.exports = app => {
  schedule.scheduleJob('*/5 * * * *', async function() {
    const today = new Date();
    const todayFmt = `${today.getFullYear()}-${today.getMonth() +
      1}-${today.getDate()}`;
    const now = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;

    console.log(`Rodando as estatísticas: ${now} ${todayFmt}`.red);
```

Como resultado temos:

```bash
Rodando as estatísticas: 11:40:0 2020-2-25
Numero de Users 3
Numero de Categorias 3
Numero de Artigos 1
```

## 7.1. Alterando a Consulta do Knex para funcionar com MySQL o que era PostgreSQL

Tivemos que adaptar as consultas de contagem de Users, Categories e Articles em schedule\statsSchedule.js para:

```js
const usersCount = await app
      .db('users')
      .count('id as count')
      .first();
    console.log(`Numero de Users ${usersCount.count}`.red);
    const categoriesCount = await app
      .db('categories')
      .count('id as count')
      .first();
    console.log(`Numero de Categorias ${categoriesCount.count}`.red);
    const articlesCount = await app
      .db('articles')
      .count('id as count')
      .first();
    console.log(`Numero de Artigos ${articlesCount.count}`.red);
```

Foi colocado os apelidos "as count" para que pudéssemos acessar o número com ${usersCount.count}.. etc.

# 8. ADAPTANDO A CONSULTA DE CATEGORIAS E ARTIGOS

Problema: ao compilarmos o FrontEnd poderemos perceber que não será possível navegar nos artigos selecionando as categorias, pois a consulta é mais complexa e foi preparada para o PostgreSQL o que faremos agora é acertá-la para o MySQL.

Abra um outro terminal e inicie o FrontEnd:

Antes verifique em src\global.js se está apontando para a URL e porta do Backend:

```js
import Vue from 'vue'

export const userKey = '__knowledge_user'
export const baseApiUrl = 'http://localhost:3000'
```

e então digite npm run serve.
Acesse a url: http://localhost:8080/

Volte no console do backend e veja que as consultas que foram realizadas foram:

```bash
GET /categories/tree 200 165 bytes 29.652 ms
GET /stats 200 119 bytes 31.345 ms
```

Já acertamos a primeira consulta: /stats
Isto pode e deve ser verificado pelo POSTMAN

>> LEMBRE-SE DE UTILIZAR A SEGUINTE DICA PARA ARMAZENAR O TOKEN
NO POSTMAN.

Na aba **Tests** da requisição POST - login/signin ou register coloque o seguinte comando:

```js
pm.environment.set("TOKEN", pm.response.json().token)
```

Após efetuar o login clique no ícone que **parece um olho** no topo direito do POSTMAN (**Environment quick look**)
e você verá que a variável TOKEN foi definida. 
Nas requisições que precisam do TOKEN - coloque a palavra {{TOKEN}} e tudo estará resolvido.




# 9. ALTERAÇÃO 02 - ROUTES

Utilizando o pacote routes do express. As rotas estavam tudo em um único arquivo, agora colocamos dentro da pasta routes em arquivos separados.

routes\articles.js
routes\categories.js
routes\users.js ...

# 10. COPIADO A PASTA Utils do projeto

Do curso Node.js API Masterclass With Express & MongoDB - (https://github.com/marcelopalin/devcamper-api)

Instalado os packages: 
- npm i -S nodemailer
- npm i -S node-geocoder


# 11. ALTERAÇÃO: INSERINDO O ERROR HANDLER DO EXPRESS

Node.js API Masterclass With Express & MongoDB (CURSO I)

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

Depois de pronto o arquivo middlewares\errorHandler.js e devidamente importando no index.js
