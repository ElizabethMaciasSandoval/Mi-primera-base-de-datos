const knex = require('knex');
const path = require('path');
const config ={
  client: 'sqlite3',
  connection: {
    filename: (path.join(__dirname,'../db/ecommerce.sqlite'))
  },
  useNullAsDefault: true
};

const database = knex(config);

module.exports = database;