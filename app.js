const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const indexRouter = require('./routes/index');
const app = express();

require('dotenv').config();
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use('/api', indexRouter);

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  const message = error.message || '서버 에러가 발생했습니다.';

  res.status(statusCode).json({
    status: 'fail',
    message,
  });
});

const mongoURI = process.env.LOCAL_DB_ADDRESS;

mongoose
  .connect(mongoURI, { useNewUrlParser: true })
  .then(() => console.log('mongoose connected'))
  .catch((err) => console.log('DB connection fail', err));

app.listen(process.env.PORT || 5001, () => {
  console.log('server on');
});
