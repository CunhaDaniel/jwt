const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express();

const pool = require('./database/pool_factory')
const connectionMiddleware = require('./database/pool_connect')


app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(connectionMiddleware(pool))


require('./controllers/authController')(app);
require('./controllers/foodsController')(app);

app.listen(3000);