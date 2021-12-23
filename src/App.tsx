import React, { useState, useEffect, createContext, useContext, lazy, Suspense, useCallback, createElement } from 'react';
import { ConfigProvider } from 'antd';
import { Switch, BrowserRouter, Route, Redirect } from 'react-router-dom';
import zhCN from 'antd/es/locale/zh_CN';
import Loading from 'components/Loading'; // TODO -> csmp-ui
import { getBaseUrl } from 'qiankun-config';
import NotFound from 'pages/404';
import eventBus from 'utils/eventBus';

const AppEntrance = lazy(() => import('pages/app'));
const AuthEntrance = lazy(() => import('pages/auth'));

interface GlobalInterface {
  isLogin: boolean;
  setIsLogin: (isLogin: boolean) => void;
}

export const GlobalContext = createContext({} as GlobalInterface);
export const useGlobalContext = () => useContext(GlobalContext);

const App: React.FC<{}> = () => {
  const [isLogin, setIsLogin] = useState(!!localStorage.getItem('isLogin'));

  const resolveRouter = useCallback(
    (Entrance: any) => {
      if (isLogin) {
        return Entrance;
      } else {
        return <Redirect to="/login" />;
      }
    },
    [isLogin]
  );

  useEffect(() => {
    const logoutFn = (a: any) => {
      localStorage.clear();
      setIsLogin(false);
      return <Redirect to="/login" />;
    };
    eventBus.on('logout', logoutFn);
    return () => {
      eventBus.remove('logout', logoutFn);
    };
  }, []);

  return (
    <GlobalContext.Provider value={{ isLogin, setIsLogin }}>
      <ConfigProvider locale={zhCN}>
        <BrowserRouter basename={getBaseUrl()}>
          <Suspense fallback={<Loading />}>
            {/* 一级菜单 */}
            <Switch>
              <Route exact path="/" render={() => <Redirect to="/app" />} />
              <Route path="/app" render={() => resolveRouter(createElement(AppEntrance))} />
              <Route path="/login" render={() => (isLogin ? <Redirect to="/app" /> : createElement(AuthEntrance))} />
              <Route render={() => createElement(NotFound)} />
            </Switch>
          </Suspense>
        </BrowserRouter>
      </ConfigProvider>
    </GlobalContext.Provider>
  );
};

export default App;
