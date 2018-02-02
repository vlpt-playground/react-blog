require('dotenv').config();

const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const api = require('./api');

const mongoose = require('mongoose');

const {
  PORT: port = 4000, // 값이 존재하지 않는다면 4000 을 기본값으로 사용
  MONGO_URI: mongoURI
} = process.env;

mongoose.Promise = global.Promise; // Node 의 Promise 를 사용 하도록 설정
mongoose.connect(mongoURI).then(() => {
  console.log('connected to mongodb');
}).catch((e) => {
  console.error(e);
});

const app = new Koa();
const router = new Router();

// 라우터 설정
router.use('/api', api.routes()); // api 라우트 적용

// 라우터 적용전에, bodyParser 적용
app.use(bodyParser());

// app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => {
  console.log('listening to port', port);
});