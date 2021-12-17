import React from 'react';
import { ConfigProvider } from 'antd';
import { Switch, BrowserRouter, Route, Redirect } from 'react-router-dom';
import zhCN from 'antd/es/locale/zh_CN';
import Loading from 'components/Loading'; // TODO -> csmp-ui
import { getBaseUrl } from 'qiankun-config';
import NotFound from 'pages/404'; // TODO -> csmp-ui 403
const AppEntrance = React.lazy(() => import('pages/app'));
const AuthEntrance = React.lazy(() => import('pages/auth'));
// TODO
// 1.登录问题 globalContext
// 2.菜单布局 左右 or 上下
// 3.支持?hidemenu=yes 关闭菜单

const App: React.FC<{}> = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <BrowserRouter basename={getBaseUrl()}>
        <React.Suspense fallback={<Loading />}>
          {/* 一级菜单 */}
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/app" />} />
            <Route path="/app" render={() => React.createElement(AppEntrance)} />
            <Route path="/login" render={() => React.createElement(AuthEntrance)} />

            <Route render={() => React.createElement(NotFound)} />
          </Switch>
        </React.Suspense>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
