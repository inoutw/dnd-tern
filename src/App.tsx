import React from 'react';
import { ConfigProvider } from 'antd';
import { Switch, BrowserRouter, Route, Redirect } from 'react-router-dom';
import zhCN from 'antd/es/locale/zh_CN';
import Loading from 'components/Loading';
import { getBaseUrl } from 'qiankun-config';
import NotFound from 'pages/404';
const AppEntrance = React.lazy(() => import('pages/app'));
const PreviewEntrance = React.lazy(() => import('pages/preview'));
const App: React.FC<{}> = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <BrowserRouter basename={getBaseUrl()}>
        <React.Suspense fallback={<Loading />}>
          {/* 一级菜单 */}
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/app" />} />
            <Route path="/app" render={() => React.createElement(AppEntrance)} />
            <Route path="/preview" render={() => React.createElement(PreviewEntrance)} />
            <Route render={() => React.createElement(NotFound)} />
          </Switch>
        </React.Suspense>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
