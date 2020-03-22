const path = require('path');

module.exports = () => stylus =>
  stylus.include(path.resolve(__dirname, './src/style'));
