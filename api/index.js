const serverless = require('serverless-http');
const app = require('../server/server');
module.exports = serverless(app);
const app = require('../server/server');
module.exports = serverless(app);

module.exports = app;

