import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter, matchPath } from 'react-router';
import { Provider } from 'react-redux';
import configure from 'store/configure';
import routes from './routes';
import axios from 'axios';
import transit from 'transit-immutable-js';

import App from 'components/App';

const render = async (ctx) => {
  const { url, origin } = ctx;
  axios.defaults.baseURL = origin;

  // 요청이 들어올때마다 새 스토어를 만듭니다
  const store = configure();

  const promises = [];
  // 라우트 설정에 반복문을 돌려서 일치하는 라우트를 찾습니다
  routes.forEach(
    route => {
      const match = matchPath(url, route);
      if(!match) return; // 일치하지 않으면 무시
      // match 가 성공하면, 해당 라우트의 컴포넌트의 preload 를 호출
      // 그리고, 파싱된 params 를 preload 함수에 전달
      const { component } = route;
      const { preload } = component;
      if(!preload) return; // preload 없으면 무시
      const { params } = match; // Route 의 props 로 받는 match 와 동일한 객체
      // preload 를 통해 얻은 프로미스를 promises 배열에 등록
      const promise = preload(store.dispatch, params);
      promises.push(promise);
    }
  );

  try {
    // 등록된 모든 프로미스를 기다립니다.
    await Promise.all(promises);
  } catch (e) {

  }

  const preloadedState = JSON.stringify(transit.toJSON(store.getState()))
  .replace(/</g, '\\u003c');
  
  // renderToString 은 렌더링된 결과물을 문자열로 만들어줍니다.
  // 서버에서는 BrowserRouter 대신에 StaticRouter 를 사용합니다.
  const html = ReactDOMServer.renderToString(
    <Provider store={store}>
      <StaticRouter location={url}>
        <App/>
      </StaticRouter>
    </Provider>
  );

  return { html, preloadedState };
}

export default render;