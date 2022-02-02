const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const offersRouter = require("./routes/offers.routes");
const usersRouter = require("./routes/users.routes");
const ordersRouter = require("./routes/orders.routes");
const captchaRouter = require("./routes/captcha.routes");
const connectDatabase = require("./db/db-connection");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/store', offersRouter);
app.use('/user', usersRouter, ordersRouter, captchaRouter);
app.use('/order', ordersRouter);
app.use(express.static('server'));
connectDatabase();

module.exports = app;
