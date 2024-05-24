const fs = require('fs')
const path = require('path');
const port = 8080; // dev port
module.exports = {
  devServer: {
    port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'certs/localhost-key.pem') ),
      cert: fs.readFileSync(path.resolve(__dirname, 'certs/localhost.pem'))
    },
  },
};