# NO MÉTODO LOGIN

Na aba **Tests** da requisição POST - login/signin ou register coloque o seguinte comando:

```js
pm.environment.set("TOKEN", pm.response.json().token)
```

Após efetuar o login clique no ícone que parece um olho no topo direito do POSTMAN (Environment quick look)
e você verá que a variável TOKEN foi definida. 
Nas requisições que precisam do TOKEN - coloque a palavra {{TOKEN}} e tudo estará resolvido.