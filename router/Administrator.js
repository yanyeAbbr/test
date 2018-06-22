const controller = require('../controller/Administrator')

module.exports = function (app) {
  app.get('/Administrator/:id', controller.index)
};