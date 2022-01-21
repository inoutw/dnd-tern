import React, { useCallback, useEffect, createElement } from 'react';
import { Route, Switch, useLocation, useHistory, Redirect } from 'react-router-dom';
import { MenuOutlined, AppstoreOutlined } from '@ant-design/icons';
import Loading from 'components/Loading';
import NormalForm from './NormalForm';
import NormalTable from './NormalTable';
import { NormalMenu } from 'csmp-ui';
import style from './style.module.scss';
import { common } from 'assets';
import NotFound from 'pages/404';
import { getValueInUrl } from 'utils';
import classnames from 'classnames';
import Header from './Header';
import DragAndDrop from './DragAndDrop';

export const MenuData = [
  {
    key: '/menu',
    title: '菜单管理',
    icon: <MenuOutlined />
  },
  {
    key: '/subapp',
    title: '子应用管理',
    icon: <AppstoreOutlined />
  },
  {
    key: '/config-center',
    title: '配置中心',
    children: [
      {
        key: 'system-register',
        title: '应用注册'
      },
      {
        key: 'menu-setting',
        title: '菜单配置'
      }
    ]
  },
  {
    key: '/sub-system',
    title: '子应用',
    children: [
      {
        key: '/sub-system/app-react',
        title: 'app-react'
      },
      {
        key: '/sub-system/app-vue',
        title: 'app-vue'
      }
    ]
  }
];

const AppLayout: React.FC<{}> = () => {
  const location = useLocation();
  const history = useHistory();
  const hideMenu = getValueInUrl('hidemenu') === 'yes';
  useEffect(() => {
    if (location.pathname === '/app') {
      history.push('/app/menu');
    }
  }, [location, history]);

  const dataTransform = useCallback((menuData: any[]) => {
    let result = [];
    for (let item of menuData) {
      let { children, title: name, key, ...restProps } = item;
      let subMenu: any[] = [];
      if (children) {
        subMenu = dataTransform(children);
      }
      result.push({ key, subMenu, name, ...restProps });
    }
    return result;
  }, []);
  return (
    <div className={style['main-container']}>
      {!hideMenu && (
        <div className={style['menu-container']}>
          <div className={style['logo-wrap']}>
            <img src={common.logo_menu} alt="自定义" />
          </div>
          <NormalMenu menuList={MenuData} dataTransform={dataTransform} history={history} basePath="/app" lightRouteMap={{}}></NormalMenu>
        </div>
      )}

      <div className={style['right-container']}>
        {!hideMenu && (
          <div className={style['head-container']}>
            <Header />
          </div>
        )}
        <div
          id="content-container"
          className={classnames({
            [style['content-container']]: true,
            [style['hide-menu']]: !!hideMenu
          })}>
          <div className={style['route-view-container']}>
            <React.Suspense fallback={<Loading />}>
              <Switch>
                <Route exact path="/app" render={() => <Redirect to="/app/menu" />} />
                <Route path="/app/menu" render={() => <DragAndDrop />} />
                <Route path="/app/dnd" render={() => <NormalTable />} />
                <Route path="/app/subapp" render={() => <NormalForm />} />
                <Route render={() => createElement(NotFound)} />
              </Switch>
            </React.Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
