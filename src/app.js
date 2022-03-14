const express = require('express');
const cors = require('cors');
const route = require('./routes');
const bodyParser = require('body-parser')
const db = require('./config/db.config');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');

app.use("*", cors());
app.use('./uploads', express.static('./uploads'));

app.use(bodyParser.json({limit: '50mb'}) );
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true,
  parameterLimit:50000
}));

db.authenticate()
     .then(() => {
          console.log('database connected');
     })
     .catch(err => {
          console.error('Error database disconnected ->:', err);
     });

app.use('/', route);

app.listen(port, () => {
    console.log(`Server is running localhost:${port}`);
});