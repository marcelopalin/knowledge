const schedule = require('node-schedule');

module.exports = app => {
  schedule.scheduleJob('*/30 * * * * *', async function() {
    console.log(`Rodando as estatísticas!`.red);

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
    const { Stat } = app.api.stat;

    const lastStat = await Stat.findOne(
      {},
      {},
      { sort: { createdAt: -1 } },
    );

    const stat = new Stat({
      users: usersCount.count,
      categories: categoriesCount.count,
      articles: articlesCount.count,
      createdAt: new Date(),
    });

    const changeUsers = !lastStat || stat.users !== lastStat.users;
    const changeCategories =
      !lastStat || stat.categories !== lastStat.categories;
    const changeArticles =
      !lastStat || stat.articles !== lastStat.articles;

    if (changeUsers || changeCategories || changeArticles) {
      stat
        .save()
        .then(() => console.log('[Stats] Estatíticas atualizadas!'));
    }
  });
};
