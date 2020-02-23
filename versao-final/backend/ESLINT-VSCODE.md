# LINT + ARIBNB + PRETTIER

https://travishorn.com/setting-up-eslint-on-vs-code-with-airbnb-javascript-style-guide-6eb78a535ba6

Retirado de:
https://blog.echobind.com/integrating-prettier-eslint-airbnb-style-guide-in-vscode-47f07b5d7d6a


ESLint, por que diabos estou errado?
Leia: https://medium.com/@thiagonogueira_3995/eslint-why-the-hell-am-i-wrong-6fe5c0a8e02d

```bash
npm install -D prettier jest 
npm i -D eslint eslint-config-airbnb eslint-config-airbnb-base 
npm i -D eslint-plugin-import eslint-plugin-jsx-a11y 
npm i -D eslint-plugin-react eslint-plugin-react-hooks
npx install-peerdeps --dev eslint-config-airbnb 
npm install -D eslint-config-prettier eslint-plugin-prettier
```

Resultado:

```json
  "devDependencies": {
    "eslint": "^6.1.0",
    "eslint-config-airbnb": "^18.0.1",
    "eslint-config-airbnb-base": "^14.0.0",
    "eslint-config-prettier": "^6.10.0",
    "eslint-plugin-import": "^2.20.1",
    "eslint-plugin-jsx-a11y": "^6.2.3",
    "eslint-plugin-prettier": "^3.1.2",
    "eslint-plugin-react": "^7.18.3",
    "eslint-plugin-react-hooks": "^1.7.0",
    "prettier": "1.19.1",
    "jest": "23.6.0",
    "nodemon": "^2.0.2"
  },
```


Para habilitar o Lint crie o .eslintrc.js

```
npx eslint --init
? How would you like to use ESLint? To check syntax and find problems
? What type of modules does your project use? JavaScript modules (import/export)
? Which framework does your project use? None of these
? Does your project use TypeScript? No
? Where does your code run? Browser, Node
? What format do you want your config file to be in? JavaScript
Successfully created .eslintrc.js file in /home/mpi/www/laboratorio/proj01
```

# HABILITANDO O LINT AO SALVAR NO VSCODE

The last step is to make sure Prettier formats on save. Insert "editor.formatOnSave": true into your User Settings in VSCode.
```
// Defina o padrão
"editor.formatOnSave" : false , 
// Ativar por idioma
"[javascript]" : { 
    "editor.formatOnSave" : true 
}
```

Edite .eslintrc.js para ficar igual:

```javascript
module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": ["airbnb", "prettier"],
    "plugins": ["prettier", "vue"],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
        "prettier/prettier": ["error"],
        "no-unused-vars":"off",
        "no-console":"off",
    }
};
```

Crie o arquivo .prettierrc

```json
{
    "printWidth": 70,
    "tabWidth": 2,
    "semi": true,
    "useTabs": false,
    "jsxBracketSameLine": false,
    "trailingComma": "all",
    "bracketSpacing": true,
    "parser":"flow",
    "singleQuote": true
    
  }
```

No VSCode instale duas Extensões para lhe ajudar:

* **Prettier Formatter for Visual Studio Code**
* **Eslint**

# FIX - LINT DE UM ARQUIVO - NO CASO INDEX.JS

```
npx eslint index.js --fix
```

# CORRIGINDO AS REGRAS AUTOMATICAMENTE GERAL

Coloque no seu comando do package.json a seguinte configuração:

```javascript
  "scripts": {
    "test": "jest",
    "lint": "eslint . api/** config/** middlewares/** seeds/** routes/** --fix",
    "start": "nodemon --ext js,graphql"
  },
```

e agora rode:

```
npm run lint
```

