# DEBUG DO BACKEND

Não inicialize o servidor pela linha de comando, utilize o DEBUG do VSCode, escolha Node.js.
Lembrando que no package.json devemos incorporar o --inspect no comando.

```json
  "scripts": {
    "start": "nodemon --inspect --ext js,graphql",
    "production": "pm2 start index.js --name knowledge-backend"
  },
```