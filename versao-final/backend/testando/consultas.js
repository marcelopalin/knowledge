const db = require('../config/db');

db('users').then(res => console.log(res));
