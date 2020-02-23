# BODY PARSER MIDDLEWARE JÁ ESTÁ INCORPORADO NO EXPRESS 4.16+

https://medium.com/@mmajdanski/express-body-parser-and-why-may-not-need-it-335803cd048c

Não será mais necessário instalarmos o pacote body-parser.

A partir de Express 4.16+ utilize:

```javascript
app.use(express.json()); //Used to parse JSON bodies
```
