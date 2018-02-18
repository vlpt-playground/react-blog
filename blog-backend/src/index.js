require('dotenv').config();

const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');

const api = require('./api');

const mongoose = require('mongoose');
const ssr = require('./ssr');

const path = require('path');
const serve = require('koa-static');


const {
  PORT: port = 4000, // 값이 존재하지 않는다면 4000 을 기본값으로 사용
  MONGO_URI: mongoURI,
  COOKIE_SIGN_KEY: signKey
} = process.env;

const staticPath = path.join(__dirname, '../../blog-frontend/build');

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
router.get('/', ssr);


// 라우터 적용전에, bodyParser 적용
app.use(bodyParser());

const sessionConfig = {
  maxAge: 86400000, // 하루
  // signed: true (기본으로 설정되어있습니다.)
};

app.use(session(sessionConfig, app));
app.keys = [signKey];

// app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());
app.use(serve(staticPath)); // 주의: serve 가 ssr 전에 와야 합니다
app.use(ssr); // 일치하는 것이 없으면 ssr 을 실행합니다

app.listen(port, () => {
  console.log('listening to port', port);
});