schedule\statsSchedule.js

https://www.npmjs.com/package/node-schedule

*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    │
│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
│    │    │    │    └───── month (1 - 12)
│    │    │    └────────── day of month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL)

schedule.scheduleJob('*/30 * * * * *', async function() (30 em 30 segundos!)

```js
const schedule = require('node-schedule');

module.exports = app => {
  schedule.scheduleJob('*/30 * * * * *', async function() {
    const usersCount = await app
      .db('users')
      .count('id')
      .first();
    const categoriesCount = await app
      .db('categories')
      .count('id')
      .first();
    const articlesCount = await app
      .db('articles')
      .count('id')
      .first();

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

```