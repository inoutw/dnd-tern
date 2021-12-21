import React, { useEffect } from 'react';
import { Route, Switch, useLocation, useHistory, Redirect } from 'react-router-dom';

import { Menu } from 'antd';
import Loading from 'components/Loading';
import NormalForm from './NormalForm';
import NormalTable from './NormalTable';
import style from './style.module.scss';
const { SubMenu } = Menu;

export const MenuData = [
  {
    key: '/menu',
    title: '菜单管理',
    icon: 'menu'
  },
  {
    key: '/subapp',
    title: '子应用管理',
    icon: 'subapp'
  },
  {
    key: 'config-center',
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
    key: 'sub-system',
    title: '子应用',
    children: [
      {
        key: 'app-react',
        title: 'app-react'
      },
      {
        key: 'app-vue',
        title: 'app-vue'
      }
    ]
  }
];

const AppLayout: React.FC<{}> = () => {
  const location = useLocation();
  const history = useHistory();

  const getMenu = (menus: any[]) =>
    menus.map((m) => {
      if (m.children?.length) {
        const subMenus: any = m.children;
        return (
          <SubMenu key={m.key} title={m.title}>
            {getMenu(subMenus)}
          </SubMenu>
        );
      } else {
        return <Menu.Item key={m.key}>{m.title}</Menu.Item>;
      }
    });
  useEffect(() => {
    if (location.pathname === '/app') {
      history.push('/app/table');
    }
  }, [location, history]);

  return (
    <div className={style['main-container']}>
      <div className={style['menu-container']}>
        <div className={style['logo-wrap']}>LOGO</div>
        <Menu
          onClick={(value) => {
            history.push('/app' + value.key);
          }}
          style={{ width: '100%' }}
          defaultSelectedKeys={['home']}
          mode="inline">
          {getMenu(MenuData)}
        </Menu>
      </div>

      <div className={style['right-container']}>
        <div className={style['head-container']}></div>
        <div className={style['content-container']}>
          <div className={style['route-view-container']}>
            <React.Suspense fallback={<Loading />}>
              <Switch>
                <Route exact path="/app" render={() => <Redirect to="/app/home" />} />
                <Route path="/app/menu" render={() => <NormalTable />} />
                <Route path="/app/subapp" render={() => <NormalForm />} />
              </Switch>
            </React.Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
