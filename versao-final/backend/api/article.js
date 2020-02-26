const queries = require('./queries');

module.exports = app => {
  const { existsOrError } = app.api.validation;

  const save = (req, res) => {
    const article = { ...req.body };
    if (req.params.id) article.id = req.params.id;

    try {
      existsOrError(article.name, 'Nome não informado');
      existsOrError(article.description, 'Descrição não informada');
      existsOrError(article.categoryId, 'Categoria não informada');
      existsOrError(article.userId, 'Autor não informado');
      existsOrError(article.content, 'Conteúdo não informado');
    } catch (msg) {
      res.status(400).send(msg);
    }

    if (article.id) {
      app
        .db('articles')
        .update(article)
        .where({ id: article.id })
        .then(_ => res.status(204).send())
        .catch(err => res.status(500).send(err));
    } else {
      app
        .db('articles')
        .insert(article)
        .then(_ => res.status(204).send())
        .catch(err => res.status(500).send(err));
    }
  };

  const remove = async (req, res) => {
    try {
      const rowsDeleted = await app
        .db('articles')
        .where({ id: req.params.id })
        .del();

      try {
        existsOrError(rowsDeleted, 'Artigo não foi encontrado.');
      } catch (msg) {
        return res.status(400).send(msg);
      }

      res.status(204).send();
    } catch (msg) {
      res.status(500).send(msg);
    }
  };

  const limit = 10; // usado para paginação
  const get = async (req, res) => {
    const page = req.query.page || 1;

    const result = await app
      .db('articles')
      .count('id as count')
      .first();
    const count = parseInt(result.count);

    app
      .db('articles')
      .select('id', 'name', 'description')
      .limit(limit)
      .offset(page * limit - limit)
      .then(articles => res.json({ data: articles, count, limit }))
      .catch(err => res.status(500).send(err));
  };

  const getById = (req, res) => {
    app
      .db('articles')
      .where({ id: req.params.id })
      .first()
      .then(article => {
        article.content = article.content.toString();
        return res.json(article);
      })
      .catch(err => res.status(500).send(err));
  };

  /** Consulta mais elaborada: utiliza a consulta RAW
   *  que está escrita em api\queries.js.
   *  Objetivo: Dado o ID da Categoria
   */
  const getByCategory = async (req, res) => {
    /** ID da categoria (clicado) que vamos usar na consulta RAW
     * mais abaixo
     */
    const categoryId = req.params.id;
    /** Para paginação esperamos receber a página que está, senão consideramos
     * a página 1
     */
    const page = req.query.page || 1;

    /** CONSULTA TOP: WITH RECURSIVE
     *  Passamos a consulta e também o Parâmetro com o ID
     *  da Ca
     */
    const categories = await app.db.raw(
      queries.categoryWithChildren,
      categoryId,
    );

    console.log(JSON.stringify(categories));

    const ids = categories.rows.map(c => c.id);

    app
      .db({ a: 'articles', u: 'users' })
      .select('a.id', 'a.name', 'a.description', 'a.imageUrl', {
        author: 'u.name',
      })
      .limit(limit)
      .offset(page * limit - limit)
      .whereRaw('?? = ??', ['u.id', 'a.userId'])
      .whereIn('categoryId', ids)
      .orderBy('a.id', 'desc')
      .then(articles => res.json(articles))
      .catch(err => res.status(500).send(err));
  };

  return { save, remove, get, getById, getByCategory };
};
